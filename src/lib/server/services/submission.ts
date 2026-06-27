import { db } from '$lib/server/db';
import { trackInUsers, submissionInUsers, xpEventsInUsers } from '$lib/server/db/schema/users';
import { itemsInClass, modulesInClass } from '$lib/server/db/schema/class';
import { eq, sql, and } from 'drizzle-orm';
import { QueueService } from '$lib/server/queue';
import { nats } from '$lib/server/nats';

const MAX_FILE_SIZE = 20 * 1024; // 20KB
const MAX_TOTAL_SIZE = 512 * 1024; // 0.5MB
const MAX_FILE_COUNT = 20;

export class SubmissionService {
	/**
	 * Validates the user's uploaded files against size and count constraints.
	 */
	static validateFiles(files: Record<string, string>): void {
		const keys = Object.keys(files);
		if (keys.length > MAX_FILE_COUNT) {
			throw new Error('TOO_MANY_FILES');
		}

		let totalSize = 0;
		for (const [filename, content] of Object.entries(files)) {
			if (filename.length > 255) {
				throw new Error('INVALID_INPUT');
			}
			const size = new Blob([content]).size;
			if (size > MAX_FILE_SIZE) {
				throw new Error('FILE_TOO_LARGE');
			}
			totalSize += size;
		}

		if (totalSize > MAX_TOTAL_SIZE) {
			throw new Error('PAYLOAD_TOO_LARGE');
		}
	}

	/**
	 * Ensures the user is enrolled in the track for this item, matching
	 * the auto-enroll behavior of the legacy Go backend.
	 */
	static async ensureEnrollment(userId: string, itemId: string) {
		const itemWithModule = await db
			.select({ trackId: modulesInClass.trackId, s3Path: itemsInClass.s3Path })
			.from(itemsInClass)
			.innerJoin(modulesInClass, eq(itemsInClass.moduleId, modulesInClass.id))
			.where(eq(itemsInClass.id, itemId))
			.limit(1)
			.then((res) => res[0]);

		if (!itemWithModule) {
			throw new Error('ITEM_NOT_FOUND');
		}

		// Auto-enroll the user in the track (do nothing if already enrolled)
		await db
			.insert(trackInUsers)
			.values({
				userId,
				trackId: itemWithModule.trackId
			})
			.onConflictDoNothing({
				target: [trackInUsers.userId, trackInUsers.trackId]
			});

		return itemWithModule;
	}

	/**
	 * Handles the fire-and-forget "Run" operation. No DB writes.
	 */
	static async handleRun(
		userId: string,
		itemId: string,
		files: Record<string, string>,
		inputs?: string
	) {
		this.validateFiles(files);
		const itemInfo = await this.ensureEnrollment(userId, itemId);

		const taskId = crypto.randomUUID();

		await QueueService.enqueueCodeExecution({
			task_id: taskId,
			user_id: userId,
			user_files: files,
			s3_base_path: itemInfo.s3Path || '',
			is_run_only: true,
			inputs
		});

		return { taskId };
	}

	/**
	 * Handles the "Test/Submit" operation. Writes PENDING to DB and queues.
	 */
	static async handleTest(userId: string, itemId: string, files: Record<string, string>) {
		this.validateFiles(files);
		const itemInfo = await this.ensureEnrollment(userId, itemId);

		const taskId = crypto.randomUUID();

		// We execute the database insert and queue publish in parallel
		// to minimize latency.
		const [ack] = await Promise.all([
			QueueService.enqueueCodeExecution({
				task_id: taskId,
				user_id: userId,
				user_files: files,
				s3_base_path: itemInfo.s3Path || '',
				is_run_only: false
			}),
			db
				.insert(submissionInUsers)
				.values({
					id: taskId,
					userId,
					itemId,
					status: 'pending',
					data: files
				})
				.onConflictDoUpdate({
					target: [submissionInUsers.userId, submissionInUsers.itemId],
					set: {
						status: 'pending',
						data: files,
						id: taskId,
						updatedAt: new Date()
					}
				})
		]);

		return { taskId, ack };
	}

	/**
	 * Handles the webhook callback from the Go Invoker.
	 * Updates the DB, assigns XP, and publishes to NATS to close the SSE stream.
	 */
	static async handleWebhookResult(payload: any) {
		const { id: taskId, result: runnerResult, job: jobResult } = payload;

		if (!taskId) throw new Error('Missing task ID');

		let submissionStatus = 'error';
		let resultsPayload = null;

		if (runnerResult) {
			submissionStatus = runnerResult.status;
			resultsPayload = runnerResult;
		}

		// 1. Update the submission table
		const updatedSubmission = await db
			.update(submissionInUsers)
			.set({
				status: submissionStatus,
				results: resultsPayload,
				metadata: jobResult
					? sql`jsonb_set(COALESCE(metadata, '{}'::jsonb), '{job}', ${JSON.stringify(jobResult)}::jsonb, true)`
					: undefined,
				attempts: sql`attempts + 1`,
				updatedAt: new Date()
			})
			.where(eq(submissionInUsers.id, taskId))
			.returning()
			.then((res) => res[0]);

		// We don't throw if not found because Run operations aren't in the DB!
		// Wait, if it's a Run operation, updatedSubmission will be undefined.
		
		// 2. Award XP if this is a passing submission that hasn't been awarded yet
		if (updatedSubmission && runnerResult && submissionStatus === 'pass' && updatedSubmission.xpReward === 0) {
			const item = await db
				.select({ baseXp: itemsInClass.baseXp, type: itemsInClass.type, id: itemsInClass.id })
				.from(itemsInClass)
				.where(eq(itemsInClass.id, updatedSubmission.itemId))
				.limit(1)
				.then((res) => res[0]);

			if (item && item.baseXp) {
				// Atomically set xpReward to prevent double-awarding on race conditions
				const xpUpdated = await db
					.update(submissionInUsers)
					.set({ xpReward: item.baseXp })
					.where(and(eq(submissionInUsers.id, taskId), eq(submissionInUsers.xpReward, 0)))
					.returning()
					.then((res) => res[0]);

				if (xpUpdated) {
					// Insert the XP event ledger entry
					await db.insert(xpEventsInUsers).values({
						userId: updatedSubmission.userId,
						xpAmount: item.baseXp,
						sourceType: `item/${item.type}`,
						sourceId: item.id
					});
				}
			}
		}

		// 3. Publish to ephemeral NATS Core to resolve the user's SSE stream instantly
		const ssePayload = {
			...payload,
			status: submissionStatus,
			results: resultsPayload
		};
		const { nc } = await nats;
		nc.publish(`results.${taskId}`, JSON.stringify(ssePayload));
	}
}

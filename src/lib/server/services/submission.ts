import { db } from '$lib/server/db';
import {
	trackInUsers,
	submissionInUsers,
	xpEventsInUsers,
	statsInUsers,
	dailyStatsInUsers
} from '$lib/server/db/schema/users';
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
		// XP awarded by this result, surfaced in the SSE payload for the popup.
		let awardedXp = 0;

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
		if (
			updatedSubmission &&
			runnerResult &&
			submissionStatus === 'pass' &&
			updatedSubmission.xpReward === 0
		) {
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
					const userId = updatedSubmission.userId;
					const xpAmount = item.baseXp;

					// Mirror the legacy Go AddXP: write the ledger entry AND roll the
					// amount up into the aggregate stats the dashboard/leaderboard read.
					// Inserting the ledger row alone leaves users.stats.total_xp at 0.
					await db.transaction(async (tx) => {
						// 1. XP event ledger entry
						await tx.insert(xpEventsInUsers).values({
							userId,
							xpAmount,
							sourceType: `item/${item.type}`,
							sourceId: item.id
						});

						// 2. Roll up into the user's total XP (source for the dashboard)
						await tx
							.insert(statsInUsers)
							.values({
								userId,
								totalXp: xpAmount,
								lastActiveAt: new Date()
							})
							.onConflictDoUpdate({
								target: statsInUsers.userId,
								set: {
									totalXp: sql`${statsInUsers.totalXp} + ${xpAmount}`,
									lastActiveAt: new Date()
								}
							});

						// 3. Roll up into today's daily stats (also fires the streak trigger)
						await tx
							.insert(dailyStatsInUsers)
							.values({
								userId,
								xpEarned: xpAmount
							})
							.onConflictDoUpdate({
								target: [dailyStatsInUsers.userId, dailyStatsInUsers.date],
								set: {
									xpEarned: sql`${dailyStatsInUsers.xpEarned} + ${xpAmount}`
								}
							});
					});

					awardedXp = xpAmount;
				}
			}
		}

		// 3. Publish to ephemeral NATS Core to resolve the user's SSE stream instantly
		const ssePayload = {
			...payload,
			status: submissionStatus,
			results: resultsPayload,
			// The client popup reads xpReward off the stream result.
			xpReward: awardedXp
		};
		const { nc } = await nats;
		nc.publish(`results.${taskId}`, new TextEncoder().encode(JSON.stringify(ssePayload)));
	}

	/**
	 * Handles a lesson submission synchronously without queuing.
	 */
	static async handleLesson(userId: string, itemId: string, data: Record<string, any>) {
		const itemInfo = await this.ensureEnrollment(userId, itemId);

		// Extract obfuscated data
		const encoded = data['_$'];
		if (typeof encoded !== 'string') {
			throw new Error('INVALID_PAYLOAD');
		}

		// Decode base64
		let decodedStr;
		try {
			decodedStr = Buffer.from(encoded, 'base64').toString('utf-8');
		} catch (e) {
			throw new Error('INVALID_PAYLOAD');
		}

		const raw = parseInt(decodedStr, 10);
		if (isNaN(raw)) {
			throw new Error('INVALID_PAYLOAD');
		}

		let percent = Math.floor(raw / 69); // Salt is 69
		if (percent > 100) percent = 100;
		if (percent < 0) percent = 0;

		const status = percent > 50 ? 'pass' : 'fail';
		
		// Check for previous submission to prevent re-awarding XP
		const existingSubmission = await db
			.select()
			.from(submissionInUsers)
			.where(and(eq(submissionInUsers.userId, userId), eq(submissionInUsers.itemId, itemId)))
			.limit(1)
			.then((res) => res[0]);

		if (existingSubmission && existingSubmission.status === 'pass') {
			// Already passed, return as is to prevent XP abuse.
			return { status: 'pass', xpReward: existingSubmission.xpReward, submissionId: existingSubmission.id };
		}

		const item = await db
			.select({ baseXp: itemsInClass.baseXp, type: itemsInClass.type, id: itemsInClass.id })
			.from(itemsInClass)
			.where(eq(itemsInClass.id, itemId))
			.limit(1)
			.then((res) => res[0]);

		if (!item) {
			throw new Error('ITEM_NOT_FOUND');
		}

		let xpReward = 0;
		if (status === 'pass' && item.baseXp) {
			xpReward = Math.floor(item.baseXp * (percent / 100));
		}

		const submissionId = existingSubmission ? existingSubmission.id : crypto.randomUUID();

		await db.transaction(async (tx) => {
			// 1. Upsert submission
			await tx
				.insert(submissionInUsers)
				.values({
					id: submissionId,
					userId,
					itemId,
					status,
					xpReward,
					data,
					attempts: existingSubmission ? existingSubmission.attempts + 1 : 1
				})
				.onConflictDoUpdate({
					target: [submissionInUsers.userId, submissionInUsers.itemId],
					set: {
						status,
						xpReward,
						data,
						attempts: sql`${submissionInUsers.attempts} + 1`,
						updatedAt: new Date(),
						id: submissionId
					}
				});

			// 2. Ledger & Stats if passed and xp > 0
			if (status === 'pass' && xpReward > 0) {
				// Ledger
				await tx.insert(xpEventsInUsers).values({
					userId,
					xpAmount: xpReward,
					sourceType: `item/${item.type}`,
					sourceId: item.id
				});

				// Total XP
				await tx
					.insert(statsInUsers)
					.values({
						userId,
						totalXp: xpReward,
						lastActiveAt: new Date()
					})
					.onConflictDoUpdate({
						target: statsInUsers.userId,
						set: {
							totalXp: sql`${statsInUsers.totalXp} + ${xpReward}`,
							lastActiveAt: new Date()
						}
					});

				// Daily XP
				await tx
					.insert(dailyStatsInUsers)
					.values({
						userId,
						xpEarned: xpReward
					})
					.onConflictDoUpdate({
						target: [dailyStatsInUsers.userId, dailyStatsInUsers.date],
						set: {
							xpEarned: sql`${dailyStatsInUsers.xpEarned} + ${xpReward}`
						}
					});
			}
		});

		return { status, xpReward, submissionId };
	}
}

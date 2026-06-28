import { db } from '..';
import { and, asc, eq, sql } from 'drizzle-orm';
import { cacheGet, cacheSet } from '$lib/server/cache';
import {
	itemsInClass as items,
	modulesInClass as modules,
	submissionInUsers as submissions,
	topicsInClass as topics,
	trackInUsers as userTracks,
	tracksInClass as tracks
} from '../schema';

export type Topic = typeof topics.$inferSelect;
export type Track = typeof tracks.$inferSelect;
export type Module = typeof modules.$inferSelect;
export type Item = typeof items.$inferSelect;
export type UserSubmission = typeof submissions.$inferSelect;
export type UserTrack = typeof userTracks.$inferSelect;

export type AllCourses = Record<
	string,
	{
		topic: Topic;
		tracks: Track[];
	}
>;

export type ItemWithSubmission = Item & {
	submission?: {
		id: string;
		status: string;
		xp_reward: number;
		attempts: number;
		created_at: Date;
		updated_at: Date;
	} | null;
};

export type ModuleWithItems = Module & {
	items: ItemWithSubmission[];
};

export class ClassRepository {
	public async getAllCourses(): Promise<AllCourses> {
		const cached = await cacheGet<AllCourses>('courses:all');
		if (cached) return cached;

		const rows = await db
			.select()
			.from(topics)
			.leftJoin(tracks, eq(topics.id, tracks.topicId))
			.orderBy(topics.id, asc(tracks.position));

		const result = rows.reduce<Record<string, { topic: Topic; tracks: Track[] }>>((acc, row) => {
			const topic = row.topics;
			const track = row.tracks;
			if (!acc[topic.id]) {
				acc[topic.id] = { topic, tracks: [] };
			}
			if (track) {
				acc[topic.id].tracks.push(track);
			}
			return acc;
		}, {});

		await cacheSet('courses:all', result, 24 * 60 * 60);
		return result;
	}

	public async getTrackBySlug(
		slug: string,
		userId?: string
	): Promise<{
		track: Track;
		modules: ModuleWithItems[];
	} | null> {
		const rows = await db
			.select({
				tracks: tracks,
				modules: modules,
				items: items,
				submissions: {
					id: submissions.id,
					status: submissions.status,
					xp_reward: submissions.xpReward,
					attempts: submissions.attempts,
					created_at: submissions.createdAt,
					updated_at: submissions.updatedAt
				}
			})
			.from(tracks)
			.where(eq(tracks.slug, slug))
			.leftJoin(modules, eq(tracks.id, modules.trackId))
			.leftJoin(items, eq(modules.id, items.moduleId))
			.leftJoin(
				submissions,
				and(eq(submissions.itemId, items.id), userId ? eq(submissions.userId, userId) : sql`false`)
			);

		if (!rows.length) {
			return null;
		}

		type ModulesWithItemsObj = Record<string, ModuleWithItems>;
		const result = rows.reduce<{ track: Track; modules: ModulesWithItemsObj }>(
			(acc, row) => {
				const module = row.modules;
				const item = row.items;
				const submission = row.submissions;

				if (!module) {
					return acc;
				}

				if (!acc.modules[module.id]) {
					acc.modules[module.id] = {
						...module,
						items: []
					};
				}

				if (item) {
					const itemWithSubmission: ItemWithSubmission = {
						...item,
						submission: submission?.id ? submission : null
					};

					acc.modules[module.id].items.push(itemWithSubmission);
				}

				return acc;
			},
			{
				track: rows[0].tracks,
				modules: {}
			}
		);

		const final = {
			track: result.track,
			modules: Object.values(result.modules)
				.sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
				.map((v) => ({
					...v,
					items: v.items.sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
				}))
		};

		return final;
	}

	public async getUserSubmissionByItem(
		userId: string,
		itemId: string
	): Promise<UserSubmission | null> {
		const submission = await db.query.submissionInUsers.findFirst({
			where: {
				userId: userId,
				itemId: itemId
			}
		});

		return submission || null;
	}

	public async getUserSubmissionById(
		userId: string,
		subId: string
	): Promise<UserSubmission | null> {
		const submission = await db.query.submissionInUsers.findFirst({
			where: {
				userId: userId,
				id: subId
			}
		});

		return submission || null;
	}

	public async getUserTracks(userId: string): Promise<UserTrack[]> {
		const cached = await cacheGet<UserTrack[]>(`user:tracks:${userId}`);
		if (cached) return cached;

		const result = await db.query.trackInUsers.findMany({
			where: { userId }
		});

		await cacheSet(`user:tracks:${userId}`, result, 600);
		return result;
	}
}

export const classRepository = new ClassRepository();

import { db } from '..';
import { and, asc, eq, sql } from 'drizzle-orm';
import {
	itemsInClass,
	modulesInClass,
	submissionInUsers,
	topicsInClass,
	trackInUsers,
	tracksInClass
} from '../generated/drizzle/schema';

export type Topic = typeof topicsInClass.$inferSelect;
export type Track = typeof tracksInClass.$inferSelect;
export type Module = typeof modulesInClass.$inferSelect;
export type Item = typeof itemsInClass.$inferSelect;
export type UserSubmission = typeof submissionInUsers.$inferSelect;
export type UserTrack = typeof trackInUsers.$inferSelect;

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
		const rows = await db
			.select()
			.from(topicsInClass)
			.leftJoin(tracksInClass, eq(topicsInClass.id, tracksInClass.topicId))
			.orderBy(topicsInClass.id, asc(tracksInClass.position));

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
				tracks: tracksInClass,
				modules: modulesInClass,
				items: itemsInClass,
				submissions: {
					id: submissionInUsers.id,
					status: submissionInUsers.status,
					xp_reward: submissionInUsers.xpReward,
					attempts: submissionInUsers.attempts,
					created_at: submissionInUsers.createdAt,
					updated_at: submissionInUsers.updatedAt
				}
			})
			.from(tracksInClass)
			.where(eq(tracksInClass.slug, slug))
			.leftJoin(modulesInClass, eq(tracksInClass.id, modulesInClass.trackId))
			.leftJoin(itemsInClass, eq(modulesInClass.id, itemsInClass.moduleId))
			.leftJoin(
				submissionInUsers,
				and(
					eq(submissionInUsers.itemId, itemsInClass.id),
					userId ? eq(submissionInUsers.userId, userId) : sql`false`
				)
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
			where: and(eq(submissionInUsers.userId, userId), eq(submissionInUsers.itemId, itemId))
		});

		return submission || null;
	}

	public async getUserSubmissionById(
		userId: string,
		subId: string
	): Promise<UserSubmission | null> {
		const submission = await db.query.submissionInUsers.findFirst({
			where: and(eq(submissionInUsers.userId, userId), eq(submissionInUsers.id, subId))
		});

		return submission || null;
	}

	public async getUserTracks(userId: string): Promise<UserTrack[]> {
		return db.query.trackInUsers.findMany({
			where: eq(trackInUsers.userId, userId)
		});
	}
}

export const classRepository = new ClassRepository();

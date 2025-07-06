import { and, asc, eq } from 'drizzle-orm';
import { db } from '..';
import {
	modules,
	items,
	topics,
	tracks,
	type Module,
	type Topic,
	type Track,
	type Item
} from '../schema/class';
import { submissions } from '../schema/submission';

export async function getAllCourses() {
	const rows = await db
		.select()
		.from(topics)
		.leftJoin(tracks, eq(topics.id, tracks.topic_id))
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
	return result;
}
export type GetAllCourses = Record<
	string,
	{
		topic: Topic;
		tracks: Track[];
	}
>;

export async function getTrackBySlug(slug: string, userId: string) {
	const rows = await db
		.select({
			tracks,
			modules,
			items,
			submissions: {
				id: submissions.id,
				status: submissions.status,
				xp_reward: submissions.xp_reward,
				attempts: submissions.attempts,
				created_at: submissions.created_at,
				updated_at: submissions.updated_at
			}
		})
		.from(tracks)
		.where(eq(tracks.slug, slug))
		.innerJoin(modules, eq(tracks.id, modules.track_id))
		.innerJoin(items, eq(modules.id, items.module_id))
		.leftJoin(submissions, and(eq(submissions.item_id, items.id), eq(submissions.user_id, userId)));

	type ItemWithSubmission = Item & {
		submission?: {
			id: string;
			status: string;
			xp_reward: number;
			attempts: number;
			created_at: Date;
			updated_at: Date;
		} | null;
	};

	type ModulesWithItems = Record<
		string,
		Module & {
			items: ItemWithSubmission[];
		}
	>;

	const result = rows.reduce<{ track: Track; modules: ModulesWithItems }>(
		(acc, row) => {
			const module = row.modules;
			const item = row.items;
			const submission = row.submissions;

			if (!acc.modules[module.id]) {
				acc.modules[module.id] = {
					...module,
					items: []
				};
			}

			// Create item with submission data
			const itemWithSubmission: ItemWithSubmission = {
				...item,
				submission: submission?.id ? submission : null
			};

			acc.modules[module.id].items.push(itemWithSubmission);
			return acc;
		},
		{
			track: rows[0]?.tracks,
			modules: {}
		}
	);

	const final = {
		track: result.track,
		modules: Object.values(result.modules)
			.sort((a, b) => {
				return a.position - b.position;
			})
			.map((v) => {
				return {
					...v,
					items: v.items.sort((a, b) => a.position - b.position)
				};
			})
	};

	return final;
}

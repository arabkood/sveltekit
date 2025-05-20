import { and, eq, inArray, isNull } from 'drizzle-orm';
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
import { userModulesSubmission, userTracks } from '../schema/users';

// FIX: ONLY FETCH NON DELETED ITEMS
export async function getAllTracks() {
	return [];
	return await db.select().from(tracks).where(isNull(tracks.deletedAt));
}

export async function getAllCourses() {
	const rows = await db.select().from(topics).leftJoin(tracks, eq(topics.id, tracks.topic_id));

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

export async function getTrackBySlug(slug: string) {
	const rows = await db
		.select()
		.from(tracks)
		.where(eq(tracks.slug, slug))
		.innerJoin(modules, eq(tracks.id, modules.track_id))
		.innerJoin(items, eq(modules.id, items.module_id));

	type ModulesWithItems = Record<
		string,
		Module & {
			items: Item[];
		}
	>;
	const result = rows.reduce<{ track: Track; modules: ModulesWithItems }>(
		(acc, row) => {
			const module = row.modules;
			const item = row.items;
			if (!acc.modules[module.id]) {
				acc.modules[module.id] = {
					...module,
					items: []
				};
			}
			acc.modules[module.id].items.push(item);
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

export async function getTrackProgress(id: string, userId: string) {
	// First get the track information
	const track = await db
		.select()
		.from(tracks)
		.where(eq(tracks.id, id))
		.limit(1)
		.execute()
		.then((res) => res[0]);

	if (!track) {
		return null;
	}

	// Get user's progress for this track
	const userTrack = await db
		.select()
		.from(userTracks)
		.where(and(eq(userTracks.trackId, id), eq(userTracks.userId, userId)))
		.limit(1)
		.execute()
		.then((res) => res[0]);

	// Get all modules for this track ordered by orderNumber
	const trackModules = await db
		.select()
		.from(modules)
		.where(eq(modules.trackId, id))
		.orderBy(modules.orderNumber);

	// Get all submissions for the user for modules in this track
	const moduleSubmissions = await db
		.select()
		.from(userModulesSubmission)
		.where(
			and(
				eq(userModulesSubmission.userId, userId),
				inArray(
					userModulesSubmission.moduleId,
					trackModules.map((m) => m.id)
				)
			)
		);

	// Get completed module IDs
	const completedModuleIds = moduleSubmissions.map((submission) => submission.moduleId);

	// Find the next uncompleted module
	const nextModule = trackModules.find((module) => !completedModuleIds.includes(module.id));

	// Calculate completion stats
	const completedModules = completedModuleIds.length;
	const totalModules = trackModules.length;
	const completionPercentage =
		totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

	return {
		track,
		userProgress: userTrack || null,
		stats: {
			totalModules,
			completedModules,
			completionPercentage,
			remainingModules: totalModules - completedModules
		},
		nextModule: nextModule ? { slug: nextModule.slug } : null,
		lastSubmission:
			moduleSubmissions.length > 0
				? moduleSubmissions.sort(
						(a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
					)[0]
				: null
	};
}

export async function getTrackContent(id: string, userId?: string) {
	const sectionsWithModulesAndCompletion = await db.transaction(async (tx) => {
		const sections = await tx
			.select()
			.from(tracksSections)
			.where(eq(tracksSections.trackId, id))
			.orderBy(tracksSections.orderNumber);

		if (sections.length === 0) {
			return [];
		}

		const sectionIds = sections.map((s) => s.id);

		const fetchedModules = await tx
			.select()
			.from(modules)
			.where(and(eq(modules.trackId, id), inArray(modules.sectionId, sectionIds)))
			.orderBy(modules.orderNumber);

		if (fetchedModules.length === 0) {
			return sections.map((section) => ({
				...section,
				modules: []
			}));
		}

		const moduleIds = fetchedModules.map((m) => m.id);
		let completedModuleIds = new Set<string>();

		if (userId && moduleIds.length > 0) {
			const submissions = await tx
				.select({ moduleId: userModulesSubmission.moduleId })
				.from(userModulesSubmission)
				.where(
					and(
						eq(userModulesSubmission.userId, userId),
						inArray(userModulesSubmission.moduleId, moduleIds)
						// Optional: Add other conditions like eq(userSubmissions.status, 'completed') here if needed
					)
				);

			completedModuleIds = new Set(submissions.map((sub) => sub.moduleId));
		}

		return sections.map((section) => {
			const sectionModules = fetchedModules
				.filter((m) => m.sectionId === section.id)
				.map((module) => ({
					...module,
					...(userId && completedModuleIds.has(module.id) && { done: true })
				}));

			return {
				...section,
				modules: sectionModules
			};
		});
	});

	return sectionsWithModulesAndCompletion;
}

export async function getModuleBySlug(slug: string) {
	return await db
		.select()
		.from(modules)
		.where(eq(modules.slug, slug))
		.limit(1)
		.execute()
		.then((res) => res[0]);
}

export async function getModuleSubmission(userId: string, moduleId: string) {
	return await db
		.select()
		.from(userModulesSubmission)
		.where(and(eq(userModulesSubmission.id, moduleId), eq(userModulesSubmission.userId, userId)))
		.limit(1)
		.execute()
		.then((res) => res[0]);
}

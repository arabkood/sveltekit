import { and, eq } from 'drizzle-orm';
import { db } from '..';
import { userModulesAttempt, userModulesSubmission, usersStats, userTracks } from '../schema/users';
import { tracks } from '../schema/class';

export async function getUserStats(userId: string) {
	const result = await db.select().from(usersStats).where(eq(usersStats.userId, userId)).limit(1);

	return result.length > 0 ? result[0] : null;
}

export async function getUserTracks(
	userId: string,
	options?: {
		includeDetails?: boolean;
	}
) {
	return [];
	const includeDetails = options?.includeDetails ?? false;

	if (includeDetails) {
		const results = await db
			.select({
				userTrack: userTracks,
				track: tracks
			})
			.from(userTracks)
			.where(eq(userTracks.userId, userId))
			.innerJoin(tracks, eq(userTracks.trackId, tracks.id));

		return results;
	} else {
		const results = await db.select().from(userTracks).where(eq(userTracks.userId, userId));

		return results;
	}
}

export async function getUserModule(userId: string, moduleId: string) {
	// if there is a submission, return it
	const sub = await db
		.select()
		.from(userModulesSubmission)
		.where(
			and(eq(userModulesSubmission.userId, userId), eq(userModulesSubmission.moduleId, moduleId))
		)
		.limit(1)
		.execute()
		.then((res) => res[0]);

	if (sub) {
		return sub;
	}
	// otherwise, return latest attempt

	const attempt = await db
		.select()
		.from(userModulesAttempt)
		.where(and(eq(userModulesAttempt.userId, userId), eq(userModulesAttempt.moduleId, moduleId)))
		.limit(1)
		.execute()
		.then((res) => res[0]);

	if (attempt) {
		return attempt;
	}

	return null;
}

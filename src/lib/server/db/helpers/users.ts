import { and, eq } from 'drizzle-orm';
import { db } from '..';
import { userModulesAttempt, userModulesSubmission, usersStats, userTracks } from '../schema/users';

export async function getUserStats(userId: string) {
	const result = await db.select().from(usersStats).where(eq(usersStats.userId, userId)).limit(1);

	return result.length > 0 ? result[0] : null;
}

export async function getUserTracks(userId: string) {
	return await db.select().from(userTracks).where(eq(userTracks.userId, userId));
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

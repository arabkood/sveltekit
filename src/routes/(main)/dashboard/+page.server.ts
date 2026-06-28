import type { PageServerLoad } from './$types';
import { leaderboardRepository } from '$lib/server/db/repos/leaderboard';
import { userRepository } from '$lib/server/db/repos/user';
import { classRepository } from '$lib/server/db/repos/class';

export const load: PageServerLoad = async ({ locals }) => {
	const [userTracks, dailyStats, userRank] = await Promise.all([
		classRepository.getUserTracks(locals.user!.id),
		userRepository.getDailyStats(locals.user!.id, 7),
		leaderboardRepository.getUserAllTimeRank(locals.user!.id)
	]);

	return { userTracks, dailyStats, userRank };
};

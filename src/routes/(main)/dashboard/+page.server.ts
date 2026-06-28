import type { PageServerLoad } from './$types';
import { leaderboardRepository } from '$lib/server/db/repos/leaderboard';

export const load: PageServerLoad = async ({ locals }) => {
	return {
		userRank: leaderboardRepository.getUserAllTimeRank(locals.user!.id)
	};
};

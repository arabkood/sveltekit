import type { PageServerLoad } from './$types';
import { leaderboardRepository } from '$lib/server/db/repos/leaderboard';

export const load: PageServerLoad = async ({ locals, url }) => {
	const timeframe = url.searchParams.get('timeframe') || 'all-time';
	const isWeekly = timeframe === 'weekly';

	const leaderboardData = isWeekly
		? await leaderboardRepository.getWeeklyLeaderboard(100)
		: await leaderboardRepository.getAllTimeLeaderboard(100);

	const entries = leaderboardData.map((entry) => ({
		rank: entry.rank,
		userId: entry.userId,
		username: entry.username,
		displayName: entry.username,
		totalXp: entry.xp
	}));

	return {
		entries,
		currentUserId: locals.user?.id,
		timeframe: isWeekly ? 'weekly' : 'all-time'
	};
};

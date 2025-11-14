import type { PageServerLoad } from './$types';
import { leaderboardRepository } from '$lib/server/db/repos/leaderboard';

export const load: PageServerLoad = async ({ locals, url }) => {
	const timeframe = url.searchParams.get('timeframe') || 'all-time';
	const isWeekly = timeframe === 'weekly';

	// Get leaderboard data based on timeframe
	const leaderboardData = isWeekly
		? await leaderboardRepository.getWeeklyLeaderboard(100)
		: await leaderboardRepository.getAllTimeLeaderboard(100);

	// Get current user's rank if logged in
	let userRank: { rank: number; xp: number } | null = null;
	if (locals.user) {
		userRank = isWeekly
			? await leaderboardRepository.getUserWeeklyRank(locals.user.id)
			: await leaderboardRepository.getUserAllTimeRank(locals.user.id);
	}

	// Transform data to match the component's expected interface
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
		userRank,
		timeframe: isWeekly ? 'weekly' : 'all-time'
	};
};

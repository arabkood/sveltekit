import type { LayoutServerLoad } from './$types';
import { userRepository } from '$lib/server/db/repos/user';
import { classRepository } from '$lib/server/db/repos/class';
import { leaderboardRepository } from '$lib/server/db/repos/leaderboard';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return {
			courses: await classRepository.getAllCourses()
		};
	}
	const [courses, userStats, userTracks, dailyStats, userRank] = await Promise.all([
		classRepository.getAllCourses(),
		userRepository.getStats(locals.user.id),
		classRepository.getUserTracks(locals.user.id),
		userRepository.getDailyStats(locals.user.id, 7),
		leaderboardRepository.getUserAllTimeRank(locals.user.id)
	]);
	return {
		user: locals.user,
		courses,
		userStats,
		userTracks,
		dailyStats,
		userRank
	};
};

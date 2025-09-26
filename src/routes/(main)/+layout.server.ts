import type { LayoutServerLoad } from './$types';
import { getUserStats, getUserStreakData, getUserTracks } from '$lib/server/db/helpers/users';
import { getAllCourses } from '$lib/server/db/helpers/class';

export const load: LayoutServerLoad = async ({ locals }) => {
  if (!locals.user) {
    return {
      courses: await getAllCourses()
    };
  }
  const [courses, userStats, userTracks, userStreak] = await Promise.all([
    getAllCourses(),
    getUserStats(locals.user.id),
    getUserTracks(locals.user.id),
    getUserStreakData(locals.user.id),
  ]);
  return {
    courses,
    user: locals.user,
    userStats: userStats || undefined,
    userTracks,
    userStreak
  };
};

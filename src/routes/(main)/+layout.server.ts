import type { LayoutServerLoad } from './$types';
import { userRepository } from '$lib/server/db/repos/user';
import { classRepository } from '$lib/server/db/repos/class';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return {
			courses: await classRepository.getAllCourses()
		};
	}
	const [courses, userStats] = await Promise.all([
		classRepository.getAllCourses(),
		userRepository.getStats(locals.user.id)
	]);
	return {
		user: locals.user,
		courses,
		userStats
	};
};

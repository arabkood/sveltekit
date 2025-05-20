import type { PageServerLoad } from './$types';
import { getAllCourses } from '$lib/server/db/helpers/class';

export const load: PageServerLoad = async () => {
	const courses = await getAllCourses();

	return {
		courses
	};
};

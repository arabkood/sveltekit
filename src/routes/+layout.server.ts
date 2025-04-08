import type { LayoutServerLoad } from './$types';
import { getUserStats, getUserTracks } from '$lib/server/db/helpers/users';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return {};
	}
	const [userStats, userTracks] = await Promise.all([
		getUserStats(locals.user.id),
		getUserTracks(locals.user.id, { includeDetails: true })
	]);
	return {
		user: locals.user,
		userStats,
		userTracks
	};
};

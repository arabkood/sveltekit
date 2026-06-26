import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { userRepository } from '$lib/server/db/repos/user';

export const load: PageServerLoad = async ({ params }) => {
	const username = params.username;

	// Fetch user by username
	const user = await userRepository.findByUsername(username);

	if (!user) {
		throw error(404, 'User not found');
	}

	// Fetch user stats
	const userStats = await userRepository.getStats(user.id);

	if (!userStats) {
		throw error(404, 'User stats not found');
	}

	// Fetch user's enrolled tracks with completion status
	const userTracks = await userRepository.getUserTracks(user.id);

	// Filter only completed tracks for profile display
	const completedTracks = userTracks.filter((ut) => ut.completedAt !== null);

	return {
		user: {
			id: user.id,
			username: user.username,
			email: user.email,
			createdAt: user.createdAt,
			isPro: user.isPro
		},
		userStats,
		completedTracks
	};
};

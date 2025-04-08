import { getAllTracks } from '$lib/server/db/helpers/class';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const tracks = await getAllTracks();

	return {
		tracks
	};
};

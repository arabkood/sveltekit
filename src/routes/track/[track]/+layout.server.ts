import { getTrackBySlug, getTrackContent, getTrackProgress } from '$lib/server/db/helpers/class';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../../$types';

export const load: LayoutServerLoad = async ({ params, locals }) => {
	if (!params.track) {
		error(404, 'Not found');
	}
	const track = await getTrackBySlug(params.track);
	if (!track) {
		error(404, 'Not found');
	}
	const sectionsWithModules = await getTrackContent(track.id, locals.user?.id);
	console.log('HERE', sectionsWithModules);

	let progress;
	if (locals.user) {
		progress = await getTrackProgress(track.id, locals.user.id);
	}

	return {
		track,
		sectionsWithModules,
		progress
	};
};

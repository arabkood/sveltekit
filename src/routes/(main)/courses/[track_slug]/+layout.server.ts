import { getTrackBySlug } from '$lib/server/db/helpers/class';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, locals }) => {
	if (!params.track_slug) {
		error(404, 'Not found');
	}
	const trackWithModules = await getTrackBySlug(params.track_slug, locals.user!.id);
	if (!trackWithModules.track) {
		error(404, 'Not found');
	}

	return {
		track: trackWithModules.track,
		modules: trackWithModules.modules
	};
};

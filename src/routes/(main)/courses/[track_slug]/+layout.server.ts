import { getTrackBySlug } from '$lib/server/db/helpers/class';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, locals }) => {
	if (!params.track_slug) {
		throw error(404, {
			message: 'عفواً، لم نتمكن من العثور على ما تبحث عنه.'
		});
	}
	const trackWithModules = await getTrackBySlug(params.track_slug, locals.user?.id);
	if (!trackWithModules?.track) {
		throw error(404, {
			message: 'عفواً، لم نتمكن من العثور على ما تبحث عنه.'
		});
	}

	return {
		track: trackWithModules.track,
		modules: trackWithModules.modules
	};
};

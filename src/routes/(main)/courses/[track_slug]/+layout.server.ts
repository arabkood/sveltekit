import { redirect, error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { CourseService, CourseNotFoundError, CourseRedirectError } from '$lib/server/services/course';

export const load: LayoutServerLoad = async ({ params, locals, url }) => {
	if (!params.track_slug) {
		throw error(404, {
			message: 'عفواً، لم نتمكن من العثور على ما تبحث عنه.'
		});
	}

	try {
		const trackData = await CourseService.getTrackWithModules(params.track_slug, url.pathname, locals.user?.id);

		return {
			track: trackData.track,
			modules: trackData.modules,
			user: locals.user
		};
	} catch (e) {
		if (e instanceof CourseRedirectError) {
			throw redirect(e.statusCode, e.destination);
		}
		if (e instanceof CourseNotFoundError) {
			throw error(404, {
				message: e.message
			});
		}
		throw e;
	}
};

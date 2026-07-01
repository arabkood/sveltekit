import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { CourseService, CourseNotFoundError, CourseRedirectError, PremiumRestrictionError } from '$lib/server/services/course';

export const load: LayoutServerLoad = async ({ locals, params, url, parent }) => {
	if (!params.track_slug || !params.item_slug) {
		error(404, 'Not found');
	}

	const parentData = await parent();

	try {
		const accessData = await CourseService.resolveItemAccess(
			parentData.modules,
			params.item_slug,
			parentData.track,
			url.pathname,
			locals.user?.id,
			locals.user?.isPro
		);

		return {
			item: accessData.item,
			module: accessData.module,
			submission: accessData.submission,
			prevItemIdx: accessData.prevItemIdx,
			nextItemIdx: accessData.nextItemIdx,
			user: locals.user
		};
	} catch (e) {
		if (e instanceof CourseNotFoundError) {
			throw error(404, { message: e.message });
		}
		if (e instanceof CourseRedirectError) {
			throw redirect(e.statusCode, e.destination);
		}
		if (e instanceof PremiumRestrictionError) {
			throw redirect(302, `/pricing`);
		}
		throw e;
	}
};

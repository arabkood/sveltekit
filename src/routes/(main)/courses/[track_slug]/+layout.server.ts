import { redirect, error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { classRepository } from '$lib/server/db/repos/class';

export const load: LayoutServerLoad = async ({ params, locals, url }) => {
	if (!params.track_slug) {
		throw error(404, {
			message: 'عفواً، لم نتمكن من العثور على ما تبحث عنه.'
		});
	}

	let normalizedSlug = params.track_slug;

	// NOTE:
	// This is temporary, because we had a different format for slugs that caused issues with SEOs
	//
	if (params.track_slug.includes('@')) {
		const slugParts = params.track_slug.split('@');

		if (slugParts.length >= 2) {
			const trackPart = slugParts.shift(); // first part
			const topicPart = slugParts.join('-'); // remaining parts
			normalizedSlug = `${topicPart}-${trackPart}`;
		} else {
			normalizedSlug = params.track_slug.replace(/@/g, '-');
		}

		// Redirect permanently (301) to the new slug
		const newUrl = url.pathname.replace(params.track_slug, normalizedSlug);
		throw redirect(301, newUrl);
	}

	const trackWithModules = await classRepository.getTrackBySlug(normalizedSlug, locals.user?.id);

	if (!trackWithModules?.track) {
		throw error(404, {
			message: 'عفواً، لم نتمكن من العثور على ما تبحث عنه.'
		});
	}

	return {
		track: trackWithModules.track,
		modules: trackWithModules.modules,
		user: locals.user
	};
};

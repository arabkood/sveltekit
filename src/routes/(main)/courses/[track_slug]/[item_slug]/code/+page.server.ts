import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { CourseService, CourseNotFoundError, CourseRedirectError } from '$lib/server/services/course';

export const load: PageServerLoad = async ({ parent }) => {
	const { item, track } = await parent();

	if (item.type !== 'code') {
		redirect(308, `/courses/${track.slug}/${item.slug}/${item.type}`);
	}

	try {
		const codeAssets = await CourseService.getCodeAssets(item.s3Path);

		return {
			code: codeAssets
		};
	} catch (e) {
		if (e instanceof CourseNotFoundError) {
			throw error(404, { message: e.message });
		}
		throw e;
	}
};

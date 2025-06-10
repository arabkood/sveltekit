import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.user?.emailVerified) {
		redirect(302, '/');
	}

	return {
		user: {
			emailVerified: locals.user?.emailVerified,
			email: locals.user?.email
		}
	};
};

import { API_ENDPOINTS } from '$api/config';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUserModule } from '$lib/server/db/helpers/users';

export const load: PageServerLoad = async ({ params, locals, fetch }) => {
	if (!locals.user) {
		error(404, 'Not found');
	}
	try {
		const moduleRes = await fetch(new URL(API_ENDPOINTS.modules.get(params.module)), {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		if (moduleRes.ok) {
			const { module, exercise } = await moduleRes.json();
			const submission = await getUserModule(locals.user.id, module.id);

			return {
				module,
				exercise,
				submission
			};
		}
	} catch (e) {
		console.error('Could not fetch module', e);
		error(404, 'Not found');
	}
	error(404, 'Not found');
};

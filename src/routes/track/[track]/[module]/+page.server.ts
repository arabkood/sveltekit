import { API_ENDPOINTS } from '$api/config';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUserModule } from '$lib/server/db/helpers/users';

export const load: PageServerLoad = async ({ params, locals, fetch }) => {
	if (!locals.user) {
		error(404, 'Not found');
	}
	try {
		const apiUrl = new URL(API_ENDPOINTS.modules.get(params.module));
		console.log(`API Url: ${apiUrl}`);

		const moduleRes = await fetch(apiUrl, {
			method: 'GET'
		});

		console.log(`API Response Status: ${moduleRes.status}`);

		if (moduleRes.ok) {
			const { module, exercise } = await moduleRes.json();

			if (!module || !module.id) {
				console.error('API response missing module or module.id');
				error(500, 'Internal Server Error: Invalid API response');
			}

			const submission = await getUserModule(locals.user.id, module.id);

			return {
				module,
				exercise,
				submission
			};
		} else {
			console.error(
				`API request failed with status ${moduleRes.status}: ${await moduleRes.text()}`
			);
			if (moduleRes.status === 404) {
				error(404, 'Module not found');
			} else {
				error(502, 'Bad Gateway: Could not retrieve module data');
			}
		}
	} catch (e) {
		console.error('Could not fetch module or process data:', e);

		if (e && typeof e === 'object' && 'status' in e && typeof e.status === 'number') {
			throw e; // Re-throw SvelteKit errors
		}

		// Throw a generic 500 for unexpected errors
		error(500, 'Internal Server Error');
	}
};

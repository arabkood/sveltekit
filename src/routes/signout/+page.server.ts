import { redirect } from '@sveltejs/kit';
import { invalidateSession } from '$lib/server/auth/session';
import { privateEnv } from '$secrets';
import { getDB } from '$lib/server/db';
import { auditLogsInAuth } from '$lib/server/db/schema/auth';
import type { Actions, PageServerLoad } from './$types';

// Direct GET visits to /signout have nothing to render; bounce home.
export const load: PageServerLoad = () => {
	redirect(302, '/');
};

export const actions: Actions = {
	default: async ({ cookies, locals, request, getClientAddress }) => {
		const userId = locals.user?.id;
		const token = cookies.get(privateEnv.AUTH_SESSION_COOKIE_NAME || 'akood_session_token');
		if (token) {
			await invalidateSession(token, cookies);
		}

		if (userId) {
			const db = getDB();
			await db.insert(auditLogsInAuth).values({
				userId,
				type: 'signout',
				ipAddress: getClientAddress(),
				userAgent: request.headers.get('user-agent') || ''
			});
		}

		locals.user = null;
		locals.session = null;

		redirect(303, '/');
	}
};

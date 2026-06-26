import { json } from '@sveltejs/kit';
import { invalidateSession } from '$lib/server/auth/session';
import { privateEnv } from '$secrets';
import { getDB } from '$lib/server/db';
import { auditLogsInAuth } from '$lib/server/db/schema/auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies, locals, request, getClientAddress }) => {
	const userId = locals.user?.id;
	const token = cookies.get(privateEnv.AUTH_SESSION_COOKIE_NAME || 'arabkood_session_token');
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
	return json({ success: true });
};

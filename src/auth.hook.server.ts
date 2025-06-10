import { auth as authConfig } from '$config';
import { getUserBySessionToken } from '$lib/server/db/helpers/auth';
import { redirect, type Handle } from '@sveltejs/kit';

const PUBLIC_ROUTES = new Set([
	'/(auth)/signin',
	'/(auth)/signup',
	'/(auth)/forgot-password',
	'/(auth)/reset-password/[token]',
	'/health'
]);
const VERIFY_EMAIL_ROUTE = '/(auth)/signup/verify-email';

export const authHandle: Handle = async ({ event, resolve }) => {
	const currentRouteId = event.route.id;
	const sessionToken = event.cookies.get(authConfig.sessionCookieName);

	if (sessionToken) {
		event.locals.user = await getUserBySessionToken(sessionToken);
		if (event.locals.user) {
			if (!event.locals.user?.emailVerified) {
				if (!currentRouteId || !PUBLIC_ROUTES.has(currentRouteId)) {
					return redirect(302, '/signup/verify-email');
				}
			}
		} else {
			const allCookies = event.cookies.getAll();
			for (const cookie of allCookies) {
				const cookieName = cookie.name;
				event.cookies.delete(cookieName, { path: '/', secure: event.url.protocol === 'https:' });
			}
			if (!currentRouteId || !PUBLIC_ROUTES.has(currentRouteId)) {
				return redirect(302, '/signin');
			}
		}
	} else {
		event.locals.user = null;
		if (!currentRouteId || !PUBLIC_ROUTES.has(currentRouteId)) {
			return redirect(302, '/signin');
		}
	}

	return resolve(event);
};

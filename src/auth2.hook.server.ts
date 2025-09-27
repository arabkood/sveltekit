import { auth as authConfig } from '$config';
import { userRepository } from '$lib/server/db/repos/user';
import { redirect, type Handle } from '@sveltejs/kit';

const PRIVATE_ROUTES = new Set(['/(main)/dashboard', '/(main)/server', '/(main)/settings']);

const canAnonVisit = (routeId: string) => {
	let can = true;
	PRIVATE_ROUTES.forEach((v) => {
		if (routeId.startsWith(v)) {
			can = false;
		}
	});
	return can;
};

export const authHandle2: Handle = async ({ event, resolve }) => {
	const currentRouteId = event.route.id;
	const sessionToken = event.cookies.get(authConfig.sessionCookieName);

	if (sessionToken) {
		event.locals.user = await userRepository.getUserBySessionToken(sessionToken);
		if (event.locals.user) {
			if (!event.locals.user?.emailVerified) {
				if (!currentRouteId || !canAnonVisit(currentRouteId)) {
					return redirect(302, '/signup/verify-email');
				}
			}
		} else {
			const allCookies = event.cookies.getAll();
			for (const cookie of allCookies) {
				const cookieName = cookie.name;
				event.cookies.delete(cookieName, { path: '/', secure: event.url.protocol === 'https:' });
			}
			if (!currentRouteId || !canAnonVisit(currentRouteId)) {
				return redirect(302, '/');
			}
		}
	} else {
		event.locals.user = null;
		if (!currentRouteId || !canAnonVisit(currentRouteId)) {
			return redirect(302, '/signin');
		}
	}

	return resolve(event);
};

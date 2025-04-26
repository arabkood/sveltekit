import { redirect, type Handle } from '@sveltejs/kit';
import config from '$config';
import { sequence } from '@sveltejs/kit/hooks';
import type { AuthState } from '$types/auth';
import { getUserBySessionToken } from '$lib/server/db/helpers/auth';

// routes user can access without being authenticated
const ANONYMOUS_ROUTES = new Set([
	'/(auth)/signin',
	'/(auth)/signup',
	'/(auth)/forgot-password',
	'/(auth)/reset-password/[token]',
	'/(auth)/signup/verify-email',
	'/health'
]);

const authHandle: Handle = async ({ event, resolve }) => {
	const currentRouteId = event.route.id;
	const authCookie = event.cookies.get(config.auth.authStateCookieName);
	const sessionCookie = event.cookies.get(config.auth.sessionCookieName);
	let authState: AuthState | null = null;

	// Parse and validate auth cookie
	if (authCookie) {
		try {
			authState = JSON.parse(authCookie) as AuthState;
		} catch {
			event.cookies.delete(config.auth.authStateCookieName, { path: '/' });
		}
	}

	// Handle unauthenticated users
	if (!authState?.authenticated) {
		event.locals.authState = null;
		event.locals.user = null;
		event.cookies.delete(config.auth.authStateCookieName, { path: '/' });
		event.cookies.delete(config.auth.sessionCookieName, { path: '/' });

		// Redirect protected routes to signup
		if (!currentRouteId || !ANONYMOUS_ROUTES.has(currentRouteId)) {
			return redirect(302, '/signup');
		}

		return resolve(event);
	}

	// Handle authenticated users
	event.locals.authState = authState;

	// Redirect authenticated users away from auth pages
	if (currentRouteId && ANONYMOUS_ROUTES.has(currentRouteId)) {
		return redirect(302, '/');
	}

	// Validate session and fetch user data
	event.locals.user = await getUserBySessionToken(sessionCookie);

	if (!event.locals.user) {
		event.locals.authState = null;
		event.locals.user = null;
		event.cookies.delete(config.auth.authStateCookieName, { path: '/' });
		event.cookies.delete(config.auth.sessionCookieName, { path: '/' });
		return redirect(302, '/signup');
	}

	// Set security headers for authenticated pages
	event.setHeaders({ 'Cache-Control': 'no-store' });

	return resolve(event);
};

export const handle = sequence(authHandle);

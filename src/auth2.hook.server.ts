import { privateEnv } from '$secrets';
import { validateSession } from '$lib/server/auth/session';
import { redirect, type Handle } from '@sveltejs/kit';

/**
 * Routes that are accessible WITHOUT authentication.
 * Everything else requires a valid session (default-deny).
 */
const PUBLIC_ROUTES: string[] = [
	// Auth flows (signin, signup, forgot-password, reset-password)
	'/(auth)',
	// Public content pages
	'/(main)/blog',
	'/(main)/courses',
	'/(main)/leaderboard',
	'/(main)/pages',
	'/(main)/pricing',
	'/(main)/user'
];

/**
 * Routes that authenticated users should NOT access (e.g. signin when already logged in).
 * Redirects them to dashboard instead.
 */
const GUEST_ONLY_ROUTES: string[] = ['/(auth)'];

/**
 * Routes where unverified-email users are allowed.
 * Unverified users hitting anything else get redirected to verify-email.
 */
const UNVERIFIED_ALLOWED_ROUTES: string[] = [
	'/(auth)',
	'/(main)/blog',
	'/(main)/courses',
	'/(main)/leaderboard',
	'/(main)/pages',
	'/(main)/pricing',
	'/(main)/user'
];

function matchesAny(routeId: string, prefixes: string[]): boolean {
	return prefixes.some((prefix) => routeId.startsWith(prefix));
}

export const authHandle: Handle = async ({ event, resolve }) => {
	const routeId = event.route.id;

	// 1. Resolve the session (always, so locals.user is available even on public pages)
	const sessionToken = event.cookies.get(
		privateEnv.AUTH_SESSION_COOKIE_NAME || 'akood_session_token'
	);

	if (sessionToken) {
		const result = await validateSession(sessionToken);
		event.locals.user = result?.user ?? null;
		event.locals.session = result?.session ?? null;
	} else {
		event.locals.user = null;
		event.locals.session = null;
	}

	// 2. Skip route guards for non-page requests (api, health, static, etc.)
	if (!routeId) {
		return resolve(event);
	}

	const isPublic = matchesAny(routeId, PUBLIC_ROUTES);
	const isGuestOnly = matchesAny(routeId, GUEST_ONLY_ROUTES);
	const isAuthenticated = !!event.locals.user;

	// 3. Authenticated user hitting a guest-only route (e.g. /signin) → dashboard
	if (isAuthenticated && isGuestOnly) {
		throw redirect(302, '/dashboard');
	}

	// 4. Unauthenticated user hitting a protected route → signin
	if (!isAuthenticated && !isPublic) {
		throw redirect(302, '/signin');
	}

	// 5. Authenticated but unverified email → force verification
	if (isAuthenticated && !event.locals.user!.emailVerified) {
		const isVerifyPage = routeId === '/(auth)/signup/verify-email';
		const isAllowedWhileUnverified = matchesAny(routeId, UNVERIFIED_ALLOWED_ROUTES);

		if (!isVerifyPage && !isAllowedWhileUnverified) {
			throw redirect(302, '/signup/verify-email');
		}
	}

	return resolve(event);
};

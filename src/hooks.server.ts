import { redirect, type Handle } from '@sveltejs/kit';
import { auth } from '$config';
import { sequence } from '@sveltejs/kit/hooks';
import type { AuthState } from '$types/auth';
import { getUserBySessionToken } from '$lib/server/db/helpers/auth';
import { initDB } from '$lib/server/db';

import type { ServerInit } from '@sveltejs/kit';

export const init: ServerInit = async () => {
	initDB();
};

// Routes user can access without being fully authenticated and session-validated
// Includes pages needed *during* the auth flow.
const PUBLIC_AUTH_FLOW_ROUTES = new Set([
	'/(auth)/signin',
	'/(auth)/signup',
	'/(auth)/forgot-password',
	'/(auth)/reset-password/[token]',
	'/(auth)/signup/verify-email', // Keep this accessible during flow
	'/health'
]);

const authHandle: Handle = async ({ event, resolve }) => {
	const currentRouteId = event.route.id;
	const authCookie = event.cookies.get(auth.authStateCookieName);
	const sessionCookie = event.cookies.get(auth.sessionCookieName);
	let authState: AuthState | null = null;

	// Parse and validate auth cookie
	if (authCookie) {
		try {
			authState = JSON.parse(authCookie) as AuthState;
			// Add validation: Ensure essential fields exist if needed
			if (!authState || typeof authState.authenticated !== 'boolean') {
				throw new Error('Invalid auth state structure');
			}
		} catch (e) {
			console.warn('Invalid auth state cookie:', e);
			event.cookies.delete(auth.authStateCookieName, { path: '/' });
			authState = null; // Ensure it's null after catching
		}
	}

	// --- Handle Unauthenticated Users ---
	if (!authState?.authenticated) {
		event.locals.authState = null;
		event.locals.user = null;
		// Clean up potentially lingering cookies
		event.cookies.delete(auth.authStateCookieName, { path: '/' });
		event.cookies.delete(auth.sessionCookieName, { path: '/' });

		// Redirect protected routes to signup/signin
		if (!currentRouteId || !PUBLIC_AUTH_FLOW_ROUTES.has(currentRouteId)) {
			// Decide where unauthenticated users should go (e.g., signin)
			return redirect(302, '/signin'); // Changed from /signup
		}

		// Allow access to public/auth flow routes
		return resolve(event);
	}

	// --- Handle Authenticated Users (Based on authStateCookie) ---
	event.locals.authState = authState; // Set locals early

	// Special Handling for Verify Email Page:
	// Allow access only if authenticated but *not* verified yet.
	if (currentRouteId === '/(auth)/signup/verify-email') {
		if (authState.emailVerified) {
			// Already verified, shouldn't be here. Redirect home.
			return redirect(302, '/');
		}
		// User is authenticated but not verified, allow access to verification page.
		// Skip session validation for this specific page, as session might not exist yet,
		// or might not be relevant until *after* verification.
		return resolve(event);
	}

	// Redirect authenticated+verified users away from other auth pages (signin/signup etc.)
	if (
		currentRouteId &&
		PUBLIC_AUTH_FLOW_ROUTES.has(currentRouteId) &&
		currentRouteId !== '/(auth)/signup/verify-email'
	) {
		// If they are fully verified (or verification isn't mandatory before proceeding), redirect home.
		// Add a check for emailVerified if applicable before redirecting from all public routes
		if (authState.emailVerified !== false) {
			// Adjust if emailVerified can be undefined initially
			return redirect(302, '/');
		}
		// If they are authenticated but NOT verified, maybe allow them on some routes?
		// Or keep the redirect? Depends on your app flow. Let's assume redirect for now.
		// return redirect(302, '/');
	}

	// --- Session Validation for Protected Routes ---
	// If we reach here, the user is authenticated (by cookie) and accessing a non-auth-flow page OR needs session validation

	// FIX: If authenticated state exists but no session cookie, treat as invalid session
	if (!sessionCookie) {
		console.log('Authenticated state found, but no session cookie. Clearing state.');
		event.locals.authState = null;
		event.locals.user = null;
		event.cookies.delete(auth.authStateCookieName, { path: '/' });
		event.cookies.delete(auth.sessionCookieName, { path: '/' });
		return redirect(302, '/signin'); // Redirect to signin
	}

	// Validate session and fetch user data
	event.locals.user = await getUserBySessionToken(sessionCookie);

	if (!event.locals.user) {
		console.log('Session cookie found, but invalid/expired. Clearing state.');
		event.locals.authState = null;
		event.locals.user = null;
		event.cookies.delete(auth.authStateCookieName, { path: '/' });
		event.cookies.delete(auth.sessionCookieName, { path: '/' });
		return redirect(302, '/signin'); // Redirect to signin
	}

	// --- Fully Authenticated and Session Validated ---

	// Optional: Check if email is verified for accessing protected routes
	if (
		authState.emailVerified === false &&
		!PUBLIC_AUTH_FLOW_ROUTES.has(currentRouteId) /* Ensure not already on verify page */
	) {
		console.log(
			'User authenticated and session valid, but email not verified. Redirecting to verify.'
		);
		return redirect(302, '/signup/verify-email'); // Force verification
	}

	// Set security headers for authenticated pages
	event.setHeaders({ 'Cache-Control': 'no-store' });

	return resolve(event);
};

export const handle = sequence(authHandle);

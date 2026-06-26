import { randomBytes } from 'crypto';
import { getDB } from '$lib/server/db';
import { sessionTokensInAuth } from '$lib/server/db/schema/auth';
import { eq } from 'drizzle-orm';
import { privateEnv } from '$secrets';
import type { Cookies } from '@sveltejs/kit';

const EXPIRY_HOURS = parseInt(privateEnv.AUTH_SESSION_TOKEN_EXPIRY_HOURS || '720');
const SESSION_COOKIE_NAME = privateEnv.AUTH_SESSION_COOKIE_NAME || 'akood_session_token';

/**
 * Generates a random session token.
 */
export function generateSessionToken(): string {
	return randomBytes(32).toString('hex');
}

import { dev } from '$app/environment';

/**
 * Creates a new session in the database and sets the cookie.
 */
export async function createSession(userId: string, cookies: Cookies): Promise<string> {
	const token = generateSessionToken();
	const expiresAt = new Date(Date.now() + EXPIRY_HOURS * 60 * 60 * 1000);

	const db = getDB();
	await db.insert(sessionTokensInAuth).values({
		token,
		userId,
		expiresAt,
		lastUsedAt: new Date()
	});

	cookies.set(SESSION_COOKIE_NAME, token, {
		path: '/',
		httpOnly: true,
		secure: !dev,
		sameSite: 'lax',
		maxAge: EXPIRY_HOURS * 60 * 60 // maxAge in seconds
	});

	return token;
}

import { isProFromSubscription, type UserPrivate } from '$lib/server/db/repos/user';

/**
 * Validates a session token, checking expiry, and returns the user and session.
 */
export async function validateSession(
	token: string
): Promise<{ session: any; user: UserPrivate } | null> {
	const db = getDB();

	const session = await db.query.sessionTokensInAuth.findFirst({
		where: {
			token: token
		},
		with: {
			usersInAuth: {
				columns: {
					id: true,
					email: true,
					username: true,
					role: true,
					emailVerified: true,
					createdAt: true
				},
				with: {
					userSubscriptionsInAuth: {
						columns: { plan: true, proUntil: true, stripeCustomerId: true }
					}
				}
			}
		}
	});

	if (!session) {
		return null;
	}

	if (Date.now() >= session.expiresAt.getTime()) {
		await db.delete(sessionTokensInAuth).where(eq(sessionTokensInAuth.token, session.token));
		return null;
	}

	const userRecord = session.usersInAuth;
	if (!userRecord) return null;

	const { userSubscriptionsInAuth: sub, ...rest } = userRecord;
	const user = {
		...rest,
		isPro: isProFromSubscription(sub),
		hasBilling: !!sub?.stripeCustomerId
	};

	// We strip out the nested object so session is just the session row itself
	const { usersInAuth, ...sessionOnly } = session;

	return { session: sessionOnly, user };
}

/**
 * Invalidates a session and clears the cookie.
 */
export async function invalidateSession(token: string, cookies: Cookies) {
	const db = getDB();
	await db.delete(sessionTokensInAuth).where(eq(sessionTokensInAuth.token, token));

	cookies.delete(SESSION_COOKIE_NAME, {
		path: '/'
	});
}

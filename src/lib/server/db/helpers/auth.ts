import { and, eq, gt } from 'drizzle-orm';
import { db } from '..';
import { sessionTokens, users } from '../schema/auth';

export async function getUserBySessionToken(token: string) {
	const now = new Date();

	const result = await db
		.select({
			id: users.id,
			email: users.email,
			username: users.username,
			role: users.role,
			emailVerified: users.emailVerified,
			createdAt: users.createdAt
		})
		.from(sessionTokens)
		.innerJoin(users, eq(sessionTokens.userId, users.id))
		.where(and(eq(sessionTokens.token, token), gt(sessionTokens.expiresAt, now)))
		.limit(1);

	// Return the user if found, otherwise null
	return result.length > 0 ? result[0] : null;
}

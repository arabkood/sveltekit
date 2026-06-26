import { getDB } from '$lib/server/db';
import { oneTimeTokensInAuth } from '$lib/server/db/schema/auth';
import { eq, and } from 'drizzle-orm';
import { privateEnv } from '$secrets';
import crypto from 'crypto';

function generateRandomCode(length: number, chars: string): string {
	let result = '';
	for (let i = 0; i < length; i++) {
		result += chars.charAt(crypto.randomInt(chars.length));
	}
	return result;
}

export async function createEmailVerificationToken(userId: string): Promise<string> {
	const db = getDB();
	// Delete any existing token
	await db
		.delete(oneTimeTokensInAuth)
		.where(
			and(
				eq(oneTimeTokensInAuth.userId, userId),
				eq(oneTimeTokensInAuth.type, 'email_confirmation')
			)
		);

	const length = 6;
	const chars = '0123456789';
	const expiryMinutes = parseInt(privateEnv.AUTH_EMAIL_VERIFICATION_EXPIRY_MINUTES || '1440');

	const token = generateRandomCode(length, chars);
	const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

	await db.insert(oneTimeTokensInAuth).values({
		userId,
		type: 'email_confirmation',
		token,
		expiresAt
	});

	return token;
}

export async function createPasswordResetToken(userId: string): Promise<string> {
	const db = getDB();
	await db
		.delete(oneTimeTokensInAuth)
		.where(
			and(eq(oneTimeTokensInAuth.userId, userId), eq(oneTimeTokensInAuth.type, 'password_recovery'))
		);

	const expiryMinutes = parseInt(privateEnv.AUTH_PASSWORD_RESET_EXPIRY_MINUTES || '60');

	const token = crypto.randomBytes(32).toString('hex');
	const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

	await db.insert(oneTimeTokensInAuth).values({
		userId,
		type: 'password_recovery',
		token,
		expiresAt
	});

	return token;
}

export async function validateOneTimeToken(
	userId: string,
	type: 'email_confirmation' | 'password_recovery',
	token: string
): Promise<boolean> {
	const db = getDB();
	const result = await db
		.select()
		.from(oneTimeTokensInAuth)
		.where(
			and(
				eq(oneTimeTokensInAuth.userId, userId),
				eq(oneTimeTokensInAuth.type, type),
				eq(oneTimeTokensInAuth.token, token)
			)
		)
		.limit(1);

	if (result.length === 0) return false;

	const entry = result[0];
	if (Date.now() > entry.expiresAt.getTime()) {
		// Token expired
		return false;
	}

	return true;
}

export async function deleteOneTimeToken(
	userId: string,
	type: 'email_confirmation' | 'password_recovery'
) {
	const db = getDB();
	await db
		.delete(oneTimeTokensInAuth)
		.where(and(eq(oneTimeTokensInAuth.userId, userId), eq(oneTimeTokensInAuth.type, type)));
}

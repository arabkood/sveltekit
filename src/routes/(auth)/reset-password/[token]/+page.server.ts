import { fail } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';
import {
	usersInAuth,
	oneTimeTokensInAuth,
	sessionTokensInAuth,
	auditLogsInAuth
} from '$lib/server/db/schema/auth';
import { eq, and } from 'drizzle-orm';
import { hashPassword } from '$lib/server/auth/password';
import { validateOneTimeToken, deleteOneTimeToken } from '$lib/server/auth/tokens';
import { rateLimiter, resetPasswordIpLimiter } from '$lib/server/ratelimit';
import { z } from 'zod';
import type { Actions } from './$types';

const resetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(8, 'validation.password.minLength')
			.max(100, 'validation.password.maxLength')
			.regex(/[0-9]/, 'validation.password.number'),
		confirmPassword: z.string().min(1, 'validation.confirmPassword.required')
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'validation.confirmPassword.match',
		path: ['confirmPassword']
	});

export const actions: Actions = {
	default: async ({ request, params, getClientAddress }) => {
		const ip = getClientAddress();
		const limit = await rateLimiter.safeConsume(resetPasswordIpLimiter, ip);
		if (!limit.success) {
			return fail(429, { error: 'rateLimit.resetPassword', retryAfterSecs: limit.retryAfterSecs });
		}

		const formData = await request.formData();
		const values = Object.fromEntries(formData);
		const parsed = resetPasswordSchema.safeParse(values);
		const token = params.token;

		if (!token) {
			return fail(400, { error: 'invalid_token' });
		}

		if (!parsed.success) {
			return fail(400, {
				errors: z.flattenError(parsed.error).fieldErrors
			});
		}

		const { password } = parsed.data;

		const db = getDB();
		const tokenRecord = await db
			.select()
			.from(oneTimeTokensInAuth)
			.where(
				and(eq(oneTimeTokensInAuth.type, 'password_recovery'), eq(oneTimeTokensInAuth.token, token))
			)
			.limit(1);

		if (tokenRecord.length === 0) {
			return fail(400, { error: 'invalid_token' });
		}

		const userId = tokenRecord[0].userId;
		const isValid = await validateOneTimeToken(userId, 'password_recovery', token);

		if (!isValid) {
			return fail(400, { error: 'invalid_token' });
		}

		const encryptedPassword = await hashPassword(password);

		await db.update(usersInAuth).set({ encryptedPassword }).where(eq(usersInAuth.id, userId));

		// Invalidate all existing sessions for security
		await db.delete(sessionTokensInAuth).where(eq(sessionTokensInAuth.userId, userId));

		await deleteOneTimeToken(userId, 'password_recovery');

		await db.insert(auditLogsInAuth).values({
			userId,
			type: 'password_change',
			ipAddress: getClientAddress(),
			userAgent: request.headers.get('user-agent') || ''
		});

		return { success: true };
	}
};

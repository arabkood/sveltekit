import { fail } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';
import { usersInAuth, sessionTokensInAuth, auditLogsInAuth } from '$lib/server/db/schema/auth';
import { eq } from 'drizzle-orm';
import { verifyPassword, hashPassword } from '$lib/server/auth/password';
import { createSession } from '$lib/server/auth/session';
import { rateLimiter, changePasswordLimiter, changeAccountLimiter, changeAccountSuccessLimiter } from '$lib/server/ratelimit';
import { z } from 'zod';
import type { Actions } from './$types';

const changePasswordSchema = z
	.object({
		currentPassword: z
			.string()
			.min(8, 'validation.password.minLength')
			.max(100, 'validation.password.maxLength')
			.regex(/[0-9]/, 'validation.password.number'),
		newPassword: z
			.string()
			.min(8, 'validation.password.minLength')
			.max(100, 'validation.password.maxLength')
			.regex(/[0-9]/, 'validation.password.number'),
		confirmPassword: z.string().min(1, 'validation.confirmPassword.required')
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: 'validation.confirmPassword.match',
		path: ['confirmPassword']
	});

const changeAccountSchema = z.object({
	username: z
		.string()
		.min(4, 'validation.username.minLength')
		.max(40, 'validation.username.maxLength')
		.regex(/^[a-zA-Z0-9_-]+$/, 'validation.username.pattern')
});

export const actions: Actions = {
	changeAccount: async ({ request, locals, getClientAddress }) => {
		const user = locals.user;
		if (!user) return fail(401, { action: 'changeAccount', error: 'unauthorized' });

		const limit = await rateLimiter.safeConsume(changeAccountLimiter, user.id);
		if (!limit.success) {
			return fail(429, {
				action: 'changeAccount',
				error: 'rateLimit.changeAccount',
				retryAfterSecs: limit.retryAfterSecs
			});
		}

		const formData = await request.formData();
		const values = Object.fromEntries(formData);
		const parsed = changeAccountSchema.safeParse(values);

		if (!parsed.success) {
			return fail(400, {
				action: 'changeAccount',
				values: { username: String(values.username ?? '') },
				errors: z.flattenError(parsed.error).fieldErrors
			});
		}

		const { username } = parsed.data;

		if (username === user.username) {
			return { action: 'changeAccount', success: true };
		}

		const db = getDB();

		// Check success limiter before touching the DB (don't consume yet)
		const successLimiterState = await changeAccountSuccessLimiter.get(user.id).catch(() => null);
		const remainingPoints = successLimiterState === null
			? changeAccountSuccessLimiter.points
			: successLimiterState.remainingPoints;
		if (remainingPoints <= 0) {
			const retryAfterSecs = Math.ceil((successLimiterState?.msBeforeNext ?? 3600000) / 1000);
			return fail(429, {
				action: 'changeAccount',
				error: 'rateLimit.changeAccount',
				retryAfterSecs
			});
		}

		try {
			await db.update(usersInAuth)
				.set({ username })
				.where(eq(usersInAuth.id, user.id));
		} catch (error: any) {
			if (error.code === '23505') {
				return fail(400, {
					action: 'changeAccount',
					values: { username },
					errors: { username: ['validation.username.exists'] }
				});
			}
			return fail(500, { action: 'changeAccount', error: 'errors.INTERNAL_ERROR' });
		}

		// Consume the success point only after a real username change
		await rateLimiter.safeConsume(changeAccountSuccessLimiter, user.id);

		await db.insert(auditLogsInAuth).values({
			userId: user.id,
			type: 'username_change',
			ipAddress: getClientAddress(),
			userAgent: request.headers.get('user-agent') || ''
		});

		return { action: 'changeAccount', success: true };
	},

	changePassword: async ({ request, locals, cookies, getClientAddress }) => {
		const user = locals.user;
		if (!user) return fail(401, { action: 'changePassword', error: 'unauthorized' });

		const limit = await rateLimiter.safeConsume(changePasswordLimiter, user.id);
		if (!limit.success) {
			return fail(429, {
				action: 'changePassword',
				error: 'rateLimit.changePassword',
				retryAfterSecs: limit.retryAfterSecs
			});
		}

		const formData = await request.formData();
		const values = Object.fromEntries(formData);
		const parsed = changePasswordSchema.safeParse(values);

		if (!parsed.success) {
			return fail(400, {
				action: 'changePassword',
				errors: z.flattenError(parsed.error).fieldErrors
			});
		}

		const { currentPassword, newPassword } = parsed.data;

		const db = getDB();
		const result = await db.select().from(usersInAuth).where(eq(usersInAuth.id, user.id)).limit(1);

		if (result.length === 0) {
			return fail(401, { action: 'changePassword', error: 'unauthorized' });
		}

		const userRecord = result[0];
		const isValid = await verifyPassword(currentPassword, userRecord.encryptedPassword);

		if (!isValid) {
			return fail(400, { action: 'changePassword', error: 'validation.password.wrongCurrent' });
		}

		const encryptedPassword = await hashPassword(newPassword);

		await db.update(usersInAuth)
			.set({ encryptedPassword })
			.where(eq(usersInAuth.id, user.id));

		// Kill all sessions globally
		await db.delete(sessionTokensInAuth).where(eq(sessionTokensInAuth.userId, user.id));
		// Instantly re-authenticate the current browser
		await createSession(user.id, cookies);

		await db.insert(auditLogsInAuth).values({
			userId: user.id,
			type: 'password_change',
			ipAddress: getClientAddress(),
			userAgent: request.headers.get('user-agent') || ''
		});

		return { action: 'changePassword', success: true };
	}
};

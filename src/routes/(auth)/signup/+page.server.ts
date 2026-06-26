import { fail, redirect } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';
import { usersInAuth, auditLogsInAuth } from '$lib/server/db/schema/auth';
import { statsInUsers } from '$lib/server/db/schema/users';
import { eq, or } from 'drizzle-orm';
import { hashPassword } from '$lib/server/auth/password';
import { createSession } from '$lib/server/auth/session';
import { createEmailVerificationToken } from '$lib/server/auth/tokens';
import { sendEmailVerification } from '$lib/server/auth/email';
import { rateLimiter, signupIpLimiter } from '$lib/server/ratelimit';
import crypto from 'crypto';
import { z } from 'zod';
import type { Actions } from './$types';

const signupSchema = z
	.object({
		email: z
			.email('validation.email.invalid')
			.min(1, 'validation.email.required')
			.max(100, 'validation.email.maxLength'),
		username: z
			.string()
			.min(4, 'validation.username.minLength')
			.max(40, 'validation.username.maxLength')
			.regex(/^[a-zA-Z0-9_-]+$/, 'validation.username.pattern'),
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
	default: async ({ request, cookies, getClientAddress }) => {
		const ip = getClientAddress();
		const ipLimitCheck = await rateLimiter.consume(signupIpLimiter, ip, 1);
		if (!ipLimitCheck.success) {
			return fail(429, { error: 'rateLimit.signup', retryAfterSecs: ipLimitCheck.retryAfterSecs });
		}

		const formData = await request.formData();
		const values = Object.fromEntries(formData);
		const parsed = signupSchema.safeParse(values);

		if (!parsed.success) {
			return fail(400, {
				values: { email: values.email, username: values.username },
				errors: z.flattenError(parsed.error).fieldErrors
			});
		}

		const { email, username, password } = parsed.data;
		const db = getDB();

		// Check for existing user
		const existingUser = await db
			.select()
			.from(usersInAuth)
			.where(
				or(
					eq(usersInAuth.email, email.toLowerCase()),
					eq(usersInAuth.username, username.toLowerCase())
				)
			)
			.limit(1);

		if (existingUser.length > 0) {
			return fail(400, {
				values: { email, username },
				error: 'validation.email.exists'
			});
		}

		const encryptedPassword = await hashPassword(password);
		const id = crypto.randomUUID();

		try {
			await db.transaction(async (tx) => {
				await tx.insert(usersInAuth).values({
					id,
					email: email.toLowerCase(),
					username: username.toLowerCase(),
					encryptedPassword,
					role: 'user',
					emailVerified: false
				});

				await tx.insert(statsInUsers).values({
					userId: id
				});

				await tx.insert(auditLogsInAuth).values({
					userId: id,
					type: 'signup',
					ipAddress: getClientAddress(),
					userAgent: request.headers.get('user-agent') || ''
				});
			});
		} catch (err: any) {
			// Unique constraint violation (race condition on email/username)
			if (err?.code === '23505' || err?.constraint) {
				return fail(400, {
					values: { email, username },
					error: 'validation.email.exists'
				});
			}
			throw err;
		}


		const token = await createEmailVerificationToken(id);
		await sendEmailVerification(email, token);

		// Create session
		await createSession(id, cookies);

		redirect(302, '/signup/verify-email');
	}
};

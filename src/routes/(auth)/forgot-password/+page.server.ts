import { fail } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';
import { usersInAuth } from '$lib/server/db/schema/auth';
import { eq } from 'drizzle-orm';
import { createPasswordResetToken } from '$lib/server/auth/tokens';
import { sendPasswordReset } from '$lib/server/auth/email';
import { rateLimiter, forgotPasswordIpLimiter, forgotPasswordEmailLimiter } from '$lib/server/ratelimit';
import { z } from 'zod';
import type { Actions } from './$types';

const forgotPasswordSchema = z.object({
	email: z
		.email('validation.email.invalid')
		.min(1, 'validation.email.required')
		.max(100, 'validation.email.maxLength')
});

export const actions: Actions = {
	default: async ({ request, getClientAddress }) => {
		const ip = getClientAddress();
		const ipLimit = await rateLimiter.consume(forgotPasswordIpLimiter, ip);
		if (!ipLimit.success) {
			return fail(429, { error: 'rateLimit.forgotPassword', retryAfterSecs: ipLimit.retryAfterSecs });
		}

		const formData = await request.formData();
		const values = Object.fromEntries(formData);
		const parsed = forgotPasswordSchema.safeParse(values);

		if (!parsed.success) {
			return fail(400, {
				values: { email: values.email },
				errors: z.flattenError(parsed.error).fieldErrors
			});
		}

		const email = parsed.data.email.toLowerCase().trim();
		const emailLimit = await rateLimiter.consume(forgotPasswordEmailLimiter, email);
		if (!emailLimit.success) {
			return fail(429, { error: 'rateLimit.forgotPassword', retryAfterSecs: emailLimit.retryAfterSecs });
		}

		const db = getDB();
		const result = await db
			.select()
			.from(usersInAuth)
			.where(eq(usersInAuth.email, email))
			.limit(1);

		if (result.length === 0) {
			// To prevent email enumeration attacks, always return success
			return { success: true };
		}

		const user = result[0];
		const token = await createPasswordResetToken(user.id);
		await sendPasswordReset(user.email, token);

		return { success: true };
	}
};

import { fail, redirect } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';
import { usersInAuth } from '$lib/server/db/schema/auth';
import { eq } from 'drizzle-orm';
import {
	validateOneTimeToken,
	createEmailVerificationToken,
	deleteOneTimeToken
} from '$lib/server/auth/tokens';
import { sendEmailVerification } from '$lib/server/auth/email';
import { rateLimiter, verifyOtpLimiter, resendOtpLimiter } from '$lib/server/ratelimit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.user?.emailVerified) {
		redirect(302, '/');
	}

	return {
		user: {
			emailVerified: locals.user?.emailVerified,
			email: locals.user?.email
		}
	};
};

export const actions: Actions = {
	verify: async ({ request, locals }) => {
		const user = locals.user;
		if (!user) return fail(401, { error: 'unauthorized' });

		const limitCheck = await rateLimiter.safeConsume(verifyOtpLimiter, user.id, 0);
		if (!limitCheck.success) {
			await deleteOneTimeToken(user.id, 'email_confirmation');
			return fail(429, {
				error: 'rateLimit.verifyEmailLocked',
				retryAfterSecs: limitCheck.retryAfterSecs
			});
		}

		const data = await request.formData();
		const code = data.get('code')?.toString();

		if (!code || code.length !== 6) {
			return fail(400, { error: 'validation.verificationCode.incomplete' });
		}

		const isValid = await validateOneTimeToken(user.id, 'email_confirmation', code);

		if (!isValid) {
			const consume = await rateLimiter.safeConsume(verifyOtpLimiter, user.id, 1);
			if (!consume.success) {
				await deleteOneTimeToken(user.id, 'email_confirmation');
				return fail(429, {
					error: 'rateLimit.verifyEmailLocked',
					retryAfterSecs: consume.retryAfterSecs
				});
			}
			return fail(400, { error: 'invalid_code' });
		}

		const db = getDB();
		await db
			.update(usersInAuth)
			.set({ emailVerified: true, emailVerifiedAt: new Date() })
			.where(eq(usersInAuth.id, user.id));

		await deleteOneTimeToken(user.id, 'email_confirmation');

		return { success: true };
	},
	resend: async ({ locals }) => {
		const user = locals.user;
		if (!user) return fail(401, { error: 'unauthorized' });

		const limit = await rateLimiter.safeConsume(resendOtpLimiter, user.id);
		if (!limit.success) {
			return fail(429, { error: 'rateLimit.resendEmail', retryAfterSecs: limit.retryAfterSecs });
		}

		const token = await createEmailVerificationToken(user.id);
		await sendEmailVerification(user.email, user.username || '', token);

		return { resent: true };
	}
};

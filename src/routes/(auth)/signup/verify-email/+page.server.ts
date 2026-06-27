import { fail, redirect } from '@sveltejs/kit';
import { AuthService, AuthRateLimitError, AuthValidationError } from '$lib/server/services/auth';
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

		const data = await request.formData();
		const code = data.get('code')?.toString();

		if (!code || code.length !== 6) {
			return fail(400, { error: 'validation.verificationCode.incomplete' });
		}

		try {
			await AuthService.verifyEmail(user.id, code);
			return { success: true };
		} catch (error) {
			if (error instanceof AuthRateLimitError) {
				return fail(429, {
					error: error.errorKey,
					retryAfterSecs: error.retryAfterSecs
				});
			}
			if (error instanceof AuthValidationError) {
				return fail(400, { error: error.errorKey });
			}
			throw error;
		}
	},
	resend: async ({ locals }) => {
		const user = locals.user;
		if (!user) return fail(401, { error: 'unauthorized' });

		try {
			await AuthService.resendVerificationEmail(user.id, user.email, user.username || '');
			return { resent: true };
		} catch (error) {
			if (error instanceof AuthRateLimitError) {
				return fail(429, { error: error.errorKey, retryAfterSecs: error.retryAfterSecs });
			}
			throw error;
		}
	}
};

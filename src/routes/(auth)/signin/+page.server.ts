import { fail, redirect } from '@sveltejs/kit';
import { createSession } from '$lib/server/auth/session';
import { AuthService, AuthRateLimitError, AuthValidationError } from '$lib/server/services/auth';
import { z } from 'zod';
import type { Actions } from './$types';

const signinSchema = z.object({
	identifier: z.string().min(1, 'validation.identifier.required'),
	password: z.string().min(1, 'validation.password.required')
});

export const actions: Actions = {
	default: async ({ request, cookies, getClientAddress }) => {
		const formData = await request.formData();
		const values = Object.fromEntries(formData);
		const parsed = signinSchema.safeParse(values);

		if (!parsed.success) {
			return fail(400, {
				values: { identifier: values.identifier },
				errors: z.flattenError(parsed.error).fieldErrors
			});
		}

		const { identifier, password } = parsed.data;

		try {
			const user = await AuthService.signin(
				identifier,
				password,
				getClientAddress(),
				request.headers.get('user-agent') || ''
			);

			await createSession(user.id, cookies);

			if (!user.emailVerified) {
				redirect(302, '/signup/verify-email');
			}

			redirect(302, '/dashboard');
		} catch (error) {
			if (error instanceof AuthRateLimitError) {
				return fail(429, {
					values: { identifier },
					error: error.errorKey,
					retryAfterSecs: error.retryAfterSecs
				});
			}
			if (error instanceof AuthValidationError) {
				return fail(400, {
					values: { identifier },
					error: error.errorKey
				});
			}
			throw error;
		}
	}
};

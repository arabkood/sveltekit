import { fail, redirect } from '@sveltejs/kit';
import { createSession } from '$lib/server/auth/session';
import { AuthService, AuthRateLimitError, AuthValidationError } from '$lib/server/services/auth';
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

		try {
			const userId = await AuthService.signup(
				email,
				username,
				password,
				getClientAddress(),
				request.headers.get('user-agent') || ''
			);

			await createSession(userId, cookies);
			redirect(302, '/signup/verify-email');
		} catch (error) {
			if (error instanceof AuthRateLimitError) {
				return fail(429, { error: error.errorKey, retryAfterSecs: error.retryAfterSecs });
			}
			if (error instanceof AuthValidationError) {
				return fail(400, {
					values: { email, username },
					error: error.errorKey
				});
			}
			throw error;
		}
	}
};

import { fail } from '@sveltejs/kit';
import { AuthService, AuthRateLimitError, AuthValidationError } from '$lib/server/services/auth';
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

		try {
			await AuthService.resetPassword(
				token,
				password,
				getClientAddress(),
				request.headers.get('user-agent') || ''
			);
			return { success: true };
		} catch (error) {
			if (error instanceof AuthRateLimitError) {
				return fail(429, { error: error.errorKey, retryAfterSecs: error.retryAfterSecs });
			}
			if (error instanceof AuthValidationError) {
				return fail(400, { error: error.errorKey });
			}
			throw error;
		}
	}
};

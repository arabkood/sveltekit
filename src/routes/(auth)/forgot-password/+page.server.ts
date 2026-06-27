import { fail } from '@sveltejs/kit';
import { AuthService, AuthRateLimitError } from '$lib/server/services/auth';
import { z } from 'zod';
import type { Actions } from './$types';

const forgotPasswordSchema = z.object({
	email: z
		.email('validation.email.invalid')
		.min(1, 'validation.email.required')
		.max(100, 'validation.email.maxLength')
});

export const actions: Actions = {
	default: async ({ request, getClientAddress, url }) => {
		const formData = await request.formData();
		const values = Object.fromEntries(formData);
		const parsed = forgotPasswordSchema.safeParse(values);

		if (!parsed.success) {
			return fail(400, {
				values: { email: values.email },
				errors: z.flattenError(parsed.error).fieldErrors
			});
		}

		try {
			await AuthService.requestPasswordReset(
				parsed.data.email,
				getClientAddress(),
				url.origin
			);
			return { success: true };
		} catch (error) {
			if (error instanceof AuthRateLimitError) {
				return fail(429, {
					error: error.errorKey,
					retryAfterSecs: error.retryAfterSecs
				});
			}
			throw error;
		}
	}
};

import { fail } from '@sveltejs/kit';
import { createSession } from '$lib/server/auth/session';
import { AuthService, AuthRateLimitError, AuthValidationError } from '$lib/server/services/auth';
import { UserService, UserRateLimitError, UserValidationError } from '$lib/server/services/user';
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

		try {
			await UserService.changeUsername(
				user.id,
				user.username || '',
				username,
				getClientAddress(),
				request.headers.get('user-agent') || ''
			);

			return { action: 'changeAccount', success: true };
		} catch (error) {
			if (error instanceof UserRateLimitError) {
				return fail(429, {
					action: 'changeAccount',
					error: error.errorKey,
					retryAfterSecs: error.retryAfterSecs
				});
			}
			if (error instanceof UserValidationError) {
				return fail(400, {
					action: 'changeAccount',
					values: { username },
					errors: { username: [error.errorKey] }
				});
			}
			console.error('Unhandled error in changeAccount:', error);
			return fail(500, { action: 'changeAccount', error: 'errors.INTERNAL_ERROR' });
		}
	},

	changePassword: async ({ request, locals, cookies, getClientAddress }) => {
		const user = locals.user;
		if (!user) return fail(401, { action: 'changePassword', error: 'unauthorized' });

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

		try {
			await AuthService.changePassword(
				user.id,
				currentPassword,
				newPassword,
				getClientAddress(),
				request.headers.get('user-agent') || ''
			);

			await createSession(user.id, cookies);
			return { action: 'changePassword', success: true };
		} catch (error) {
			if (error instanceof AuthRateLimitError) {
				return fail(429, {
					action: 'changePassword',
					error: error.errorKey,
					retryAfterSecs: error.retryAfterSecs
				});
			}
			if (error instanceof AuthValidationError) {
				return fail(400, { action: 'changePassword', error: error.errorKey });
			}
			console.error('Unhandled error in changePassword:', error);
			return fail(500, { action: 'changePassword', error: 'errors.INTERNAL_ERROR' });
		}
	}
};

import { fail } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';
import { usersInAuth } from '$lib/server/db/schema/auth';
import { eq } from 'drizzle-orm';
import { createPasswordResetToken } from '$lib/server/auth/tokens';
import { sendPasswordReset } from '$lib/server/auth/email';
import { z } from 'zod';
import type { Actions } from './$types';

const forgotPasswordSchema = z.object({
	email: z
		.email('validation.email.invalid')
		.min(1, 'validation.email.required')
		.max(100, 'validation.email.maxLength')
});

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const values = Object.fromEntries(formData);
		const parsed = forgotPasswordSchema.safeParse(values);

		if (!parsed.success) {
			return fail(400, {
				values: { email: values.email },
				errors: z.treeifyError(parsed.error).errors
			});
		}

		const { email } = parsed.data;

		const db = getDB();
		const result = await db
			.select()
			.from(usersInAuth)
			.where(eq(usersInAuth.email, email.toLowerCase()))
			.limit(1);

		if (result.length === 0) {
			return fail(400, {
				values: { email },
				error: 'forgotPassword.emailNotFound'
			});
		}

		const user = result[0];
		const token = await createPasswordResetToken(user.id);
		await sendPasswordReset(user.email, token);

		return { success: true };
	}
};

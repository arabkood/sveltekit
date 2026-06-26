import { fail } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';
import { usersInAuth, sessionTokensInAuth, auditLogsInAuth } from '$lib/server/db/schema/auth';
import { eq } from 'drizzle-orm';
import { verifyPassword, hashPassword } from '$lib/server/auth/password';
import { createSession } from '$lib/server/auth/session';
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

export const actions: Actions = {
	changePassword: async ({ request, locals, cookies, getClientAddress }) => {
		const user = locals.user;
		if (!user) return fail(401, { error: 'unauthorized' });

		const formData = await request.formData();
		const values = Object.fromEntries(formData);
		const parsed = changePasswordSchema.safeParse(values);

		if (!parsed.success) {
			return fail(400, {
				errors: z.flattenError(parsed.error).fieldErrors
			});
		}

		const { currentPassword, newPassword } = parsed.data;

		const db = getDB();
		const result = await db.select().from(usersInAuth).where(eq(usersInAuth.id, user.id)).limit(1);

		if (result.length === 0) {
			return fail(401, { error: 'unauthorized' });
		}

		const userRecord = result[0];
		const isValid = await verifyPassword(currentPassword, userRecord.encryptedPassword);

		if (!isValid) {
			return fail(400, { error: 'settings.password.wrongCurrent' });
		}

		const encryptedPassword = await hashPassword(newPassword);

		await db.update(usersInAuth)
			.set({ encryptedPassword })
			.where(eq(usersInAuth.id, user.id));

		// Kill all sessions globally
		await db.delete(sessionTokensInAuth).where(eq(sessionTokensInAuth.userId, user.id));
		// Instantly re-authenticate the current browser
		await createSession(user.id, cookies);

		await db.insert(auditLogsInAuth).values({
			userId: user.id,
			type: 'password_change',
			ipAddress: getClientAddress(),
			userAgent: request.headers.get('user-agent') || ''
		});

		return { success: true };
	}
};

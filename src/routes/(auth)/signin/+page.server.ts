import { fail, redirect } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';
import { usersInAuth, auditLogsInAuth } from '$lib/server/db/schema/auth';
import { eq, or } from 'drizzle-orm';
import { verifyPassword, hashPassword } from '$lib/server/auth/password';
import { createSession } from '$lib/server/auth/session';
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
				errors: z.treeifyError(parsed.error).errors
			});
		}

		const { identifier, password } = parsed.data;

		const db = getDB();
		const result = await db.select().from(usersInAuth).where(
			or(
				eq(usersInAuth.email, identifier.toLowerCase()),
				eq(usersInAuth.username, identifier.toLowerCase())
			)
		).limit(1);

		if (result.length === 0) {
			// Prevent timing attacks by burning the exact same CPU cycles a real verify would take
			await hashPassword(password);
			return fail(400, { 
				values: { identifier },
				error: 'signin.invalidCredentials' 
			});
		}

		const user = result[0];
		const isValid = await verifyPassword(password, user.encryptedPassword);

		if (!isValid) {
			return fail(400, { 
				values: { identifier },
				error: 'signin.invalidCredentials' 
			});
		}

		await createSession(user.id, cookies);

		await db.insert(auditLogsInAuth).values({
			userId: user.id,
			type: 'signin',
			ipAddress: getClientAddress(),
			userAgent: request.headers.get('user-agent') || ''
		});

		if (!user.emailVerified) {
			redirect(302, '/signup/verify-email');
		}

		redirect(302, '/dashboard');
	}
};

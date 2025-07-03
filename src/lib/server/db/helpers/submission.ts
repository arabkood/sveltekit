import { and, eq } from 'drizzle-orm';
import { db } from '..';
import { submissions } from '../schema/submission';

export async function getItemSubmission(userId: string, itemId: string) {
	const rows = await db
		.select()
		.from(submissions)
		.where(and(eq(submissions.user_id, userId), eq(submissions.item_id, itemId)))
		.limit(1);

	return rows.length > 0 ? rows[0] : null;
}

export async function getSubmission(userId: string, subId: string) {
	const rows = await db
		.select()
		.from(submissions)
		.where(and(eq(submissions.user_id, userId), eq(submissions.id, subId)))
		.limit(1);

	return rows.length > 0 ? rows[0] : null;
}

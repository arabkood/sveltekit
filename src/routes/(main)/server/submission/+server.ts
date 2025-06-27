import { json, text } from '@sveltejs/kit';
import { getSubmission } from '$lib/server/db/helpers/submission';

export async function GET({ url, locals }) {
	const id = url.searchParams.get('id');
	if (!locals.user?.id || !id) {
		return text('not allowed', { status: 400 });
	}

	const submission = await getSubmission(locals.user.id, id);

	return json({ submission });
}

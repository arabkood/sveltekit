import { json, text } from '@sveltejs/kit';
import { classRepository } from '$lib/server/db/repos/class.js';

export async function GET({ url, locals }) {
	const id = url.searchParams.get('id');
	if (!locals.user?.id || !id) {
		return text('not allowed', { status: 400 });
	}

	const submission = await classRepository.getUserSubmissionById(locals.user.id, id);

	return json({ submission });
}

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { SubmissionService } from '$lib/server/services/submission';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const user = locals.user;
		if (!user) {
			return json({ error: 'UNAUTHORIZED' }, { status: 401 });
		}

		const body = await request.json();
		const { itemId, files, inputs } = body;

		if (!itemId || !files) {
			return json({ error: 'MISSING_PAYLOAD' }, { status: 400 });
		}

		const result = await SubmissionService.handleRun(user.id, itemId, files, inputs);

		return json({
			success: true,
			task_id: result.taskId
		});
	} catch (error: any) {
		console.error('Run Execution Error:', error);
		return json({ error: error.message || 'INTERNAL_ERROR' }, { status: 500 });
	}
};

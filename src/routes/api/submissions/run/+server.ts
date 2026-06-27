import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { SubmissionService } from '$lib/server/services/submission';
import { rateLimiter, runCooldownLimiter, runQuotaLimiter } from '$lib/server/ratelimit';

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

		const cooldownRes = await rateLimiter.safeConsume(runCooldownLimiter, user.id);
		if (!cooldownRes.success) {
			return json({ error: 'TOO_FAST', retryAfter: cooldownRes.retryAfterSecs }, { status: 429 });
		}

		const quotaRes = await rateLimiter.safeConsume(runQuotaLimiter, user.id);
		if (!quotaRes.success) {
			return json({ error: 'QUOTA_EXCEEDED', retryAfter: quotaRes.retryAfterSecs }, { status: 429 });
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

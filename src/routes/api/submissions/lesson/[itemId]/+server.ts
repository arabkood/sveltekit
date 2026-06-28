import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { SubmissionService } from '$lib/server/services/submission';
import { rateLimiter, submitCooldownLimiter, submitQuotaLimiter } from '$lib/server/ratelimit';

export const POST: RequestHandler = async ({ request, locals, params }) => {
	try {
		const user = locals.user;
		if (!user) {
			return json({ error: 'UNAUTHORIZED' }, { status: 401 });
		}

		const body = await request.json();
		const { data } = body;
		const itemId = params.itemId;

		if (!itemId || !data || !data['_$']) {
			return json({ error: 'MISSING_PAYLOAD' }, { status: 400 });
		}

		const cooldownRes = await rateLimiter.safeConsume(submitCooldownLimiter, user.id);
		if (!cooldownRes.success) {
			return json({ error: 'TOO_FAST', retryAfter: cooldownRes.retryAfterSecs }, { status: 429 });
		}

		const quotaRes = await rateLimiter.safeConsume(submitQuotaLimiter, user.id);
		if (!quotaRes.success) {
			return json({ error: 'QUOTA_EXCEEDED', retryAfter: quotaRes.retryAfterSecs }, { status: 429 });
		}

		const result = await SubmissionService.handleLesson(user.id, itemId, data);

		return json({
			success: true,
			submission: { id: result.submissionId, status: result.status, xp_reward: result.xpReward }
		});
	} catch (error: any) {
		console.error('Submit Lesson Error:', error);
		if (error.message === 'INVALID_PAYLOAD') {
			return json({ error: 'INVALID_PAYLOAD' }, { status: 400 });
		}
		if (error.message === 'ITEM_NOT_FOUND') {
			return json({ error: 'ITEM_NOT_FOUND' }, { status: 404 });
		}
		return json({ error: error.message || 'INTERNAL_ERROR' }, { status: 500 });
	}
};

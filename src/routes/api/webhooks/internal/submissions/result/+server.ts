import { json } from '@sveltejs/kit';
import { timingSafeEqual } from 'node:crypto';
import { SubmissionService } from '$lib/server/services/submission';
import { privateEnv } from '$lib/server/env';

// Auth is the shared secret only. The source-IP restriction (only the invoker's
// private IP may reach this port) is enforced at the Hetzner firewall — not here:
// the request arrives directly over the private network, so there's no trustworthy
// in-app IP signal (getClientAddress is bound to CF-Connecting-IP, absent here).
function validSecret(provided: string | null): boolean {
	if (!provided) return false;
	const a = Buffer.from(provided);
	const b = Buffer.from(privateEnv.WEBHOOK_SECRET);
	return a.length === b.length && timingSafeEqual(a, b);
}

export const POST = async ({ request }) => {
	if (!validSecret(request.headers.get('x-internal-secret'))) {
		console.warn('[Webhook] Blocked execution result due to invalid secret token');
		return json({ error: 'Unauthorized Token' }, { status: 401 });
	}

	try {
		const payload = await request.json();

		if (!payload || !payload.id) {
			return json({ error: 'Missing payload or task ID' }, { status: 400 });
		}

		await SubmissionService.handleWebhookResult(payload);

		return json({ success: true }, { status: 200 });
	} catch (error: any) {
		console.error('[Webhook] Failed to process execution result:', error);
		return json({ error: error.message || 'Internal error' }, { status: 500 });
	}
};

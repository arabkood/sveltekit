import { json } from '@sveltejs/kit';
import { SubmissionService } from '$lib/server/services/submission';
import { env } from '$env/dynamic/private';

export const POST = async ({ request, getClientAddress }) => {
	// 1. IP Subnet Defense-in-Depth
	// Only accept requests from the internal Hetzner subnet
	const clientIp = getClientAddress();
	const isLocalhost = clientIp.includes('127.0.0.1') || clientIp === '::1';
	const isHetznerInternal = clientIp.startsWith('10.');

	if (!isLocalhost && !isHetznerInternal) {
		console.warn(`[Webhook] Blocked execution result from unauthorized IP: ${clientIp}`);
		return json({ error: 'Unauthorized IP' }, { status: 403 });
	}

	// 2. Secret Token Authentication
	const secret = request.headers.get('x-internal-secret');
	if (!secret || secret !== env.INTERNAL_API_SECRET) {
		console.warn(`[Webhook] Blocked execution result due to invalid secret token`);
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

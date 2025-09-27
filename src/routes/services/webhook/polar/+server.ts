import { API_ENDPOINTS } from '$api/config';
import { env } from '$env/dynamic/private';
import { building } from '$app/environment';
import { Webhooks } from '@polar-sh/sveltekit';

if (!building && !env.INTERNAL_SECRET_KEY) {
	throw new Error('setup env INTERNAL_SECRET_KEY');
}

export const POST = Webhooks({
	webhookSecret: env.POLAR_WEBHOOK_SECRET!,
	onPayload: async (payload) => {
		// Handle the payload
	},
	onCustomerStateChanged: async (event) => {
		const data = event.data;
		const userId = data.externalId; // maps to auth.users.id

		if (!userId) {
			console.error('Missing externalId in Polar customer state', data);
			return;
		}

		// check premium benefit
		const targetBenefitId = env.POLAR_PREMIUM_BENEFIT_ID;
		const isPremium = data.grantedBenefits.some((b) => {
			// console.log(`Comparing: "${b.benefitId}" === "${targetBenefitId}"`, b.benefitId === targetBenefitId);
			return b.benefitId === targetBenefitId;
		});

		// collect active subscription IDs
		const subscriptionIds = data.activeSubscriptions.map((s) => s.id);

		try {
			const res = await fetch(`${API_ENDPOINTS.internal.polarSync}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Internal-Secret': env.INTERNAL_SECRET_KEY!
				},
				body: JSON.stringify({
					userId,
					premium_active: isPremium,
					polar_last_synced_at: new Date(),
					polar_customer_id: data.id,
					polar_subscription_ids: subscriptionIds
				})
			});

			if (!res.ok) {
				console.error('Failed to update backend API', await res.text());
				throw new Error('Backend API call failed');
			}

			// const responseText = await res.json();
			// console.log("Polar Sync Response Body:", responseText);
		} catch (err) {
			console.error('Webhook processing error', err);
			throw err;
		}
	}
});

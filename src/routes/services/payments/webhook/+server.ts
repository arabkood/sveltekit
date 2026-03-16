import type { RequestHandler } from './$types';
import Stripe from 'stripe';
import { privateEnv } from '$secrets';

const stripe = new Stripe(privateEnv.STRIPE_SECRET_KEY);

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.text();
	const signature = request.headers.get('stripe-signature') ?? '';

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(body, signature, privateEnv.STRIPE_WEBHOOK_SECRET);
	} catch (err: any) {
		console.error('⚠️  Webhook signature verification failed.', err.message);
		return new Response(null, { status: 400 });
	}

	let subscription: Stripe.Subscription;

	switch (event.type) {
		case 'customer.subscription.trial_will_end':
			subscription = event.data.object;
			console.log(`Subscription status is ${subscription.status}.`);
			// handleSubscriptionTrialEnding(subscription);
			break;
		case 'customer.subscription.deleted':
			subscription = event.data.object;
			console.log(`Subscription status is ${subscription.status}.`);
			// handleSubscriptionDeleted(subscription);
			break;
		case 'customer.subscription.created':
			subscription = event.data.object;
			console.log(`Subscription status is ${subscription.status}.`);
			// handleSubscriptionCreated(subscription);
			break;
		case 'customer.subscription.updated':
			subscription = event.data.object;
			console.log(`Subscription status is ${subscription.status}.`);
			// handleSubscriptionUpdated(subscription);
			break;
		case 'entitlements.active_entitlement_summary.updated':
			console.log(`Active entitlement summary updated for ${event.data.object}.`);
			// handleEntitlementUpdated(event.data.object);
			break;
		default:
			console.error(`Unhandled event type ${event.type}.`);
	}

	return new Response(null, { status: 200 });
};

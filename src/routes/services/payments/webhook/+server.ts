import type { RequestHandler } from './$types';
import Stripe from 'stripe';
import { privateEnv } from '$secrets';
import {
	subscriptionRepository,
	type PlanInterval,
	type PlanType,
	type SubscriptionState
} from '$lib/server/db/repos/subscription';

function planFromStatus(status: Stripe.Subscription.Status): PlanType {
	switch (status) {
		case 'active':
		case 'trialing':
			return 'pro';
		case 'past_due':
		case 'unpaid':
			return 'past_due';
		default:
			return 'free';
	}
}

function intervalFromSubscription(subscription: Stripe.Subscription): PlanInterval | null {
	const interval = subscription.items.data[0]?.price.recurring?.interval;
	if (interval === 'month') return 'monthly';
	if (interval === 'year') return 'yearly';
	return null;
}

function proUntilFromSubscription(subscription: Stripe.Subscription): Date | null {
	// In recent Stripe API versions the period boundary lives on the line item.
	const periodEnd = subscription.items.data[0]?.current_period_end;
	return typeof periodEnd === 'number' ? new Date(periodEnd * 1000) : null;
}

function customerId(customer: string | { id: string } | null): string | null {
	if (!customer) return null;
	return typeof customer === 'string' ? customer : customer.id;
}

// Translate full subscription state into our DB row, keyed by Stripe customer.
async function syncSubscription(subscription: Stripe.Subscription): Promise<void> {
	const cid = customerId(subscription.customer);
	if (!cid) return;

	const plan = planFromStatus(subscription.status);
	const state: SubscriptionState = {
		stripeSubscriptionId: subscription.id,
		plan,
		planInterval: plan === 'free' ? null : intervalFromSubscription(subscription),
		proUntil: plan === 'free' ? null : proUntilFromSubscription(subscription),
		cancelAtPeriodEnd: subscription.cancel_at_period_end
	};

	await subscriptionRepository.updateByStripeCustomerId(cid, state);
}

export const POST: RequestHandler = async ({ request }) => {
	const stripe = new Stripe(privateEnv.STRIPE_SECRET_KEY);

	const body = await request.text();
	const signature = request.headers.get('stripe-signature') ?? '';

	let event: Stripe.Event;
	try {
		event = stripe.webhooks.constructEvent(body, signature, privateEnv.STRIPE_WEBHOOK_SECRET);
	} catch (err: any) {
		console.error('⚠️  Webhook signature verification failed.', err.message);
		return new Response(null, { status: 400 });
	}

	try {
		switch (event.type) {
			// User completed checkout — this is where we first learn the mapping
			// between our user (client_reference_id) and the Stripe customer.
			case 'checkout.session.completed': {
				const session = event.data.object as Stripe.Checkout.Session;
				const userId = session.client_reference_id;
				const cid = customerId(session.customer);

				if (!userId || !cid) {
					console.error('checkout.session.completed missing client_reference_id or customer');
					break;
				}

				const subscriptionId =
					typeof session.subscription === 'string'
						? session.subscription
						: (session.subscription?.id ?? null);

				await subscriptionRepository.linkUserToCustomer({
					userId,
					stripeCustomerId: cid,
					stripeSubscriptionId: subscriptionId
				});

				// Sync full subscription state now that the row exists.
				if (subscriptionId) {
					const subscription = await stripe.subscriptions.retrieve(subscriptionId);
					await syncSubscription(subscription);
				}
				break;
			}

			// Subscription created / changed (plan switch, cancel-at-period-end,
			// renewal) — re-sync the full state from the subscription object.
			case 'customer.subscription.created':
			case 'customer.subscription.updated': {
				const subscription = event.data.object as Stripe.Subscription;
				await syncSubscription(subscription);
				break;
			}

			// Subscription fully ended — revoke pro access.
			case 'customer.subscription.deleted': {
				const subscription = event.data.object as Stripe.Subscription;
				const cid = customerId(subscription.customer);
				if (cid) {
					await subscriptionRepository.updateByStripeCustomerId(cid, {
						plan: 'free',
						planInterval: null,
						proUntil: null,
						cancelAtPeriodEnd: false
					});
				}
				break;
			}

			// Payment confirmed — grant or extend pro access (fires on signup AND
			// every renewal). subscription.updated also covers this, but acting on
			// the invoice keeps pro_until fresh even if events arrive out of order.
			case 'invoice.payment_succeeded': {
				const invoice = event.data.object as Stripe.Invoice;
				const cid = customerId(invoice.customer);
				const periodEnd = invoice.lines.data[0]?.period?.end;
				if (cid) {
					await subscriptionRepository.updateByStripeCustomerId(cid, {
						plan: 'pro',
						proUntil: typeof periodEnd === 'number' ? new Date(periodEnd * 1000) : undefined
					});
				}
				break;
			}

			// Payment failed — start grace period.
			case 'invoice.payment_failed': {
				const invoice = event.data.object as Stripe.Invoice;
				const cid = customerId(invoice.customer);
				if (cid) {
					await subscriptionRepository.updateByStripeCustomerId(cid, { plan: 'past_due' });
				}
				break;
			}

			// Trial ending in 3 days — remind user to add a payment method.
			case 'customer.subscription.trial_will_end': {
				// TODO: send reminder email
				break;
			}

			default:
				console.warn(`Unhandled event type: ${event.type}`);
		}
	} catch (err: any) {
		console.error(`Error handling Stripe event ${event.type}:`, err);
		// Return 500 so Stripe retries the webhook.
		return new Response(null, { status: 500 });
	}

	return new Response(null, { status: 200 });
};

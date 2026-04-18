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

	switch (event.type) {

		// User completed checkout — link Stripe customerId to your user in the DB
		case 'checkout.session.completed': {
			const session = event.data.object as Stripe.Checkout.Session;
			// map session.customer → your user via session.client_reference_id or session.customer_email
			break;
		}

		// Payment confirmed — grant or extend pro access (fires on signup AND every renewal)
		case 'invoice.payment_succeeded': {
			const invoice = event.data.object as Stripe.Invoice;
			// set user.plan = 'pro', update pro_until = invoice.lines.data[0].period.end
			break;
		}

		// Payment failed — start grace period and notify user
		case 'invoice.payment_failed': {
			const invoice = event.data.object as Stripe.Invoice;
			// set user.plan = 'past_due', send failed payment email
			break;
		}

		// Plan changed (monthly↔yearly) or scheduled to cancel at period end
		case 'customer.subscription.updated': {
			const subscription = event.data.object as Stripe.Subscription;
			// check subscription.cancel_at_period_end → flag "cancels on X date"
			// check subscription.items for plan interval change
			break;
		}

		// Subscription fully ended — revoke pro access
		case 'customer.subscription.deleted': {
			const subscription = event.data.object as Stripe.Subscription;
			// set user.plan = 'free'
			break;
		}

		// Trial ending in 3 days — remind user to add a payment method
		case 'customer.subscription.trial_will_end': {
			const subscription = event.data.object as Stripe.Subscription;
			// send reminder email
			break;
		}

		// --- FUTURE USE ---

		// User updated their card or billing details
		// Useful for: confirming payment method is valid, notifying user of card update
		case 'payment_method.updated':

		// User added a new payment method
		// Useful for: notifying user, updating default payment method in your DB
		case 'payment_method.attached':

		// Refund issued — could be triggered manually from Stripe dashboard
		// Useful for: downgrading user immediately, logging refund in your DB
		case 'charge.refunded':

		// Invoice finalized but not yet paid — useful for sending custom invoice emails
		// Useful for: white-label billing, sending your own invoice PDF
		case 'invoice.finalized':

		// Subscription was paused (if you enable pause functionality)
		// Useful for: setting user to a 'paused' plan state
		case 'customer.subscription.paused':

		// Subscription was resumed after a pause
		// Useful for: restoring pro access after pause
		case 'customer.subscription.resumed':

		// Customer deleted — e.g. via Stripe dashboard or GDPR erasure
		// Useful for: cleaning up user data, revoking access
		case 'customer.deleted':

		// A dispute was opened on a charge (chargeback)
		// Useful for: flagging account, revoking access until resolved
		case 'charge.dispute.created':

		default:
			console.warn(`Unhandled event type: ${event.type}`);
	}

	return new Response(null, { status: 200 });
};

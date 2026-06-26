import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Stripe from 'stripe';
import { SITE } from '$config';
import { privateEnv } from '$secrets';
import { subscriptionRepository } from '$lib/server/db/repos/subscription';

export const POST: RequestHandler = async ({ request, locals }) => {
	const user = locals.user;
	if (!user) {
		redirect(303, '/signin');
	}

	const stripe = new Stripe(privateEnv.STRIPE_SECRET_KEY);
	const key = (await request.formData()).get('key');

	if (!key) {
		error(400, 'key is required');
	}

	const prices = await stripe.prices.list({
		lookup_keys: [key.toString()],
		expand: ['data.product']
	});

	if (!prices.data[0]) {
		error(400, 'unknown price key');
	}

	// Reuse an existing Stripe customer so we don't create duplicates on re-subscribe.
	const existing = await subscriptionRepository.getByUserId(user.id);

	const session = await stripe.checkout.sessions.create({
		mode: 'subscription',
		billing_address_collection: 'auto',
		line_items: [
			{
				price: prices.data[0].id,
				quantity: 1
			}
		],
		// Lets the webhook map the resulting Stripe customer back to our user.
		client_reference_id: user.id,
		...(existing?.stripeCustomerId
			? { customer: existing.stripeCustomerId }
			: { customer_email: user.email }),
		success_url: `${SITE}/success?success=true&session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${SITE}/pricing`
	});

	if (!session.url) {
		error(500, 'something went wrong');
	}

	redirect(303, session.url);
};

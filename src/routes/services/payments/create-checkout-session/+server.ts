import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Stripe from 'stripe';
import { SITE } from '$config';
import { privateEnv } from '$secrets';

const stripe = new Stripe(privateEnv.STRIPE_SECRET_KEY);

export const POST: RequestHandler = async ({ url }) => {
	const key = url.searchParams.get('key');

	if (!key) {
		error(400, 'key is required');
	}

	const prices = await stripe.prices.list({
		lookup_keys: [key],
		expand: ['data.product']
	});

	const session = await stripe.checkout.sessions.create({
		billing_address_collection: 'auto',
		line_items: [
			{
				price: prices.data[0].id,
				quantity: 1
			}
		],
		mode: 'subscription',
		success_url: `${SITE}/success?success=true&session_id={CHECKOUT_SESSION_ID}`
	});

	if (!session.url) {
		error(500, 'something went wrong');
	}

	redirect(303, session.url);
};

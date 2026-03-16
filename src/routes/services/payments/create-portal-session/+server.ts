import type { RequestHandler } from './$types';
import Stripe from 'stripe';
import { SITE } from '$config';
import { redirect } from '@sveltejs/kit';
import { privateEnv } from '$secrets';

const stripe = new Stripe(privateEnv.STRIPE_SECRET_KEY);

export const POST: RequestHandler = async ({ url }) => {
	const session_id = url.searchParams.get("id")!;

	const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

	const portalSession = await stripe.billingPortal.sessions.create({
		customer: String(checkoutSession.customer),
		return_url: SITE,
	});

	redirect(303, portalSession.url);
};

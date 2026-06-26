import type { RequestHandler } from './$types';
import Stripe from 'stripe';
import { SITE } from '$config';
import { error, redirect } from '@sveltejs/kit';
import { privateEnv } from '$secrets';
import { subscriptionRepository } from '$lib/server/db/repos/subscription';

export const POST: RequestHandler = async ({ locals }) => {
	const user = locals.user;
	if (!user) {
		redirect(303, '/signin');
	}

	const subscription = await subscriptionRepository.getByUserId(user.id);
	if (!subscription?.stripeCustomerId) {
		error(400, 'no billing account found');
	}

	const stripe = new Stripe(privateEnv.STRIPE_SECRET_KEY);

	const portalSession = await stripe.billingPortal.sessions.create({
		customer: subscription.stripeCustomerId,
		return_url: `${SITE}/settings`
	});

	redirect(303, portalSession.url);
};

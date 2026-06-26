import { db } from '..';
import { eq } from 'drizzle-orm';
import { userSubscriptionsInAuth as userSubscriptions } from '../schema';

export type Subscription = typeof userSubscriptions.$inferSelect;
export type PlanType = Subscription['plan'];
export type PlanInterval = NonNullable<Subscription['planInterval']>;

// Fields that the Stripe webhook keeps in sync from subscription state.
export type SubscriptionState = {
	stripeSubscriptionId?: string | null;
	plan?: PlanType;
	planInterval?: PlanInterval | null;
	proUntil?: Date | null;
	cancelAtPeriodEnd?: boolean;
};

export class SubscriptionRepository {
	public async getByUserId(userId: string): Promise<Subscription | null> {
		const sub = await db.query.userSubscriptionsInAuth.findFirst({
			where: {
				userId: userId
			}
		});
		return sub ?? null;
	}

	public async getByStripeCustomerId(stripeCustomerId: string): Promise<Subscription | null> {
		const sub = await db.query.userSubscriptionsInAuth.findFirst({
			where: {
				stripeCustomerId: stripeCustomerId
			}
		});
		return sub ?? null;
	}

	/**
	 * Link a Stripe customer to a user, creating the subscription row if needed.
	 * Called from `checkout.session.completed`, where we first learn the mapping
	 * between our user (client_reference_id) and the Stripe customer.
	 */
	public async linkUserToCustomer(args: {
		userId: string;
		stripeCustomerId: string;
		stripeSubscriptionId?: string | null;
	}): Promise<void> {
		await db
			.insert(userSubscriptions)
			.values({
				userId: args.userId,
				stripeCustomerId: args.stripeCustomerId,
				stripeSubscriptionId: args.stripeSubscriptionId ?? null
			})
			.onConflictDoUpdate({
				target: userSubscriptions.userId,
				set: {
					stripeCustomerId: args.stripeCustomerId,
					stripeSubscriptionId: args.stripeSubscriptionId ?? null,
					updatedAt: new Date()
				}
			});
	}

	/**
	 * Update subscription state for an existing customer. No-op if the customer
	 * has not been linked to a user yet (the checkout.session.completed event
	 * is responsible for creating that link).
	 */
	public async updateByStripeCustomerId(
		stripeCustomerId: string,
		state: SubscriptionState
	): Promise<void> {
		await db
			.update(userSubscriptions)
			.set({ ...state, updatedAt: new Date() })
			.where(eq(userSubscriptions.stripeCustomerId, stripeCustomerId));
	}
}

export const subscriptionRepository = new SubscriptionRepository();

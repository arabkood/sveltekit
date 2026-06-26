import { db } from '..';
import {
	dailyStatsInUsers as dailyStats,
	statsInUsers as stats,
	trackInUsers as userTracks,
	usersInAuth as users
} from '../schema';

// Infer types
export type User = typeof users.$inferSelect;
export type UserPrivate = Pick<
	User,
	'id' | 'email' | 'username' | 'role' | 'emailVerified' | 'createdAt'
> & {
	// Derived from auth.user_subscriptions (Stripe).
	isPro: boolean;
	hasBilling: boolean;
};

type SubscriptionColumns = { plan: 'free' | 'pro' | 'past_due'; proUntil: Date | null } | null;

function isProFromSubscription(sub: SubscriptionColumns): boolean {
	if (!sub || sub.plan !== 'pro') return false;
	if (sub.proUntil && sub.proUntil.getTime() < Date.now()) return false;
	return true;
}

export type UserStats = typeof stats.$inferSelect;
export type UserDailyStats = typeof dailyStats.$inferSelect;
export type UserTrack = typeof userTracks.$inferSelect & {
	track?: {
		id: string;
		title: string;
		slug: string;
		logo: string | null;
	} | null;
};

export class UserRepository {
	public async getUserBySessionToken(token: string): Promise<UserPrivate | null> {
		const session = await db.query.sessionTokensInAuth.findFirst({
			where: {
				token: token,
				expiresAt: {
					gt: new Date()
				}
			},
			with: {
				usersInAuth: {
					columns: {
						id: true,
						email: true,
						username: true,
						role: true,
						emailVerified: true,
						createdAt: true
					},
					with: {
						userSubscriptionsInAuths: {
							columns: { plan: true, proUntil: true, stripeCustomerId: true }
						}
					}
				}
			}
		});

		const userRecord = session?.usersInAuth;
		if (!userRecord) return null;

		const { userSubscriptionsInAuths: sub, ...rest } = userRecord;
		return {
			...rest,
			isPro: isProFromSubscription(sub[0] || null),
			hasBilling: !!sub[0]?.stripeCustomerId
		};
	}

	public async getStats(userId: string): Promise<UserStats | null> {
		const userStats = await db.query.statsInUsers.findFirst({
			where: {
				userId: userId
			}
		});

		return userStats || null;
	}

	public async getDailyStats(userId: string, days: number = 7): Promise<UserDailyStats[] | null> {
		if (days < 1) {
			return null;
		}

		const fromWhen = new Date();
		fromWhen.setDate(fromWhen.getDate() - days);

		return await db.query.dailyStatsInUsers.findMany({
			where: {
				userId: userId,
				date: {
					gte: fromWhen
				}
			},
			orderBy: {
				date: 'desc'
			}
		});
	}

	public async findByUsername(username: string): Promise<UserPrivate | null> {
		const userRecord = await db.query.usersInAuth.findFirst({
			where: {
				username: username
			},
			columns: {
				id: true,
				email: true,
				username: true,
				role: true,
				emailVerified: true,
				createdAt: true
			},
			with: {
				userSubscriptionsInAuths: {
					columns: { plan: true, proUntil: true, stripeCustomerId: true }
				}
			}
		});

		if (!userRecord) return null;

		const { userSubscriptionsInAuths: sub, ...rest } = userRecord;
		return {
			...rest,
			isPro: isProFromSubscription(sub[0] || null),
			hasBilling: !!sub[0]?.stripeCustomerId
		};
	}

	public async getUserTracks(userId: string): Promise<UserTrack[]> {
		const tracks = await db.query.trackInUsers.findMany({
			where: {
				userId: userId
			},
			with: {
				tracksInClass: {
					columns: {
						id: true,
						title: true,
						slug: true,
						logo: true
					}
				}
			}
		});

		return tracks.map((t) => ({
			...t,
			track: t.tracksInClass || null
		}));
	}
}

export const userRepository = new UserRepository();

import { db } from '..';
import { and, desc, eq, gt, gte } from 'drizzle-orm';
import {
	dailyStatsInUsers,
	sessionTokensInAuth,
	statsInUsers,
	trackInUsers,
	usersInAuth
} from '../generated/drizzle/schema';

// Infer types
export type User = typeof usersInAuth.$inferSelect;
export type UserPrivate = Pick<
	User,
	| 'id'
	| 'email'
	| 'username'
	| 'role'
	| 'emailVerified'
	| 'createdAt'
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

export type UserStats = typeof statsInUsers.$inferSelect;
export type UserDailyStats = typeof dailyStatsInUsers.$inferSelect;
export type UserTrack = typeof trackInUsers.$inferSelect & {
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
			where: and(
				eq(sessionTokensInAuth.token, token),
				gt(sessionTokensInAuth.expiresAt, new Date())
			),
			with: {
				usersInAuth: {
					columns: {
						id: true,
						email: true,
						username: true,
						role: true,
						emailVerified: true,
						createdAt: true,
					},
					with: {
						userSubscriptionsInAuth: {
							columns: { plan: true, proUntil: true, stripeCustomerId: true }
						}
					}
				}
			}
		});

		const user = session?.usersInAuth;
		if (!user) return null;

		const { userSubscriptionsInAuth: sub, ...rest } = user;
		return {
			...rest,
			isPro: isProFromSubscription(sub),
			hasBilling: !!sub?.stripeCustomerId
		};
	}

	public async getStats(userId: string): Promise<UserStats | null> {
		const stats = await db.query.statsInUsers.findFirst({
			where: eq(statsInUsers.userId, userId)
		});

		return stats || null;
	}

	public async getDailyStats(userId: string, days: number = 7): Promise<UserDailyStats[] | null> {
		if (days < 1) {
			return null;
		}

		const fromWhen = new Date();
		fromWhen.setDate(fromWhen.getDate() - days);

		return await db.query.dailyStatsInUsers.findMany({
			where: and(eq(dailyStatsInUsers.userId, userId), gte(dailyStatsInUsers.date, fromWhen)),
			orderBy: desc(dailyStatsInUsers.date)
		});
	}

	public async findByUsername(username: string): Promise<UserPrivate | null> {
		const user = await db.query.usersInAuth.findFirst({
			where: eq(usersInAuth.username, username),
			columns: {
				id: true,
				email: true,
				username: true,
				role: true,
				emailVerified: true,
				createdAt: true,
			},
			with: {
				userSubscriptionsInAuth: {
					columns: { plan: true, proUntil: true, stripeCustomerId: true }
				}
			}
		});

		if (!user) return null;

		const { userSubscriptionsInAuth: sub, ...rest } = user;
		return {
			...rest,
			isPro: isProFromSubscription(sub),
			hasBilling: !!sub?.stripeCustomerId
		};
	}

	public async getUserTracks(userId: string): Promise<UserTrack[]> {
		const tracks = await db.query.trackInUsers.findMany({
			where: eq(trackInUsers.userId, userId),
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

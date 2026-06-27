import { db } from '..';
import {
	dailyStatsInUsers as dailyStats,
	statsInUsers as stats,
	trackInUsers as userTracks,
	usersInAuth as users,
	auditLogsInAuth as auditLogs,
	sessionTokensInAuth as sessionTokens
} from '../schema';
import { eq, or } from 'drizzle-orm';

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

export function isProFromSubscription(sub: SubscriptionColumns): boolean {
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
				userSubscriptionsInAuth: {
					columns: { plan: true, proUntil: true, stripeCustomerId: true }
				}
			}
		});

		if (!userRecord) return null;

		const { userSubscriptionsInAuth: sub, ...rest } = userRecord;
		return {
			...rest,
			isPro: isProFromSubscription(sub),
			hasBilling: !!sub?.stripeCustomerId
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

	public async findByEmailOrUsername(identifier: string): Promise<User | null> {
		const lowerId = identifier.toLowerCase().trim();
		const result = await db
			.select()
			.from(users)
			.where(or(eq(users.email, lowerId), eq(users.username, lowerId)))
			.limit(1);
		return result.length > 0 ? result[0] : null;
	}

	public async checkEmailOrUsernameTaken(email: string, username: string): Promise<'email' | 'username' | null> {
		const lowerEmail = email.toLowerCase().trim();
		const lowerUsername = username.toLowerCase().trim();

		const result = await db
			.select({ email: users.email, username: users.username })
			.from(users)
			.where(or(eq(users.email, lowerEmail), eq(users.username, lowerUsername)))
			.limit(1);

		if (result.length === 0) return null;
		
		const existing = result[0];
		if (existing.email === lowerEmail) return 'email';
		return 'username';
	}

	public async createUserWithStatsAndAudit(
		userData: typeof users.$inferInsert,
		ipAddress: string,
		userAgent: string
	): Promise<void> {
		await db.transaction(async (tx) => {
			await tx.insert(users).values(userData);
			await tx.insert(stats).values({ userId: userData.id });
			await tx.insert(auditLogs).values({
				userId: userData.id,
				type: 'signup',
				ipAddress,
				userAgent
			});
		});
	}

	public async updatePasswordAndInvalidateSessions(
		userId: string,
		encryptedPassword: string,
		ipAddress: string,
		userAgent: string,
		auditType: 'password_change' = 'password_change'
	): Promise<void> {
		await db.transaction(async (tx) => {
			await tx.update(users).set({ encryptedPassword }).where(eq(users.id, userId));
			await tx.delete(sessionTokens).where(eq(sessionTokens.userId, userId));
			await tx.insert(auditLogs).values({
				userId,
				type: auditType,
				ipAddress,
				userAgent
			});
		});
	}

	public async updateUsernameAndLogAudit(
		userId: string,
		username: string,
		ipAddress: string,
		userAgent: string
	): Promise<void> {
		await db.transaction(async (tx) => {
			await tx.update(users).set({ username }).where(eq(users.id, userId));
			await tx.insert(auditLogs).values({
				userId,
				type: 'username_change',
				ipAddress,
				userAgent
			});
		});
	}

	public async markEmailVerified(userId: string): Promise<void> {
		await db
			.update(users)
			.set({ emailVerified: true, emailVerifiedAt: new Date() })
			.where(eq(users.id, userId));
	}

	public async findById(userId: string): Promise<User | null> {
		const user = await db.query.usersInAuth.findFirst({
			where: { id: userId }
		});
		return user || null;
	}

	public async logAudit(
		userId: string,
		type: typeof auditLogs.$inferInsert.type,
		ipAddress: string,
		userAgent: string
	): Promise<void> {
		await db.insert(auditLogs).values({
			userId,
			type,
			ipAddress,
			userAgent
		});
	}
}

export const userRepository = new UserRepository();

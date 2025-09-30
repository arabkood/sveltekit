import { db } from '..';
import { and, desc, eq, gt, gte } from 'drizzle-orm';
import {
	dailyStatsInUsers,
	sessionTokensInAuth,
	statsInUsers,
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
	| 'premiumActive'
	| 'polarCustomerId'
>;

export type UserStats = typeof statsInUsers.$inferSelect;
export type UserDailyStats = typeof dailyStatsInUsers.$inferSelect;

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
						premiumActive: true,
						polarCustomerId: true
					}
				}
			}
		});

		return session?.usersInAuth || null;
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
}

export const userRepository = new UserRepository();

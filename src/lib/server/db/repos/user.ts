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
>;

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
			}
		});

		return user || null;
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

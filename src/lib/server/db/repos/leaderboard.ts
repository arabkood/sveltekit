import { db } from '..';
import { desc, gte, sql } from 'drizzle-orm';
import { dailyStatsInUsers, statsInUsers, usersInAuth } from '../generated/drizzle/schema';

export type LeaderboardEntry = {
	userId: string;
	username: string;
	xp: number;
	rank: number;
};

export class LeaderboardRepository {
	/**
	 * Get all-time leaderboard based on total XP
	 * @param limit Maximum number of users to return (default: 100)
	 * @param offset Skip this many users (for pagination)
	 */
	public async getAllTimeLeaderboard(limit: number = 100, offset: number = 0): Promise<LeaderboardEntry[]> {
		const results = await db
			.select({
				userId: usersInAuth.id,
				username: usersInAuth.username,
				xp: statsInUsers.totalXp
			})
			.from(statsInUsers)
			.innerJoin(usersInAuth, sql`${usersInAuth.id} = ${statsInUsers.userId}`)
			.where(sql`${statsInUsers.totalXp} > 0`)
			.orderBy(desc(statsInUsers.totalXp))
			.limit(limit)
			.offset(offset);

		return results.map((row, index) => ({
			userId: row.userId,
			username: row.username,
			xp: row.xp,
			rank: offset + index + 1
		}));
	}

	/**
	 * Get weekly leaderboard based on XP earned in the last 7 days
	 * @param limit Maximum number of users to return (default: 100)
	 * @param offset Skip this many users (for pagination)
	 */
	public async getWeeklyLeaderboard(limit: number = 100, offset: number = 0): Promise<LeaderboardEntry[]> {
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

		const results = await db
			.select({
				userId: usersInAuth.id,
				username: usersInAuth.username,
				xp: sql<number>`SUM(${dailyStatsInUsers.xpEarned})::int`
			})
			.from(dailyStatsInUsers)
			.innerJoin(usersInAuth, sql`${usersInAuth.id} = ${dailyStatsInUsers.userId}`)
			.where(gte(dailyStatsInUsers.date, sevenDaysAgo))
			.groupBy(usersInAuth.id, usersInAuth.username)
			.having(sql`SUM(${dailyStatsInUsers.xpEarned}) > 0`)
			.orderBy(desc(sql`SUM(${dailyStatsInUsers.xpEarned})`))
			.limit(limit)
			.offset(offset);

		return results.map((row, index) => ({
			userId: row.userId,
			username: row.username,
			xp: row.xp,
			rank: offset + index + 1
		}));
	}

	/**
	 * Get a user's rank in the all-time leaderboard
	 * @param userId User ID to look up
	 * @returns The user's rank, XP, and total users, or null if not found
	 */
	public async getUserAllTimeRank(userId: string): Promise<{ rank: number; xp: number; totalUsers: number } | null> {
		const result = await db.execute<{ rank: number; xp: number; total_users: number }>(sql`
			WITH ranked_users AS (
				SELECT
					s.user_id,
					s.total_xp,
					ROW_NUMBER() OVER (ORDER BY s.total_xp DESC) as rank,
					COUNT(*) OVER () as total_users
				FROM users.stats s
				WHERE s.total_xp > 0
			)
			SELECT rank::int, total_xp::int as xp, total_users::int
			FROM ranked_users
			WHERE user_id = ${userId}
		`);

		if (!result.rows[0]) return null;

		return {
			rank: result.rows[0].rank,
			xp: result.rows[0].xp,
			totalUsers: result.rows[0].total_users
		};
	}

	/**
	 * Get a user's rank in the weekly leaderboard
	 * @param userId User ID to look up
	 * @returns The user's rank and weekly XP, or null if not found
	 */
	public async getUserWeeklyRank(userId: string): Promise<{ rank: number; xp: number } | null> {
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

		const result = await db.execute<{ rank: number; xp: number }>(sql`
			WITH weekly_xp AS (
				SELECT
					ds.user_id,
					SUM(ds.xp_earned) as total_weekly_xp
				FROM users.daily_stats ds
				WHERE ds.date >= ${sevenDaysAgo}
				GROUP BY ds.user_id
				HAVING SUM(ds.xp_earned) > 0
			),
			ranked_users AS (
				SELECT
					user_id,
					total_weekly_xp,
					ROW_NUMBER() OVER (ORDER BY total_weekly_xp DESC) as rank
				FROM weekly_xp
			)
			SELECT rank::int, total_weekly_xp::int as xp
			FROM ranked_users
			WHERE user_id = ${userId}
		`);

		return result.rows[0] || null;
	}

}

export const leaderboardRepository = new LeaderboardRepository();

import { db } from '..';
import { count, desc, eq, gt, gte, sql } from 'drizzle-orm';
import {
	dailyStatsInUsers as dailyStats,
	statsInUsers as stats,
	usersInAuth as users
} from '../schema';

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
	public async getAllTimeLeaderboard(
		limit: number = 100,
		offset: number = 0
	): Promise<LeaderboardEntry[]> {
		const results = await db
			.select({
				userId: users.id,
				username: users.username,
				xp: stats.totalXp
			})
			.from(stats)
			.innerJoin(users, sql`${users.id} = ${stats.userId}`)
			.where(sql`${stats.totalXp} > 0`)
			.orderBy(desc(stats.totalXp))
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
	public async getWeeklyLeaderboard(
		limit: number = 100,
		offset: number = 0
	): Promise<LeaderboardEntry[]> {
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

		const results = await db
			.select({
				userId: users.id,
				username: users.username,
				xp: sql<number>`SUM(${dailyStats.xpEarned})::int`
			})
			.from(dailyStats)
			.innerJoin(users, sql`${users.id} = ${dailyStats.userId}`)
			.where(gte(dailyStats.date, sevenDaysAgo))
			.groupBy(users.id, users.username)
			.having(sql`SUM(${dailyStats.xpEarned}) > 0`)
			.orderBy(desc(sql`SUM(${dailyStats.xpEarned})`))
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
	public async getUserAllTimeRank(
		userId: string
	): Promise<{ rank: number; xp: number; totalUsers: number } | null> {
		const userRow = await db
			.select({ totalXp: stats.totalXp })
			.from(stats)
			.where(eq(stats.userId, userId))
			.limit(1);

		const userXp = userRow[0]?.totalXp;
		if (!userXp) return null;

		const [above, total] = await Promise.all([
			db.select({ count: count() }).from(stats).where(gt(stats.totalXp, userXp)),
			db.select({ count: count() }).from(stats).where(gt(stats.totalXp, 0))
		]);

		return {
			rank: (above[0].count ?? 0) + 1,
			xp: userXp,
			totalUsers: total[0].count ?? 0
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

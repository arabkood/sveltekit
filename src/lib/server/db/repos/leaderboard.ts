import { db } from '..';
import { count, desc, eq, gt, gte, sql } from 'drizzle-orm';
import {
	dailyStatsInUsers as dailyStats,
	statsInUsers as stats,
	usersInAuth as users
} from '../schema';
import { cacheGet, cacheSet } from '$lib/server/cache';

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
		const cacheKey = `leaderboard:all-time:${limit}:${offset}`;
		const cached = await cacheGet<LeaderboardEntry[]>(cacheKey);
		if (cached) return cached;

		const results = await db
			.select({
				userId: users.id,
				username: users.username,
				xp: stats.totalXp
			})
			.from(stats)
			.innerJoin(users, eq(users.id, stats.userId))
			.where(gt(stats.totalXp, 0))
			.orderBy(desc(stats.totalXp))
			.limit(limit)
			.offset(offset);

		const entries = results.map((row, index) => ({
			userId: row.userId,
			username: row.username,
			xp: row.xp,
			rank: offset + index + 1
		}));

		await cacheSet(cacheKey, entries, 300);
		return entries;
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
		const cacheKey = `leaderboard:weekly:${limit}:${offset}`;
		const cached = await cacheGet<LeaderboardEntry[]>(cacheKey);
		if (cached) return cached;

		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

		const results = await db
			.select({
				userId: users.id,
				username: users.username,
				xp: sql<number>`SUM(${dailyStats.xpEarned})::int`
			})
			.from(dailyStats)
			.innerJoin(users, eq(users.id, dailyStats.userId))
			.where(gte(dailyStats.date, sevenDaysAgo))
			.groupBy(users.id, users.username)
			.having(sql`SUM(${dailyStats.xpEarned}) > 0`)
			.orderBy(desc(sql`SUM(${dailyStats.xpEarned})`))
			.limit(limit)
			.offset(offset);

		const entries = results.map((row, index) => ({
			userId: row.userId,
			username: row.username,
			xp: row.xp,
			rank: offset + index + 1
		}));

		await cacheSet(cacheKey, entries, 300);
		return entries;
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

}

export const leaderboardRepository = new LeaderboardRepository();

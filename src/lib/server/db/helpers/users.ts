import { and, desc, eq, gte } from 'drizzle-orm';
import { db } from '..';
import { userModulesAttempt, userModulesSubmission, usersDailyStats, usersStats, userTracks } from '../schema/users';

export async function getUserStats(userId: string) {
  const result = await db.select().from(usersStats).where(eq(usersStats.userId, userId)).limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function getUserStreakData(userId: string) {
  // Get basic streak stats
  const stats = await db.select().from(usersStats).where(eq(usersStats.userId, userId)).limit(1);

  // Get last 30 days of activity
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const dailyActivity = await db
    .select({
      date: usersDailyStats.date,
      xpEarned: usersDailyStats.xpEarned,
      itemsCompleted: usersDailyStats.itemsCompleted
    })
    .from(usersDailyStats)
    .where(
      and(
        eq(usersDailyStats.userId, userId),
        gte(usersDailyStats.date, thirtyDaysAgo)
      )
    )
    .orderBy(desc(usersDailyStats.date));

  // Process data for the component
  const activityMap = new Map();
  dailyActivity.forEach(day => {
    const dateKey = new Date(day.date).toDateString();
    activityMap.set(dateKey, {
      xp: day.xpEarned,
      items: day.itemsCompleted,
      active: day.itemsCompleted > 0 || day.xpEarned > 0
    });
  });

  return {
    currentStreak: stats[0]?.currentStreak || 0,
    longestStreak: stats[0]?.longestStreak || 0,
    lastActiveDate: stats[0]?.lastActiveDate || null,
    recentActivity: activityMap
  };
}

export async function getUserTracks(userId: string) {
  return await db.select().from(userTracks).where(eq(userTracks.userId, userId));
}

export async function getUserModule(userId: string, moduleId: string) {
  // if there is a submission, return it
  const sub = await db
    .select()
    .from(userModulesSubmission)
    .where(
      and(eq(userModulesSubmission.userId, userId), eq(userModulesSubmission.moduleId, moduleId))
    )
    .limit(1)
    .execute()
    .then((res) => res[0]);

  if (sub) {
    return sub;
  }
  // otherwise, return latest attempt

  const attempt = await db
    .select()
    .from(userModulesAttempt)
    .where(and(eq(userModulesAttempt.userId, userId), eq(userModulesAttempt.moduleId, moduleId)))
    .limit(1)
    .execute()
    .then((res) => res[0]);

  if (attempt) {
    return attempt;
  }

  return null;
}

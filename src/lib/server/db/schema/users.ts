import { uuid, bigint, integer, timestamp, pgSchema, text, jsonb, date } from 'drizzle-orm/pg-core';
import { users } from './auth';
import { modules, tracks } from './class';

export const usersSchema = pgSchema('users');

export const usersStats = usersSchema.table('stats', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  totalXp: bigint('total_xp', { mode: 'number' }).notNull().default(0),
  completedItems: integer('completed_items').notNull().default(0),
  longestStreak: integer('longest_streak').notNull().default(0),
  lastActiveAt: timestamp('last_active_at', { withTimezone: true }),
  currentStreak: integer('current_streak').notNull().default(0),
  lastActiveDate: date('last_active_date').notNull()
});
export type SelectUsersStats = typeof usersStats.$inferSelect;

export const usersDailyStats = usersSchema.table('daily_stats', {
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  date: timestamp('date', { withTimezone: true }).notNull(),
  xpEarned: bigint('xp_earned', { mode: 'number' }).notNull().default(0),
  itemsCompleted: integer('items_completed').notNull().default(0)
});
export type SelectUsersDailyStats = typeof usersDailyStats.$inferSelect;

export const userTracks = usersSchema.table('track', {
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  trackId: uuid('track_id')
    .notNull()
    .references(() => tracks.id, { onDelete: 'cascade' }),
  completedItems: integer('completed_items').notNull().default(0),
  startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
  lastActivityAt: timestamp('last_activity_at', { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true })
});
export type SelectUserTracks = typeof userTracks.$inferSelect;

export const userModulesAttempt = usersSchema.table('modules_attempt', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  moduleId: uuid('module_id')
    .notNull()
    .references(() => modules.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('wait'), // wait, fail, error, pass
  attempts: integer('attempts').notNull().default(1),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  userFiles: jsonb('user_files'),
  args: jsonb('args'),
  results: jsonb('results')
});

export const userModulesSubmission = usersSchema.table('modules_submission', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  moduleId: uuid('module_id')
    .notNull()
    .references(() => modules.id, { onDelete: 'cascade' }),
  xpReward: integer('xp_reward').notNull().default(0),
  attempts: integer('attempts').notNull().default(1),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  userFiles: jsonb('user_files'),
  args: jsonb('args'),
  results: jsonb('results')
});

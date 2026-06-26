import {
	pgSchema,
	uuid,
	bigserial,
	text,
	bigint,
	varchar,
	date,
	timestamp,
	integer,
	jsonb,
	primaryKey,
	unique
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { usersInAuth } from './auth';
import { itemsInClass, tracksInClass } from './class';

export const users = pgSchema('users');

export const dailyStatsInUsers = users.table(
	'daily_stats',
	{
		userId: uuid('user_id')
			.notNull()
			.references(() => usersInAuth.id, { onDelete: 'cascade' }),
		date: date({ mode: 'date' })
			.default(sql`CURRENT_DATE`)
			.notNull(),
		xpEarned: bigint('xp_earned', { mode: 'number' }).default(0).notNull(),
		itemsCompleted: integer('items_completed').default(0).notNull()
	},
	(table) => [primaryKey({ columns: [table.userId, table.date], name: 'daily_stats_pkey' })]
);

export const statsInUsers = users.table('stats', {
	userId: uuid('user_id')
		.primaryKey()
		.references(() => usersInAuth.id, { onDelete: 'cascade' }),
	totalXp: bigint('total_xp', { mode: 'number' }).default(0).notNull(),
	completedItems: integer('completed_items').default(0).notNull(),
	longestStreak: integer('longest_streak').default(0).notNull(),
	lastActiveAt: timestamp('last_active_at', { withTimezone: true }),
	currentStreak: integer('current_streak').default(0).notNull(),
	lastActiveDate: date('last_active_date', { mode: 'date' })
		.default(sql`CURRENT_DATE`)
		.notNull()
});

export const submissionInUsers = users.table(
	'submission',
	{
		id: uuid().defaultRandom().primaryKey(),
		userId: uuid('user_id')
			.notNull()
			.references(() => usersInAuth.id, { onDelete: 'cascade' }),
		itemId: uuid('item_id')
			.notNull()
			.references(() => itemsInClass.id, { onDelete: 'cascade' }),
		status: text().default('wait').notNull(),
		xpReward: integer('xp_reward').default(0).notNull(),
		attempts: integer().default(1).notNull(),
		createdAt: timestamp('created_at', { withTimezone: true })
			.default(sql`now()`)
			.notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.default(sql`now()`)
			.notNull(),
		metadata: jsonb(),
		data: jsonb(),
		results: jsonb()
	},
	(table) => [unique('submission_item_id_user_id_key').on(table.itemId, table.userId)]
);

export const trackInUsers = users.table(
	'track',
	{
		userId: uuid('user_id')
			.notNull()
			.references(() => usersInAuth.id, { onDelete: 'cascade' }),
		trackId: uuid('track_id')
			.notNull()
			.references(() => tracksInClass.id, { onDelete: 'cascade' }),
		completedItems: integer('completed_items').default(0).notNull(),
		startedAt: timestamp('started_at', { withTimezone: true })
			.default(sql`now()`)
			.notNull(),
		lastActivityAt: timestamp('last_activity_at', { withTimezone: true })
			.default(sql`now()`)
			.notNull(),
		completedAt: timestamp('completed_at', { withTimezone: true })
	},
	(table) => [primaryKey({ columns: [table.userId, table.trackId], name: 'track_pkey' })]
);

export const xpEventsInUsers = users.table('xp_events', {
	id: bigserial({ mode: 'number' }).primaryKey(),
	userId: uuid('user_id')
		.notNull()
		.references(() => usersInAuth.id, { onDelete: 'cascade' }),
	xpAmount: integer('xp_amount').notNull(),
	sourceType: varchar('source_type', { length: 50 }).notNull(),
	sourceId: uuid('source_id').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).default(sql`now()`)
});

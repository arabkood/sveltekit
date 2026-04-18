import {
	pgTable,
	pgSchema,
	foreignKey,
	check,
	text,
	uuid,
	timestamp,
	unique,
	boolean,
	integer,
	index,
	bigserial,
	inet,
	jsonb,
	bigint,
	date,
	varchar,
	primaryKey
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgSchema('users');
export const auth = pgSchema('auth');
export const classSchema = pgSchema('class');
export const auditLogTypeInAuth = auth.enum('audit_log_type', [
	'signup',
	'signin',
	'signout',
	'password_change',
	'email_change',
	'session_token'
]);
export const oneTimeTokenTypeInAuth = auth.enum('one_time_token_type', [
	'email_confirmation',
	'email_change',
	'password_change',
	'password_recovery'
]);

export const sessionTokensInAuth = auth.table(
	'session_tokens',
	{
		token: text().primaryKey().notNull(),
		userId: uuid('user_id').notNull(),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
		expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
		lastUsedAt: timestamp('last_used_at', { withTimezone: true, mode: 'date' })
	},
	(table) => [
		foreignKey({
			columns: [table.userId],
			foreignColumns: [usersInAuth.id],
			name: 'session_tokens_user_id_fkey'
		}).onDelete('cascade'),
		check('session_tokens_token_check', sql`char_length(token) > 0`)
	]
);

export const tracksInClass = classSchema.table(
	'tracks',
	{
		topicId: uuid('topic_id').notNull(),
		id: uuid().defaultRandom().primaryKey().notNull(),
		slug: text().notNull(),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
		title: text().notNull(),
		blurb: text(),
		logo: text(),
		hash: text(),
		premiumOnly: boolean('premium_only').default(false),
		comingSoon: boolean('coming_soon').default(false),
		position: integer(),
		difficulty: text(),
		tags: text().array()
	},
	(table) => [
		foreignKey({
			columns: [table.topicId],
			foreignColumns: [topicsInClass.id],
			name: 'tracks_topic_id_fkey'
		}).onDelete('cascade'),
		unique('slug').on(table.slug)
	]
);

export const auditLogsInAuth = auth.table(
	'audit_logs',
	{
		id: bigserial({ mode: 'bigint' }).primaryKey().notNull(),
		userId: uuid('user_id'),
		type: auditLogTypeInAuth().notNull(),
		ipAddress: inet('ip_address'),
		userAgent: text('user_agent'),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
		metadata: jsonb()
	},
	(table) => [
		index('idx_audit_logs_user_time').using(
			'btree',
			table.userId.asc().nullsLast().op('timestamptz_ops'),
			table.createdAt.desc().nullsFirst().op('timestamptz_ops')
		),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [usersInAuth.id],
			name: 'audit_logs_user_id_fkey'
		}).onDelete('set null')
	]
);

export const statsInUsers = users.table(
	'stats',
	{
		userId: uuid('user_id').primaryKey().notNull(),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		totalXp: bigint('total_xp', { mode: 'number' }).default(0).notNull(),
		completedItems: integer('completed_items').default(0).notNull(),
		longestStreak: integer('longest_streak').default(0).notNull(),
		lastActiveAt: timestamp('last_active_at', { withTimezone: true, mode: 'date' }),
		currentStreak: integer('current_streak').default(0).notNull(),
		lastActiveDate: date('last_active_date')
			.default(sql`CURRENT_DATE`)
			.notNull()
	},
	(table) => [
		foreignKey({
			columns: [table.userId],
			foreignColumns: [usersInAuth.id],
			name: 'stats_user_id_fkey'
		}).onDelete('cascade')
	]
);

export const topicsInClass = classSchema.table('topics', {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	title: text().notNull(),
	blurb: text(),
	logo: text(),
	hash: text()
});

export const usersInAuth = auth.table(
	'users',
	{
		id: uuid().primaryKey().notNull(),
		email: varchar({ length: 254 }).notNull(),
		username: varchar({ length: 30 }).notNull(),
		role: varchar({ length: 255 }).default('user').notNull(),
		encryptedPassword: text('encrypted_password').notNull(),
		emailVerified: boolean('email_verified').default(false).notNull(),
		emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true, mode: 'date' }),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	},
	(table) => [
		index('users_active_email_lower_idx').using('btree', sql`lower((email)::text)`),
		index('users_active_username_lower_idx').using('btree', sql`lower((username)::text)`),
		unique('users_email_key').on(table.email),
		unique('users_username_key').on(table.username)
	]
);

export const modulesInClass = classSchema.table(
	'modules',
	{
		trackId: uuid('track_id').notNull(),
		id: uuid().defaultRandom().primaryKey().notNull(),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
		hash: text(),
		title: text().notNull(),
		position: integer(),
		premiumOnly: boolean('premium_only').default(false)
	},
	(table) => [
		foreignKey({
			columns: [table.trackId],
			foreignColumns: [tracksInClass.id],
			name: 'modules_track_id_fkey'
		}).onDelete('cascade')
	]
);

export const itemsInClass = classSchema.table(
	'items',
	{
		moduleId: uuid('module_id').notNull(),
		id: uuid().defaultRandom().primaryKey().notNull(),
		slug: text().notNull(),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
		hash: text(),
		type: text(),
		position: integer(),
		title: text().notNull(),
		blurb: text(),
		difficulty: text(),
		premiumOnly: boolean('premium_only').default(false),
		baseXp: integer('base_xp').default(1),
		s3Path: text('s3_path')
	},
	(table) => [
		foreignKey({
			columns: [table.moduleId],
			foreignColumns: [modulesInClass.id],
			name: 'items_module_id_fkey'
		}).onDelete('cascade')
	]
);

export const submissionInUsers = users.table(
	'submission',
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		userId: uuid('user_id').notNull(),
		itemId: uuid('item_id').notNull(),
		status: text().default('wait').notNull(),
		xpReward: integer('xp_reward').default(0).notNull(),
		attempts: integer().default(1).notNull(),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
		metadata: jsonb(),
		data: jsonb(),
		results: jsonb()
	},
	(table) => [
		foreignKey({
			columns: [table.userId],
			foreignColumns: [usersInAuth.id],
			name: 'submission_user_id_fkey'
		}).onDelete('cascade'),
		foreignKey({
			columns: [table.itemId],
			foreignColumns: [itemsInClass.id],
			name: 'submission_item_id_fkey'
		}).onDelete('cascade'),
		unique('submission_item_id_user_id_key').on(table.userId, table.itemId)
	]
);

export const xpEventsInUsers = users.table(
	'xp_events',
	{
		id: bigserial({ mode: 'bigint' }).primaryKey().notNull(),
		userId: uuid('user_id').notNull(),
		xpAmount: integer('xp_amount').notNull(),
		sourceType: varchar('source_type', { length: 50 }).notNull(),
		sourceId: uuid('source_id').notNull(),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow()
	},
	(table) => [
		foreignKey({
			columns: [table.userId],
			foreignColumns: [usersInAuth.id],
			name: 'xp_events_user_id_fkey'
		}).onDelete('cascade')
	]
);

export const dailyStatsInUsers = users.table(
	'daily_stats',
	{
		userId: uuid('user_id').notNull(),
		date: date({ mode: 'date' })
			.default(sql`CURRENT_DATE`)
			.notNull(),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		xpEarned: bigint('xp_earned', { mode: 'number' }).default(0).notNull(),
		itemsCompleted: integer('items_completed').default(0).notNull()
	},
	(table) => [
		foreignKey({
			columns: [table.userId],
			foreignColumns: [usersInAuth.id],
			name: 'daily_stats_user_id_fkey'
		}).onDelete('cascade'),
		primaryKey({ columns: [table.userId, table.date], name: 'daily_stats_pkey' })
	]
);

export const oneTimeTokensInAuth = auth.table(
	'one_time_tokens',
	{
		userId: uuid('user_id').notNull(),
		type: oneTimeTokenTypeInAuth().notNull(),
		token: text().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
		expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
		metadata: jsonb()
	},
	(table) => [
		foreignKey({
			columns: [table.userId],
			foreignColumns: [usersInAuth.id],
			name: 'one_time_tokens_user_id_fkey'
		}).onDelete('cascade'),
		primaryKey({ columns: [table.userId, table.type], name: 'one_time_tokens_pkey' }),
		check('one_time_tokens_token_check', sql`char_length(token) > 0`)
	]
);

export const trackInUsers = users.table(
	'track',
	{
		userId: uuid('user_id').notNull(),
		trackId: uuid('track_id').notNull(),
		completedItems: integer('completed_items').default(0).notNull(),
		startedAt: timestamp('started_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
		lastActivityAt: timestamp('last_activity_at', { withTimezone: true, mode: 'date' })
			.defaultNow()
			.notNull(),
		completedAt: timestamp('completed_at', { withTimezone: true, mode: 'date' })
	},
	(table) => [
		foreignKey({
			columns: [table.userId],
			foreignColumns: [usersInAuth.id],
			name: 'track_user_id_fkey'
		}).onDelete('cascade'),
		foreignKey({
			columns: [table.trackId],
			foreignColumns: [tracksInClass.id],
			name: 'track_track_id_fkey'
		}).onDelete('cascade'),
		primaryKey({ columns: [table.userId, table.trackId], name: 'track_pkey' })
	]
);

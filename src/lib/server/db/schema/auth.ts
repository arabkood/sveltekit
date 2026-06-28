import {
	pgSchema,
	uuid,
	bigserial,
	text,
	varchar,
	timestamp,
	inet,
	jsonb,
	boolean,
	index,
	primaryKey,
	unique,
	check
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const auth = pgSchema('auth');
export const oneTimeTokenTypeInAuth = auth.enum('one_time_token_type', [
	'email_confirmation',
	'email_change',
	'password_change',
	'password_recovery'
]);
export const auditLogTypeInAuth = auth.enum('audit_log_type', [
	'signup',
	'signin',
	'signout',
	'password_change',
	'email_change',
	'session_token',
	'username_change'
]);
export const planTypeInAuth = auth.enum('plan_type', ['free', 'pro', 'past_due']);
export const planIntervalInAuth = auth.enum('plan_interval', ['monthly', 'yearly']);

export const auditLogsInAuth = auth.table(
	'audit_logs',
	{
		id: bigserial({ mode: 'number' }).primaryKey(),
		userId: uuid('user_id').references(() => usersInAuth.id, { onDelete: 'set null' }),
		type: auditLogTypeInAuth().notNull(),
		ipAddress: inet('ip_address'),
		userAgent: text('user_agent'),
		createdAt: timestamp('created_at', { withTimezone: true })
			.default(sql`now()`)
			.notNull(),
		metadata: jsonb()
	},
	(table) => [
		index('idx_audit_logs_user_time').using(
			'btree',
			table.userId.asc().nullsLast(),
			table.createdAt.desc().nullsFirst()
		)
	]
);

export const oneTimeTokensInAuth = auth.table(
	'one_time_tokens',
	{
		userId: uuid('user_id')
			.notNull()
			.references(() => usersInAuth.id, { onDelete: 'cascade' }),
		type: oneTimeTokenTypeInAuth().notNull(),
		token: text().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.default(sql`now()`)
			.notNull(),
		expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
		metadata: jsonb()
	},
	(table) => [
		primaryKey({ columns: [table.userId, table.type], name: 'one_time_tokens_pkey' }),
		check('one_time_tokens_token_check', sql`(char_length(token) > 0)`)
	]
);

export const sessionTokensInAuth = auth.table(
	'session_tokens',
	{
		token: text().primaryKey(),
		userId: uuid('user_id')
			.notNull()
			.references(() => usersInAuth.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at', { withTimezone: true })
			.default(sql`now()`)
			.notNull(),
		expiresAt: timestamp('expires_at', { withTimezone: true }).notNull()
	},
	(table) => [
		check('session_tokens_token_check', sql`(char_length(token) > 0)`),
		index('idx_session_tokens_user_id').using('btree', table.userId.asc().nullsLast())
	]
);

export const userSubscriptionsInAuth = auth.table(
	'user_subscriptions',
	{
		userId: uuid('user_id')
			.primaryKey()
			.references(() => usersInAuth.id, { onDelete: 'cascade' }),
		stripeCustomerId: text('stripe_customer_id').notNull(),
		stripeSubscriptionId: text('stripe_subscription_id'),
		plan: planTypeInAuth().default('free').notNull(),
		planInterval: planIntervalInAuth('plan_interval'),
		proUntil: timestamp('pro_until', { withTimezone: true }),
		cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false).notNull(),
		createdAt: timestamp('created_at', { withTimezone: true })
			.default(sql`now()`)
			.notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.default(sql`now()`)
			.notNull()
	},
	(table) => [
		index('idx_user_subscriptions_stripe_customer').using(
			'btree',
			table.stripeCustomerId.asc().nullsLast()
		),
		unique('user_subscriptions_stripe_customer_id_key').on(table.stripeCustomerId),
		unique('user_subscriptions_stripe_subscription_id_key').on(table.stripeSubscriptionId)
	]
);

export const usersInAuth = auth.table(
	'users',
	{
		id: uuid().primaryKey(),
		email: varchar({ length: 254 }).notNull(),
		username: varchar({ length: 30 }).notNull(),
		role: varchar({ length: 255 }).default('user').notNull(),
		encryptedPassword: text('encrypted_password').notNull(),
		emailVerified: boolean('email_verified').default(false).notNull(),
		emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),
		createdAt: timestamp('created_at', { withTimezone: true })
			.default(sql`now()`)
			.notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.default(sql`now()`)
			.notNull()
	},
	(table) => [
		index('users_active_email_lower_idx').using('btree', sql`lower((email)::text)`),
		index('users_active_username_lower_idx').using('btree', sql`lower((username)::text)`),
		unique('users_email_key').on(table.email),
		unique('users_username_key').on(table.username)
	]
);

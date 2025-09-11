import {
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  bigserial,
  jsonb,
  pgSchema
} from 'drizzle-orm/pg-core';

// Create the auth schema
export const authSchema = pgSchema('auth');

// Define ENUMs
export const oneTimeTokenType = authSchema.enum('one_time_token_type', [
  'email_confirmation',
  'email_change',
  'password_change',
  'password_recovery'
]);

export const auditLogType = authSchema.enum('audit_log_type', [
  'signup',
  'signin',
  'signout',
  'password_change',
  'email_change',
  'session_token'
]);

// Users table
export const users = authSchema.table('users', {
  // Core Identity
  id: uuid('id').primaryKey().notNull(),
  email: varchar('email', { length: 254 }).notNull().unique(),
  username: varchar('username', { length: 30 }).notNull().unique(),
  role: varchar('role', { length: 255 }).notNull().default('user'),

  // Authentication
  encryptedPassword: text('encrypted_password').notNull(),
  emailVerified: boolean('email_verified').notNull().default(false),
  emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),

  // Premium / Polar
  premiumActive: boolean('premium_active').notNull().default(false),
  polarLastSyncedAt: timestamp('polar_last_synced_at', { withTimezone: true }),
  polarCustomerId: uuid('polar_customer_id'),
  polarSubscriptionIds: uuid('polar_subscription_ids').array(),

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
export type SelectUser = typeof users.$inferSelect;

// Session tokens table
export const sessionTokens = authSchema.table('session_tokens', {
  token: text('token').primaryKey().notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  lastUsedAt: timestamp('last_used_at', { withTimezone: true })
});

// One-time tokens table
export const oneTimeTokens = authSchema.table('one_time_tokens', {
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: oneTimeTokenType('type').notNull(),
  token: text('token').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  metadata: jsonb('metadata')
});

// Audit logs table
export const auditLogs = authSchema.table('audit_logs', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  type: auditLogType('type').notNull(),
  ipAddress: text('ip_address'), // Using text instead of inet as Drizzle doesn't have a direct inet type
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  metadata: jsonb('metadata')
});

import { uuid, timestamp, integer, text, pgSchema, jsonb } from 'drizzle-orm/pg-core';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { items } from './class';

export const usersSchema = pgSchema('users');

// Submission table definition
export const submissions = usersSchema.table('submission', {
	id: uuid('id').primaryKey().defaultRandom(),

	user_id: uuid('user_id')
		.notNull()
		.references(() => items.id),

	item_id: uuid('item_id')
		.notNull()
		.references(() => items.id),

	status: text('status').default('wait').notNull(), // 'wait', 'pass', 'fail', 'error'
	xp_reward: integer('xp_reward').default(0).notNull(),
	attempts: integer('attempts').default(1).notNull(),

	created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),

	metadata: jsonb('metadata'),
	data: jsonb('data'),
	results: jsonb('results')
});

// Types for CRUD operations
export type Submission = InferSelectModel<typeof submissions>;
export type SubmissionInsert = InferInsertModel<typeof submissions>;
export type SubmissionPartial = Partial<SubmissionInsert>;

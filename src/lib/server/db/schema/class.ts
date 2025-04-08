import {
	uuid,
	timestamp,
	varchar,
	text,
	integer,
	boolean,
	pgSchema,
	jsonb
} from 'drizzle-orm/pg-core';
import { users } from './auth';

export const classSchema = pgSchema('class');

export const tracks = classSchema.table('tracks', {
	id: uuid('id').defaultRandom().notNull(),
	title: varchar('title', { length: 255 }).notNull(),
	slug: varchar('slug', { length: 100 }).notNull().unique(),
	description: text('description'),
	logo: text('logo'),
	programmingLanguages: text('programming_languages').array(),
	difficulty: varchar('difficulty').default('beginner'),
	premiumOnly: boolean('premium_only').default(false).notNull(),
	skills: text('skills').array(),
	tags: text('tags').array(),
	totalXp: integer('total_xp').default(0).notNull(),
	totalModules: integer('total_modules').default(0).notNull(),
	estimatedHours: integer('estimated_hours'),
	students: integer('students').default(0).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
	deletedAt: timestamp('deleted_at', { withTimezone: true }),
	outcomes: text('outcomes').array(),
	requirements: text('requirements').array()
});
export type SelectTrack = typeof tracks.$inferSelect;

export const tracksSections = classSchema.table('tracks_sections', {
	id: uuid('id').defaultRandom().notNull(),
	trackId: uuid('track_id')
		.notNull()
		.references(() => tracks.id, { onDelete: 'cascade' }),
	title: varchar('title', { length: 255 }).notNull(),
	description: text('description').notNull(),
	orderNumber: integer('order_number').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
	deletedAt: timestamp('deleted_at', { withTimezone: true })
});

export const modules = classSchema.table('modules', {
	id: uuid('id').defaultRandom().notNull(),
	slug: varchar('slug', { length: 100 }).notNull().unique(),
	trackId: uuid('track_id')
		.notNull()
		.references(() => tracks.id, { onDelete: 'cascade' }),
	title: varchar('title', { length: 255 }).notNull(),
	description: text('description'),
	orderNumber: integer('order_number'),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
	xpReward: integer('xp_reward').default(0).notNull(),
	estimatedMinutes: integer('estimated_minutes'),
	difficulty: text('difficulty'),
	dependencies: uuid('dependencies').array(),
	premiumOnly: boolean('premium_only').default(false).notNull(),
	sectionId: uuid('section_id').references(() => tracksSections.id, { onDelete: 'cascade' }),
	type: text('type').notNull(),
	source: text('source').notNull(),
	deletedAt: timestamp('deleted_at', { withTimezone: true })
});
export type SelectModule = typeof modules.$inferSelect;

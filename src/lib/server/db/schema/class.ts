import { pgSchema, uuid, text, timestamp, integer, boolean, unique } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const classSchema = pgSchema('class');

export const itemsInClass = classSchema.table('items', {
	moduleId: uuid('module_id')
		.notNull()
		.references(() => modulesInClass.id, { onDelete: 'cascade' }),
	id: uuid().defaultRandom().primaryKey(),
	slug: text().notNull(),
	createdAt: timestamp('created_at', { withTimezone: true })
		.default(sql`now()`)
		.notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.default(sql`now()`)
		.notNull(),
	hash: text(),
	type: text(),
	position: integer(),
	title: text().notNull(),
	blurb: text(),
	difficulty: text(),
	premiumOnly: boolean('premium_only').default(false),
	baseXp: integer('base_xp').default(1),
	s3Path: text('s3_path')
});

export const modulesInClass = classSchema.table('modules', {
	trackId: uuid('track_id')
		.notNull()
		.references(() => tracksInClass.id, { onDelete: 'cascade' }),
	id: uuid().defaultRandom().primaryKey(),
	createdAt: timestamp('created_at', { withTimezone: true })
		.default(sql`now()`)
		.notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.default(sql`now()`)
		.notNull(),
	hash: text(),
	title: text().notNull(),
	position: integer(),
	premiumOnly: boolean('premium_only').default(false)
});

export const topicsInClass = classSchema.table('topics', {
	id: uuid().defaultRandom().primaryKey(),
	createdAt: timestamp('created_at', { withTimezone: true })
		.default(sql`now()`)
		.notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.default(sql`now()`)
		.notNull(),
	title: text().notNull(),
	blurb: text(),
	logo: text(),
	hash: text()
});

export const tracksInClass = classSchema.table(
	'tracks',
	{
		topicId: uuid('topic_id')
			.notNull()
			.references(() => topicsInClass.id, { onDelete: 'cascade' }),
		id: uuid().defaultRandom().primaryKey(),
		slug: text().notNull(),
		createdAt: timestamp('created_at', { withTimezone: true })
			.default(sql`now()`)
			.notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.default(sql`now()`)
			.notNull(),
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
	(table) => [unique('slug').on(table.slug)]
);

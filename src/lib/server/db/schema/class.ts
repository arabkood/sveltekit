import { uuid, text, timestamp, boolean, integer, pgSchema } from 'drizzle-orm/pg-core';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';

export const classSchema = pgSchema('class');

// Topics table definition
export const topics = classSchema.table('topics', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  title: text('title').notNull(),
  blurb: text('blurb'),
  hash: text('hash'),
  logo: text('logo')
});

// Tracks table definition
export const tracks = classSchema.table('tracks', {
  id: uuid('id').primaryKey().defaultRandom(),
  topic_id: uuid('topic_id')
    .references(() => topics.id)
    .notNull(),
  slug: text('slug').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  title: text('title').notNull(),
  blurb: text('blurb'),
  logo: text('logo'),
  hash: text('hash'),
  premium_only: boolean('premium_only').default(false).notNull(),
  coming_soon: boolean('coming_soon').default(false),
  position: integer('position').default(0),
  difficulty: text("difficulty"),
  tags: text("tags").array().default([]),
});

// Modules table definition
export const modules = classSchema.table('modules', {
  id: uuid('id').primaryKey().defaultRandom(),
  track_id: uuid('track_id')
    .references(() => tracks.id)
    .notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  title: text('title').notNull(),
  position: integer('position').notNull(),
  hash: text('hash'),
  premium_only: boolean('premium_only').default(false).notNull()
});

// Items table definition
export const items = classSchema.table('items', {
  id: uuid('id').primaryKey().defaultRandom(),
  module_id: uuid('module_id')
    .references(() => modules.id)
    .notNull(),
  slug: text('slug').notNull(),
  position: integer('position').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  type: text('type'),
  title: text('title').notNull(),
  blurb: text('blurb'),
  difficulty: text('difficulty'),
  premium_only: boolean('premium_only').default(false).notNull(),
  s3_path: text('s3_path'),
  hash: text('hash'),
  base_xp: integer('base_xp').default(1).notNull()
});

// Types for CRUD operations
export type Topic = InferSelectModel<typeof topics>;
export type TopicInsert = InferInsertModel<typeof topics>;
export type TopicPartial = Partial<TopicInsert>;

export type Track = InferSelectModel<typeof tracks>;
export type TrackInsert = InferInsertModel<typeof tracks>;
export type TrackPartial = Partial<TrackInsert>;

export type Module = InferSelectModel<typeof modules>;
export type ModuleInsert = InferInsertModel<typeof modules>;
export type ModulePartial = Partial<ModuleInsert>;

export type Item = InferSelectModel<typeof items>;
export type ItemInsert = InferInsertModel<typeof items>;
export type ItemPartial = Partial<ItemInsert>;

// Optional: Create Zod schemas from Drizzle schemas if you need validation
// export const insertTopicSchema = createInsertSchema(topics);
// export const selectTopicSchema = createSelectSchema(topics);
//
// export const insertTrackSchema = createInsertSchema(tracks);
// export const selectTrackSchema = createSelectSchema(tracks);
//
// export const insertModuleSchema = createInsertSchema(modules);
// export const selectModuleSchema = createSelectSchema(modules);
//
// export const insertItemSchema = createInsertSchema(items);
// export const selectItemSchema = createSelectSchema(items);

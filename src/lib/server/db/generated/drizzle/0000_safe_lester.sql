-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE SCHEMA "users";
--> statement-breakpoint
CREATE SCHEMA "auth";
--> statement-breakpoint
CREATE SCHEMA "class";
--> statement-breakpoint
CREATE TYPE "auth"."audit_log_type" AS ENUM('signup', 'signin', 'signout', 'password_change', 'email_change', 'session_token');--> statement-breakpoint
CREATE TYPE "auth"."one_time_token_type" AS ENUM('email_confirmation', 'email_change', 'password_change', 'password_recovery');--> statement-breakpoint
CREATE TABLE "auth"."session_tokens" (
	"token" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"last_used_at" timestamp with time zone,
	CONSTRAINT "session_tokens_token_check" CHECK (char_length(token) > 0)
);
--> statement-breakpoint
CREATE TABLE "class"."tracks" (
	"topic_id" uuid NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"title" text NOT NULL,
	"blurb" text,
	"logo" text,
	"hash" text,
	"premium_only" boolean DEFAULT false,
	"coming_soon" boolean DEFAULT false,
	"position" integer,
	"difficulty" text,
	"tags" text[],
	CONSTRAINT "slug" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "auth"."audit_logs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"type" "auth"."audit_log_type" NOT NULL,
	"ip_address" "inet",
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "users"."stats" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"total_xp" bigint DEFAULT 0 NOT NULL,
	"completed_items" integer DEFAULT 0 NOT NULL,
	"longest_streak" integer DEFAULT 0 NOT NULL,
	"last_active_at" timestamp with time zone,
	"current_streak" integer DEFAULT 0 NOT NULL,
	"last_active_date" date DEFAULT CURRENT_DATE NOT NULL
);
--> statement-breakpoint
CREATE TABLE "class"."topics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"title" text NOT NULL,
	"blurb" text,
	"logo" text,
	"hash" text
);
--> statement-breakpoint
CREATE TABLE "auth"."users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar(254) NOT NULL,
	"username" varchar(30) NOT NULL,
	"role" varchar(255) DEFAULT 'user' NOT NULL,
	"encrypted_password" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"email_verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"premium_active" boolean DEFAULT false NOT NULL,
	"polar_last_synced_at" timestamp with time zone,
	"polar_customer_id" uuid,
	"polar_subscription_ids" uuid[],
	CONSTRAINT "users_email_key" UNIQUE("email"),
	CONSTRAINT "users_username_key" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "class"."modules" (
	"track_id" uuid NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"hash" text,
	"title" text NOT NULL,
	"position" integer,
	"premium_only" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "class"."items" (
	"module_id" uuid NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"hash" text,
	"type" text,
	"position" integer,
	"title" text NOT NULL,
	"blurb" text,
	"difficulty" text,
	"premium_only" boolean DEFAULT false,
	"base_xp" integer DEFAULT 1,
	"s3_path" text
);
--> statement-breakpoint
CREATE TABLE "users"."submission" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"status" text DEFAULT 'wait' NOT NULL,
	"xp_reward" integer DEFAULT 0 NOT NULL,
	"attempts" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb,
	"data" jsonb,
	"results" jsonb,
	CONSTRAINT "submission_item_id_user_id_key" UNIQUE("user_id","item_id")
);
--> statement-breakpoint
CREATE TABLE "users"."xp_events" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"xp_amount" integer NOT NULL,
	"source_type" varchar(50) NOT NULL,
	"source_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users"."daily_stats" (
	"user_id" uuid NOT NULL,
	"date" date DEFAULT CURRENT_DATE NOT NULL,
	"xp_earned" bigint DEFAULT 0 NOT NULL,
	"items_completed" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "daily_stats_pkey" PRIMARY KEY("user_id","date")
);
--> statement-breakpoint
CREATE TABLE "auth"."one_time_tokens" (
	"user_id" uuid NOT NULL,
	"type" "auth"."one_time_token_type" NOT NULL,
	"token" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"metadata" jsonb,
	CONSTRAINT "one_time_tokens_pkey" PRIMARY KEY("user_id","type"),
	CONSTRAINT "one_time_tokens_token_check" CHECK (char_length(token) > 0)
);
--> statement-breakpoint
CREATE TABLE "users"."track" (
	"user_id" uuid NOT NULL,
	"track_id" uuid NOT NULL,
	"completed_items" integer DEFAULT 0 NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_activity_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	CONSTRAINT "track_pkey" PRIMARY KEY("user_id","track_id")
);
--> statement-breakpoint
ALTER TABLE "auth"."session_tokens" ADD CONSTRAINT "session_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class"."tracks" ADD CONSTRAINT "tracks_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "class"."topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users"."stats" ADD CONSTRAINT "stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class"."modules" ADD CONSTRAINT "modules_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "class"."tracks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class"."items" ADD CONSTRAINT "items_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "class"."modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users"."submission" ADD CONSTRAINT "submission_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users"."submission" ADD CONSTRAINT "submission_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "class"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users"."xp_events" ADD CONSTRAINT "xp_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users"."daily_stats" ADD CONSTRAINT "daily_stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."one_time_tokens" ADD CONSTRAINT "one_time_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users"."track" ADD CONSTRAINT "track_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users"."track" ADD CONSTRAINT "track_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "class"."tracks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_audit_logs_user_time" ON "auth"."audit_logs" USING btree ("user_id" timestamptz_ops,"created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "users_active_email_lower_idx" ON "auth"."users" USING btree (lower((email)::text) text_ops);--> statement-breakpoint
CREATE INDEX "users_active_username_lower_idx" ON "auth"."users" USING btree (lower((username)::text) text_ops);
*/
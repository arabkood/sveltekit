ALTER TABLE "auth"."audit_logs" RENAME CONSTRAINT "audit_logs_user_id_fkey" TO "audit_logs_user_id_users_id_fkey";--> statement-breakpoint
ALTER TABLE "auth"."one_time_tokens" RENAME CONSTRAINT "one_time_tokens_user_id_fkey" TO "one_time_tokens_user_id_users_id_fkey";--> statement-breakpoint
ALTER TABLE "auth"."session_tokens" RENAME CONSTRAINT "session_tokens_user_id_fkey" TO "session_tokens_user_id_users_id_fkey";--> statement-breakpoint
ALTER TABLE "auth"."user_subscriptions" RENAME CONSTRAINT "user_subscriptions_user_id_fkey" TO "user_subscriptions_user_id_users_id_fkey";--> statement-breakpoint
ALTER TABLE "class"."items" RENAME CONSTRAINT "items_module_id_fkey" TO "items_module_id_modules_id_fkey";--> statement-breakpoint
ALTER TABLE "class"."modules" RENAME CONSTRAINT "modules_track_id_fkey" TO "modules_track_id_tracks_id_fkey";--> statement-breakpoint
ALTER TABLE "class"."tracks" RENAME CONSTRAINT "tracks_topic_id_fkey" TO "tracks_topic_id_topics_id_fkey";--> statement-breakpoint
ALTER TABLE "users"."daily_stats" RENAME CONSTRAINT "daily_stats_user_id_fkey" TO "daily_stats_user_id_users_id_fkey";--> statement-breakpoint
ALTER TABLE "users"."stats" RENAME CONSTRAINT "stats_user_id_fkey" TO "stats_user_id_users_id_fkey";--> statement-breakpoint
ALTER TABLE "users"."submission" RENAME CONSTRAINT "submission_user_id_fkey" TO "submission_user_id_users_id_fkey";--> statement-breakpoint
ALTER TABLE "users"."submission" RENAME CONSTRAINT "submission_item_id_fkey" TO "submission_item_id_items_id_fkey";--> statement-breakpoint
ALTER TABLE "users"."track" RENAME CONSTRAINT "track_user_id_fkey" TO "track_user_id_users_id_fkey";--> statement-breakpoint
ALTER TABLE "users"."track" RENAME CONSTRAINT "track_track_id_fkey" TO "track_track_id_tracks_id_fkey";--> statement-breakpoint
ALTER TABLE "users"."xp_events" RENAME CONSTRAINT "xp_events_user_id_fkey" TO "xp_events_user_id_users_id_fkey";

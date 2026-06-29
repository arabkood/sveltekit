ALTER TABLE "auth"."users" DROP CONSTRAINT "users_email_key";--> statement-breakpoint
ALTER TABLE "auth"."users" DROP CONSTRAINT "users_username_key";--> statement-breakpoint
DROP INDEX "auth"."users_active_email_lower_idx";--> statement-breakpoint
DROP INDEX "auth"."users_active_username_lower_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "users_active_username_lower_idx" ON "auth"."users" (lower("username"));
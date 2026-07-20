ALTER TYPE "public"."newsletter_audience" ADD VALUE 'category';--> statement-breakpoint
ALTER TYPE "public"."newsletter_audience" ADD VALUE 'sponsors';--> statement-breakpoint
ALTER TABLE "newsletters" ADD COLUMN "audience_category" "member_category";--> statement-breakpoint
ALTER TABLE "newsletters" ADD COLUMN "audience_member_ids" text;
ALTER TABLE "events" ADD COLUMN "notified_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "notified_count" integer DEFAULT 0 NOT NULL;
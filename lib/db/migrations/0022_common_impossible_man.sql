ALTER TYPE "public"."event_kind" ADD VALUE 'kindertraining';--> statement-breakpoint
ALTER TYPE "public"."event_kind" ADD VALUE 'sommercamp';--> statement-breakpoint
ALTER TYPE "public"."event_kind" ADD VALUE 'trainingslager';--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "for_kids" boolean DEFAULT false NOT NULL;
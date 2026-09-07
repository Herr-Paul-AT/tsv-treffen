ALTER TABLE "event_registrations" ADD COLUMN "street" text;--> statement-breakpoint
ALTER TABLE "event_registrations" ADD COLUMN "postal_code" text;--> statement-breakpoint
ALTER TABLE "event_registrations" ADD COLUMN "city" text;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "clothing_size" text;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "privacy_consent_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "photo_consent" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "photo_consent_homepage" boolean DEFAULT false NOT NULL;
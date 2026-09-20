ALTER TABLE "event_registrations" ADD COLUMN "birthdate" date;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "price_cents" integer;--> statement-breakpoint
ALTER TABLE "membership_requests" ADD COLUMN "birthdate" date;
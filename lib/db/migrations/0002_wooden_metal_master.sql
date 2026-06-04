ALTER TABLE "members" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "street" text;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "postal_code" text;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "city" text;
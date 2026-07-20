CREATE TYPE "public"."member_category" AS ENUM('kinder', 'jugend', 'vollmitglied', 'std_abo', 'unterstuetzend');--> statement-breakpoint
CREATE TYPE "public"."membership_request_status" AS ENUM('new', 'handled', 'rejected');--> statement-breakpoint
CREATE TABLE "membership_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"street" text NOT NULL,
	"postal_code" text NOT NULL,
	"city" text NOT NULL,
	"category" "member_category",
	"plan_slug" text,
	"plan_name" text,
	"is_sponsor" boolean DEFAULT false NOT NULL,
	"sponsor_note" text,
	"message" text,
	"status" "membership_request_status" DEFAULT 'new' NOT NULL,
	"created_member_id" uuid,
	"handled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "category" "member_category";--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "is_sponsor" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "sponsor_note" text;--> statement-breakpoint
ALTER TABLE "membership_plans" ADD COLUMN "category" "member_category";--> statement-breakpoint
ALTER TABLE "membership_requests" ADD CONSTRAINT "membership_requests_created_member_id_members_id_fk" FOREIGN KEY ("created_member_id") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;
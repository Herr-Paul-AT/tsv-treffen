CREATE TYPE "public"."document_category" AS ENUM('statuten', 'beitraege', 'protokoll', 'spielregeln', 'formular', 'sonstiges');--> statement-breakpoint
CREATE TYPE "public"."newsletter_audience" AS ENUM('all', 'active', 'probe', 'team', 'custom');--> statement-breakpoint
CREATE TYPE "public"."newsletter_status" AS ENUM('draft', 'queued', 'sent', 'failed');--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" "document_category" DEFAULT 'sonstiges' NOT NULL,
	"file_url" text NOT NULL,
	"file_type" text DEFAULT 'application/pdf' NOT NULL,
	"file_size" integer,
	"uploaded_by" uuid,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"pinned" boolean DEFAULT false NOT NULL,
	"valid_from" date,
	"valid_until" date
);
--> statement-breakpoint
CREATE TABLE "dues_invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"member_id" uuid NOT NULL,
	"dues_period_id" uuid NOT NULL,
	"amount_cents" integer NOT NULL,
	"paid_cents" integer DEFAULT 0 NOT NULL,
	"status" "payment_status" DEFAULT 'open' NOT NULL,
	"invoice_number" text,
	"issued_at" timestamp with time zone DEFAULT now() NOT NULL,
	"due_date" date NOT NULL,
	"paid_at" timestamp with time zone,
	"reminded_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "dues_periods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"year" integer NOT NULL,
	"category" text NOT NULL,
	"amount_cents" integer NOT NULL,
	"due_date" date NOT NULL,
	"active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "newsletters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subject" text NOT NULL,
	"body" text NOT NULL,
	"audience" "newsletter_audience" DEFAULT 'active' NOT NULL,
	"audience_team_id" uuid,
	"status" "newsletter_status" DEFAULT 'draft' NOT NULL,
	"author_id" uuid,
	"sent_at" timestamp with time zone,
	"recipient_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploaded_by_members_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dues_invoices" ADD CONSTRAINT "dues_invoices_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dues_invoices" ADD CONSTRAINT "dues_invoices_dues_period_id_dues_periods_id_fk" FOREIGN KEY ("dues_period_id") REFERENCES "public"."dues_periods"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "newsletters" ADD CONSTRAINT "newsletters_audience_team_id_teams_id_fk" FOREIGN KEY ("audience_team_id") REFERENCES "public"."teams"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "newsletters" ADD CONSTRAINT "newsletters_author_id_members_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;
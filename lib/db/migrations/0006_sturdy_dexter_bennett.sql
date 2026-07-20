CREATE TABLE "court_program" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"weekday" text NOT NULL,
	"weekday_order" integer DEFAULT 0 NOT NULL,
	"time" text NOT NULL,
	"title" text NOT NULL,
	"trainer" text,
	"court" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

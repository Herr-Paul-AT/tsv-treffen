CREATE TYPE "public"."news_visibility" AS ENUM('internal', 'public');--> statement-breakpoint
CREATE TABLE "news_reads" (
	"news_id" uuid NOT NULL,
	"member_id" uuid NOT NULL,
	"read_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "news_reads_news_id_member_id_pk" PRIMARY KEY("news_id","member_id")
);
--> statement-breakpoint
ALTER TABLE "news" ADD COLUMN "visibility" "news_visibility" DEFAULT 'public' NOT NULL;--> statement-breakpoint
ALTER TABLE "news_reads" ADD CONSTRAINT "news_reads_news_id_news_id_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news_reads" ADD CONSTRAINT "news_reads_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;
CREATE TYPE "public"."broll_category" AS ENUM('desk_setup', 'coding_terminal', 'creative_flow');--> statement-breakpoint
CREATE TYPE "public"."cta_goal" AS ENUM('save_bookmark', 'dm_lead_gen', 'engagement_share');--> statement-breakpoint
CREATE TYPE "public"."favorite_type" AS ENUM('idea', 'hook', 'cta', 'broll');--> statement-breakpoint
CREATE TYPE "public"."formula_code" AS ENUM('aida', '4p', 'acca', 'pas', 'teardown', 'playbook', 'bab', 'heros_journey');--> statement-breakpoint
CREATE TYPE "public"."hook_category" AS ENUM('kesalahan_fatal', 'kontroversial', 'studi_kasus');--> statement-breakpoint
CREATE TYPE "public"."pillar" AS ENUM('edukasi', 'inspirasi', 'promosi', 'bts_personal');--> statement-breakpoint
CREATE TYPE "public"."platform" AS ENUM('instagram_reels', 'tiktok', 'facebook_reels', 'facebook_post', 'instagram_carousel', 'x_thread');--> statement-breakpoint
CREATE TYPE "public"."sales_style" AS ENUM('hard_selling', 'soft_selling', 'storyteller');--> statement-breakpoint
CREATE TYPE "public"."script_status" AS ENUM('draft', 'final', 'arsip');--> statement-breakpoint
CREATE TABLE "broll_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" "broll_category" NOT NULL,
	"title" varchar(160) NOT NULL,
	"description" text,
	"aspect_ratio" varchar(8) DEFAULT '9:16' NOT NULL,
	"bunny_video_id" varchar(64) NOT NULL,
	"thumbnail_url" text,
	"duration_sec" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ctas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"goal" "cta_goal" NOT NULL,
	"sales_style" "sales_style",
	"text" varchar(240) NOT NULL,
	"keyword" varchar(32),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "formulas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" "formula_code" NOT NULL,
	"name" varchar(80) NOT NULL,
	"objective" varchar(240) NOT NULL,
	"steps" jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "formulas_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "hooks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" "hook_category" NOT NULL,
	"template" text NOT NULL,
	"variables" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"interrupt_note" varchar(200) NOT NULL,
	"example_filled" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ideas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(160) NOT NULL,
	"pillar" "pillar" NOT NULL,
	"formats" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"target_audience" varchar(200),
	"technical_note" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "library_favorites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"item_type" "favorite_type" NOT NULL,
	"item_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sales_styles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" "sales_style" NOT NULL,
	"name" varchar(80) NOT NULL,
	"structure" jsonb NOT NULL,
	"cta_tone" varchar(200) NOT NULL,
	"default_formula" "formula_code" NOT NULL,
	CONSTRAINT "sales_styles_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "scripts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(160) NOT NULL,
	"platform" "platform" NOT NULL,
	"pillar" "pillar" NOT NULL,
	"idea_id" uuid,
	"target_audience" varchar(200),
	"key_message" text,
	"sales_style" "sales_style" NOT NULL,
	"formula_id" uuid,
	"hook_id" uuid,
	"hook_text" text,
	"cta_id" uuid,
	"cta_text" text,
	"sections" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"estimated_duration_sec" integer DEFAULT 0 NOT NULL,
	"status" "script_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" varchar(64) NOT NULL,
	"username" varchar(32) NOT NULL,
	"display_name" varchar(80),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "library_favorites" ADD CONSTRAINT "library_favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scripts" ADD CONSTRAINT "scripts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scripts" ADD CONSTRAINT "scripts_idea_id_ideas_id_fk" FOREIGN KEY ("idea_id") REFERENCES "public"."ideas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scripts" ADD CONSTRAINT "scripts_formula_id_formulas_id_fk" FOREIGN KEY ("formula_id") REFERENCES "public"."formulas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scripts" ADD CONSTRAINT "scripts_hook_id_hooks_id_fk" FOREIGN KEY ("hook_id") REFERENCES "public"."hooks"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scripts" ADD CONSTRAINT "scripts_cta_id_ctas_id_fk" FOREIGN KEY ("cta_id") REFERENCES "public"."ctas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "broll_category_idx" ON "broll_assets" USING btree ("category");--> statement-breakpoint
CREATE INDEX "ctas_goal_idx" ON "ctas" USING btree ("goal");--> statement-breakpoint
CREATE INDEX "hooks_category_idx" ON "hooks" USING btree ("category");--> statement-breakpoint
CREATE INDEX "ideas_pillar_idx" ON "ideas" USING btree ("pillar");--> statement-breakpoint
CREATE UNIQUE INDEX "favorites_unique_idx" ON "library_favorites" USING btree ("user_id","item_type","item_id");--> statement-breakpoint
CREATE INDEX "scripts_user_idx" ON "scripts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "scripts_user_status_idx" ON "scripts" USING btree ("user_id","status");
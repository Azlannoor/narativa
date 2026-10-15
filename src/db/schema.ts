import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ===== ENUM =====
export const platformEnum = pgEnum("platform", [
  "instagram_reels",
  "tiktok",
  "facebook_reels",
  "facebook_post",
  "instagram_carousel",
  "x_thread",
]);

export const pillarEnum = pgEnum("pillar", [
  "edukasi",
  "inspirasi",
  "promosi",
  "bts_personal",
]);

export const hookCategoryEnum = pgEnum("hook_category", [
  "kesalahan_fatal",
  "kontroversial",
  "studi_kasus",
]);

export const formulaCodeEnum = pgEnum("formula_code", [
  "aida",
  "4p",
  "acca",
  "pas",
  "teardown",
  "playbook",
  "bab",
  "heros_journey",
]);

export const salesStyleEnum = pgEnum("sales_style", [
  "hard_selling",
  "soft_selling",
  "storyteller",
]);

export const ctaGoalEnum = pgEnum("cta_goal", [
  "save_bookmark",
  "dm_lead_gen",
  "engagement_share",
]);

export const brollCategoryEnum = pgEnum("broll_category", [
  "desk_setup",
  "coding_terminal",
  "creative_flow",
]);

export const scriptStatusEnum = pgEnum("script_status", [
  "draft",
  "final",
  "arsip",
]);

export const favoriteTypeEnum = pgEnum("favorite_type", [
  "idea",
  "hook",
  "cta",
  "broll",
]);

// ===== TIPE JSON =====
export type ScriptSection = {
  id: string;
  key: string;        // contoh: "attention", "interest", "desire", "action"
  label: string;      // contoh: "Attention"
  content: string;    // maks. 600 karakter
  brollIds: string[]; // referensi ke broll_assets.id
  estimatedSec: number;
};

export type FormulaStep = {
  key: string;
  label: string;
  guide: string;
  example: string;
};

// ===== TABEL =====
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkId: varchar("clerk_id", { length: 64 }).notNull().unique(),
  username: varchar("username", { length: 32 }).notNull().unique(),
  displayName: varchar("display_name", { length: 80 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const ideas = pgTable(
  "ideas",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 160 }).notNull(),
    pillar: pillarEnum("pillar").notNull(),
    formats: jsonb("formats").$type<string[]>().notNull().default([]),
    targetAudience: varchar("target_audience", { length: 200 }),
    technicalNote: text("technical_note"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("ideas_pillar_idx").on(t.pillar)]
);

export const hooks = pgTable(
  "hooks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    category: hookCategoryEnum("category").notNull(),
    template: text("template").notNull(), // contoh: "Kamu masih {{kebiasaan}}?"
    variables: jsonb("variables").$type<string[]>().notNull().default([]),
    interruptNote: varchar("interrupt_note", { length: 200 }).notNull(), // interupsi 1-3 detik
    exampleFilled: text("example_filled"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("hooks_category_idx").on(t.category)]
);

export const formulas = pgTable("formulas", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: formulaCodeEnum("code").notNull().unique(),
  name: varchar("name", { length: 80 }).notNull(),
  objective: varchar("objective", { length: 240 }).notNull(),
  steps: jsonb("steps").$type<FormulaStep[]>().notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const salesStyles = pgTable("sales_styles", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: salesStyleEnum("code").notNull().unique(),
  name: varchar("name", { length: 80 }).notNull(),
  structure: jsonb("structure").$type<string[]>().notNull(),
  ctaTone: varchar("cta_tone", { length: 200 }).notNull(),
  defaultFormula: formulaCodeEnum("default_formula").notNull(),
});

export const ctas = pgTable(
  "ctas",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    goal: ctaGoalEnum("goal").notNull(),
    salesStyle: salesStyleEnum("sales_style"),
    text: varchar("text", { length: 240 }).notNull(),
    keyword: varchar("keyword", { length: 32 }), // wajib untuk dm_lead_gen
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("ctas_goal_idx").on(t.goal)]
);

export const brollAssets = pgTable(
  "broll_assets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    category: brollCategoryEnum("category").notNull(),
    title: varchar("title", { length: 160 }).notNull(),
    description: text("description"),
    aspectRatio: varchar("aspect_ratio", { length: 8 }).notNull().default("9:16"),
    bunnyVideoId: varchar("bunny_video_id", { length: 64 }).notNull(),
    thumbnailUrl: text("thumbnail_url"),
    durationSec: integer("duration_sec").notNull(),
    isActive: boolean("is_active").notNull().default(true),
  },
  (t) => [index("broll_category_idx").on(t.category)]
);

export const scripts = pgTable(
  "scripts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 160 }).notNull(),
    platform: platformEnum("platform").notNull(),
    pillar: pillarEnum("pillar").notNull(),
    ideaId: uuid("idea_id").references(() => ideas.id, { onDelete: "set null" }),
    targetAudience: varchar("target_audience", { length: 200 }),
    keyMessage: text("key_message"),
    salesStyle: salesStyleEnum("sales_style").notNull(),
    formulaId: uuid("formula_id").references(() => formulas.id, { onDelete: "set null" }),
    hookId: uuid("hook_id").references(() => hooks.id, { onDelete: "set null" }),
    hookText: text("hook_text"), // hasil akhir setelah variabel terisi
    ctaId: uuid("cta_id").references(() => ctas.id, { onDelete: "set null" }),
    ctaText: text("cta_text"), // salinan CTA agar tidak berubah saat library diperbarui
    sections: jsonb("sections").$type<ScriptSection[]>().notNull().default([]),
    estimatedDurationSec: integer("estimated_duration_sec").notNull().default(0),
    status: scriptStatusEnum("status").notNull().default("draft"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("scripts_user_idx").on(t.userId),
    index("scripts_user_status_idx").on(t.userId, t.status),
  ]
);

export const libraryFavorites = pgTable(
  "library_favorites",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    itemType: favoriteTypeEnum("item_type").notNull(),
    itemId: uuid("item_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("favorites_unique_idx").on(t.userId, t.itemType, t.itemId),
  ]
);

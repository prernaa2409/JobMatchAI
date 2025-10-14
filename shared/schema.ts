import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  provider: text("provider").default("email"),
  improvementsUsed: integer("improvements_used").default(0).notNull(),
  improvementsLimit: integer("improvements_limit").default(3).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const analyses = pgTable("analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  resumeText: text("resume_text").notNull(),
  overallScore: integer("overall_score").notNull(),
  contentScore: integer("content_score").notNull(),
  keywordScore: integer("keyword_score").notNull(),
  formatScore: integer("format_score").notNull(),
  experienceScore: integer("experience_score").notNull(),
  suggestions: jsonb("suggestions").notNull(),
  keywords: jsonb("keywords").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const revisions = pgTable("revisions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  analysisId: varchar("analysis_id").notNull(),
  userId: varchar("user_id").notNull(),
  improvedText: text("improved_text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

export const insertAnalysisSchema = createInsertSchema(analyses).omit({
  id: true,
  createdAt: true,
});

export const insertRevisionSchema = createInsertSchema(revisions).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Analysis = typeof analyses.$inferSelect;
export type Revision = typeof revisions.$inferSelect;

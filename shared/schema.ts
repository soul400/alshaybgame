import { pgTable, text, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Game category schema
export const gameCategories = pgTable("game_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  description: text("description").notNull(),
});

export const insertGameCategorySchema = createInsertSchema(gameCategories).omit({
  id: true,
});

// Game question schema
export const gameQuestions = pgTable("game_questions", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull(),
  clue1: text("clue1").notNull(),
  clue2: text("clue2").notNull(),
  answer: text("answer").notNull(),
  letterCount: integer("letter_count").notNull(),
});

export const insertGameQuestionSchema = createInsertSchema(gameQuestions).omit({
  id: true,
});

// Player schema
export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  score: integer("score").default(0).notNull(),
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
});

// Penalty schema
export const penalties = pgTable("penalties", {
  id: serial("id").primaryKey(),
  description: text("description").notNull(),
});

export const insertPenaltySchema = createInsertSchema(penalties).omit({
  id: true,
});

// Settings schema (for storing game configurations)
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
});

export const insertSettingSchema = createInsertSchema(settings).omit({
  id: true,
});

// Custom schemas for Excel import
export const excelRowSchema = z.object({
  category: z.string(),
  clue1: z.string(),
  clue2: z.string(),
  answer: z.string(),
  letterCount: z.number().or(z.string().transform(val => parseInt(val))),
});

export const excelDataSchema = z.array(excelRowSchema);

// Type definitions
export type GameCategory = typeof gameCategories.$inferSelect;
export type InsertGameCategory = typeof gameCategories.$inferInsert;

export type GameQuestion = typeof gameQuestions.$inferSelect;
export type InsertGameQuestion = typeof gameQuestions.$inferInsert;

export type Player = typeof players.$inferSelect;
export type InsertPlayer = typeof players.$inferInsert;

export type Penalty = typeof penalties.$inferSelect;
export type InsertPenalty = typeof penalties.$inferInsert;

export type Setting = typeof settings.$inferSelect;
export type InsertSetting = typeof settings.$inferInsert;

export type ExcelRow = z.infer<typeof excelRowSchema>;
export type ExcelData = z.infer<typeof excelDataSchema>;

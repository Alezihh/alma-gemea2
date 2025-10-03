import { z } from "zod";
import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// Database table definitions
export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  birthdate: varchar("birthdate", { length: 20 }),
  city: varchar("city", { length: 120 }),
  email: varchar("email", { length: 200 }),
  zodiac_sign: varchar("zodiac_sign", { length: 40 }),
  height: varchar("height", { length: 40 }),
  preferences: text("preferences"),
  tarot_cards: text("tarot_cards"),
  result_profile_id: serial("result_profile_id").notNull(),
  result_token: varchar("result_token", { length: 64 }).unique().notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

// Drizzle schemas
export const insertSubmissionSchema = createInsertSchema(submissions).omit({ 
  id: true, 
  created_at: true 
});

export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissions.$inferSelect;

// Soul mate submission schema for the form
export const soulMateSubmissionSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  birthdate: z.string().min(1, "Data de nascimento é obrigatória"),
  city: z.string().optional(),
  email: z.union([
    z.string().email("Email inválido"),
    z.literal("")
  ]).optional(),
  zodiacSign: z.string().optional(),
  height: z.string().optional(),
  preferences: z.string().optional(),
  tarotCards: z.array(z.number()).length(3, "Selecione exatamente 3 cartas").optional(),
});

export type SoulMateSubmission = z.infer<typeof soulMateSubmissionSchema>;

// Soul mate profile type based on the Flask backend
export interface SoulMateProfile {
  id: number;
  name: string;
  description: string;
  image_url: string;
}

// API response types
export interface SoulMateResult {
  token: string;
  profile: SoulMateProfile;
}

export interface SoulMateResultWithDate extends SoulMateResult {
  created_at: string;
}

// Keep existing user schema for compatibility
export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;

export interface User {
  id: string;
  username: string;
  password: string;
}

import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  rating: integer("rating").notNull(),
  review: text("review").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  submittedAt: timestamp("submitted_at").defaultNow(),
});

export const insertReviewSchema = createInsertSchema(reviews).pick({
  name: true,
  email: true,
  phone: true,
  rating: true,
  review: true,
}).extend({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  review: z.string().min(10, "Review must be at least 10 characters").max(500, "Review must be at most 500 characters"),
});

export const updateReviewStatusSchema = z.object({
  status: z.enum(["approved", "rejected"]),
});

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;
export type UpdateReviewStatus = z.infer<typeof updateReviewStatusSchema>;

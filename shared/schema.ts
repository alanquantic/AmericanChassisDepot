import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Condition schema (New or Used)
export const conditions = pgTable("conditions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // "New" or "Used"
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const insertConditionSchema = createInsertSchema(conditions).omit({
  id: true,
});

// Chassis schema
export const chassisModels = pgTable("chassis_models", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  conditionId: integer("condition_id").notNull(), // New or Used
  manufacturer: text("manufacturer").notNull(), // Bull, Cheetah, Pratt, Stoughton, etc.
  size: text("size").notNull(), // 20ft, 40ft, 45ft, 53ft
  dutyType: text("duty_type").notNull(), // Standard, Heavy, Extra Heavy
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  features: text("features").array(),
  specifications: text("specifications").array(),
});

export const insertChassisModelSchema = createInsertSchema(chassisModels).omit({
  id: true,
});

// Contact message schema
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  phone: text("phone"),
  units: text("units"),
  interest: text("interest"),
  message: text("message").notNull(),
  sourceUrl: text("source_url"),
  createdAt: text("created_at").notNull(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
});

// Types
export type Condition = typeof conditions.$inferSelect;
export type InsertCondition = z.infer<typeof insertConditionSchema>;

export type ChassisModel = typeof chassisModels.$inferSelect;
export type InsertChassisModel = z.infer<typeof insertChassisModelSchema>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

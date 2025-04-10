import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Brand schema
export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const insertBrandSchema = createInsertSchema(brands).omit({
  id: true,
});

// Chassis schema
export const chassisModels = pgTable("chassis_models", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  brandId: integer("brand_id").notNull(),
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
  phone: text("phone"),
  interest: text("interest"),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
});

// Types
export type Brand = typeof brands.$inferSelect;
export type InsertBrand = z.infer<typeof insertBrandSchema>;

export type ChassisModel = typeof chassisModels.$inferSelect;
export type InsertChassisModel = z.infer<typeof insertChassisModelSchema>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

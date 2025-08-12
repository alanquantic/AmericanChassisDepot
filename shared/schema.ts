import { pgTable, text, serial, integer, boolean, foreignKey } from "drizzle-orm/pg-core";
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
  manufacturer: text("manufacturer").notNull(), // AXN, SAF, JOST, etc.
  size: text("size").notNull(), // 20ft, 40ft, 45ft, 53ft, 20-40ft, etc.
  axleConfig: text("axle_config").notNull(), // Tandem, Triaxle, etc.
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(), // Main product image
  additionalImages: text("additional_images").array(), // Additional product photos
  
  // Technical specifications - structured data
  overallLength: text("overall_length"),
  overallWidth: text("overall_width"),
  overallHeight: text("overall_height"),
  fifthWheelHeight: text("fifth_wheel_height"),
  rearDeckHeight: text("rear_deck_height"),
  kingpinLocation: text("kingpin_location"),
  landingGearLocation: text("landing_gear_location"),
  axleSpread: text("axle_spread"),
  tareWeight: text("tare_weight"),
  payload: text("payload"),
  gvwr: text("gvwr"),
  
  // Component details - stored as JSON-like text arrays for flexibility
  frameComponents: text("frame_components").array(), // Main beam, cross members, etc.
  suspensionDetails: text("suspension_details").array(),
  brakeSystemDetails: text("brake_system_details").array(),
  electricalDetails: text("electrical_details").array(),
  additionalEquipment: text("additional_equipment").array(),
  
  // Multilingual support
  nameEs: text("name_es"), // Spanish name
  descriptionEs: text("description_es"), // Spanish description
  
  // SEO and organization
  featured: boolean("featured").default(false), // For homepage showcase
  sortOrder: integer("sort_order").default(0), // Manual ordering
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

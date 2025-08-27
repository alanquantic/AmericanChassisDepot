import {
  conditions,
  chassisModels, 
  contactMessages,
  type Condition, 
  type InsertCondition, 
  type ChassisModel, 
  type InsertChassisModel,
  type ContactMessage,
  type InsertContactMessage
} from "../shared/schema.js";
import { db } from "./db.js";
import { eq, ilike, and, or, inArray } from "drizzle-orm";
import { ALLOWED_PRODUCT_SLUGS } from "./allowed-products.js";

// Blocklist de imágenes que no deben mostrarse en ningún producto
const BLOCKED_IMAGE_SUBSTRINGS = [
  "photo-1580674684081-7617fbf3d745",
  "20_SL_Tandem_4.jpg",
  "20_40_Extendable_Tandem_2.jpg",
  "40_Gooseneck_1.jpg",
  "40_Gooseneck_2.jpg",
  "40_45_Extendable_5.jpg",
];

function sanitizeModelImages<T extends { imageUrl: string; additionalImages: string[] | null }>(model: T): T {
  const isBlocked = (url: string | undefined | null) =>
    !!url && BLOCKED_IMAGE_SUBSTRINGS.some((s) => url.includes(s));

  const cleanedAdditional = Array.isArray(model.additionalImages)
    ? model.additionalImages.filter((u) => !isBlocked(u))
    : model.additionalImages;

  let cleanedImageUrl = model.imageUrl;
  if (isBlocked(cleanedImageUrl)) {
    // Si la principal está bloqueada, usar la primera adicional válida o un placeholder
    const fallback = Array.isArray(cleanedAdditional) && cleanedAdditional.length > 0
      ? cleanedAdditional[0]
      : "/assets/og-image.jpg";
    cleanedImageUrl = fallback;
  }

  return { ...model, imageUrl: cleanedImageUrl, additionalImages: cleanedAdditional } as T;
}

// Storage interface
export interface IStorage {
  // Condition operations (New/Used)
  getAllConditions(): Promise<Condition[]>;
  getConditionBySlug(slug: string): Promise<Condition | undefined>;
  createCondition(condition: InsertCondition): Promise<Condition>;
  
  // Chassis model operations
  getAllChassisModels(): Promise<ChassisModel[]>;
  getChassisModelsByCondition(conditionId: number): Promise<ChassisModel[]>;
  getChassisModelBySlug(slug: string): Promise<ChassisModel | undefined>;
  createChassisModel(model: InsertChassisModel): Promise<ChassisModel>;
  filterChassisModels(conditionSlug?: string, size?: string, manufacturer?: string): Promise<ChassisModel[]>;
  
  // Contact message operations
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
}

// Database storage implementation using PostgreSQL
export class DatabaseStorage implements IStorage {
  // Condition operations
  async getAllConditions(): Promise<Condition[]> {
    return await db.select().from(conditions);
  }

  async getConditionBySlug(slug: string): Promise<Condition | undefined> {
    const [condition] = await db.select()
      .from(conditions)
      .where(eq(conditions.slug, slug));
    return condition;
  }

  async createCondition(insertCondition: InsertCondition): Promise<Condition> {
    const [condition] = await db.insert(conditions)
      .values(insertCondition)
      .returning();
    return condition;
  }

  // Chassis model operations
  async getAllChassisModels(): Promise<ChassisModel[]> {
    console.log("Getting chassis models directly from data file...");
    
    // Import data directly from file
    const { newChassisData, usedChassisData } = await import('./chassis-data');
    const allData = [...newChassisData, ...usedChassisData];
    
    console.log(`Total products in data file: ${allData.length}`);
    
    // Filter to only allowed products
    const filteredData = allData.filter(item => ALLOWED_PRODUCT_SLUGS.includes(item.slug));
    console.log(`Filtered to ${filteredData.length} allowed products`);
    
    // Return the data directly without complex type conversion
    console.log(`Returning ${filteredData.length} models`);
    return filteredData as any; // Temporary fix to bypass type issues
  }

  async getChassisModelsByCondition(conditionId: number): Promise<ChassisModel[]> {
    const rows = await db.select()
      .from(chassisModels)
      .where(and(
        eq(chassisModels.conditionId, conditionId),
        inArray(chassisModels.slug, ALLOWED_PRODUCT_SLUGS)
      ));
    return rows.map(sanitizeModelImages);
  }

  async getChassisModelBySlug(slug: string): Promise<ChassisModel | undefined> {
    // Solo permitir acceso a productos en la lista permitida
    if (!ALLOWED_PRODUCT_SLUGS.includes(slug)) {
      return undefined;
    }
    
    const [model] = await db.select()
      .from(chassisModels)
      .where(eq(chassisModels.slug, slug));
    return model ? sanitizeModelImages(model) : model;
  }

  async createChassisModel(insertModel: InsertChassisModel): Promise<ChassisModel> {
    const [model] = await db.insert(chassisModels)
      .values(insertModel)
      .returning();
    return model;
  }

  async filterChassisModels(conditionSlug?: string, size?: string, manufacturer?: string, characteristic?: string): Promise<ChassisModel[]> {
    try {
      console.log("Filtering chassis models with filters:", { conditionSlug, size, manufacturer, characteristic });
      
      // Get models directly from data file
      const allModels = await this.getAllChassisModels();
      console.log(`Total models from data file: ${allModels.length}`);
      
      // Then filter them in memory
      let filteredModels = [...allModels];
      
      if (conditionSlug && conditionSlug !== 'all') {
        if (conditionSlug === 'english-only') {
          // Excluir catálogo español para EN
          filteredModels = filteredModels.filter(model => model.conditionId !== 5);
        } else if (conditionSlug === 'chassis-nuevos-espanol') {
          // Catálogo ES por condición explícita (slug documentado en README)
          const condition = await this.getConditionBySlug('chassis-nuevos-espanol');
          if (condition) {
            filteredModels = filteredModels.filter(model => model.conditionId === condition.id);
          } else {
            // Fallback: si no existe condición, filtrar por convención de slug '-esp'
            filteredModels = filteredModels.filter(model => model.slug.endsWith('-esp'));
          }
        } else {
          const condition = await this.getConditionBySlug(conditionSlug);
          if (condition) {
            filteredModels = filteredModels.filter(model => model.conditionId === condition.id);
          }
        }
      }
      
      if (size && size !== 'all') {
        filteredModels = filteredModels.filter(model => {
          // Handle specific size filters that may need range matching
          if (size === '40-45ft') {
            return model.size === '40-45ft' || model.size.includes('40') && model.size.includes('45');
          } else if (size === '20-40ft') {
            return model.size === '20-40ft' || (model.size.includes('20') && model.size.includes('40') && !model.size.includes('45'));
          } else if (size === '20-40-45ft') {
            return model.size === '20-40-45ft' || model.size.includes('20-40-45');
          } else if (size === '33ft') {
            return model.size.includes('33');
          } else {
            return model.size === size;
          }
        });
      }
      
      if (manufacturer && manufacturer !== 'all') {
        const lowerCaseManufacturer = manufacturer.toLowerCase();
        filteredModels = filteredModels.filter(model => 
          model.manufacturer.toLowerCase().includes(lowerCaseManufacturer)
        );
      }
      
      if (characteristic && characteristic !== 'all') {
        filteredModels = filteredModels.filter(model => {
          const lowerName = model.name.toLowerCase();
          const lowerAxleConfig = model.axleConfig.toLowerCase();
          
          switch (characteristic) {
            case 'tandem':
              // Only match tandem if it's NOT a gooseneck
              return lowerAxleConfig.includes('tandem') && !lowerName.includes('gooseneck') && !lowerName.includes('gn ');
            case 'triaxle':
              return lowerAxleConfig.includes('triaxle') || lowerAxleConfig.includes('tri-axle') || lowerName.includes('triaxle') || lowerName.includes('tri-axle') || lowerName.includes('tri axle');
            case 'gooseneck':
              return lowerName.includes('gooseneck') || lowerName.includes('gn ');
            case 'extendable':
              return lowerName.includes('extendable') || lowerName.includes('extend');
            default:
              return true;
          }
        });
      }
      
      console.log(`Final filtered result: ${filteredModels.length} models`);
      return filteredModels;
    } catch (error) {
      console.error('Error in filterChassisModels:', error);
      return [];
    }
  }

  // Contact message operations
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const [message] = await db.insert(contactMessages)
      .values(insertMessage)
      .returning();
    return message;
  }

  // Initialize database with seed data if needed
  async initializeDatabase(): Promise<void> {
    console.log("Starting database initialization...");
    
    // FORCE RESEED - Always clear and reseed for now
    console.log("FORCING COMPLETE RESEED...");
    await this.forceReseed();
    
    console.log("Database initialization completed.");
  }

  // Seed initial data
  private async seedData() {
    // Import real chassis data
    const { newChassisData, usedChassisData } = await import('./chassis-data');
    
    // Get or create conditions
    let newCondition = await this.getConditionBySlug("new-chassis");
    if (!newCondition) {
      newCondition = await this.createCondition({
        name: "New Chassis",
        slug: "new-chassis",
        description: "Brand new chassis with full warranty and the latest features and technology.",
        imageUrl: "/assets/new-chassis.jpg"
      });
    }
    
    let usedCondition = await this.getConditionBySlug("used-chassis");
    if (!usedCondition) {
      usedCondition = await this.createCondition({
        name: "Used Chassis",
        slug: "used-chassis",
        description: "Quality pre-owned chassis that have been thoroughly inspected and refurbished as needed.",
        imageUrl: "/assets/used-chassis.jpg"
      });
    }
    
    // Seed real chassis data
    console.log(`Seeding ${newChassisData.length} new chassis models...`);
    for (const chassisData of newChassisData) {
      await this.createChassisModel({
        ...chassisData,
        conditionId: newCondition.id
      });
    }
    
    console.log(`Seeding ${usedChassisData.length} used chassis models...`);
    for (const chassisData of usedChassisData) {
      await this.createChassisModel({
        ...chassisData,
        conditionId: usedCondition.id
      });
    }
    
    console.log(`Total products seeded: ${newChassisData.length + usedChassisData.length}`);
  }

  // Reseed data (clear and re-add all products)
  private async reseedData() {
    console.log("Reseeding database with updated product data...");
    
    // Clear existing chassis models
    await db.delete(chassisModels);
    console.log("Cleared existing chassis models");
    
    // Reseed with current data
    await this.seedData();
    console.log("Reseeding completed");
  }

  // Force complete reseed (clear everything and start fresh)
  private async forceReseed() {
    console.log("FORCE RESEED: Clearing all data and starting fresh...");
    
    try {
      // Clear all chassis models
      await db.delete(chassisModels);
      console.log("Cleared all chassis models");
      
      // Clear all conditions
      await db.delete(conditions);
      console.log("Cleared all conditions");
      
      // Reseed everything from scratch
      await this.seedData();
      console.log("FORCE RESEED completed successfully");
      
      // Verify the data was seeded correctly
      const finalModels = await this.getAllChassisModels();
      console.log(`Final verification: ${finalModels.length} models in database`);
      
    } catch (error) {
      console.error("Error during force reseed:", error);
      throw error;
    }
  }
}

// Create storage instance and initialize
const storage = new DatabaseStorage();
storage.initializeDatabase().catch(err => {
  console.error("Failed to initialize database:", err);
});

export { storage };

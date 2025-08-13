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
} from "@shared/schema";
import { db } from "./db";
import { eq, ilike, and, or } from "drizzle-orm";

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
    return await db.select().from(chassisModels);
  }

  async getChassisModelsByCondition(conditionId: number): Promise<ChassisModel[]> {
    return await db.select()
      .from(chassisModels)
      .where(eq(chassisModels.conditionId, conditionId));
  }

  async getChassisModelBySlug(slug: string): Promise<ChassisModel | undefined> {
    const [model] = await db.select()
      .from(chassisModels)
      .where(eq(chassisModels.slug, slug));
    return model;
  }

  async createChassisModel(insertModel: InsertChassisModel): Promise<ChassisModel> {
    const [model] = await db.insert(chassisModels)
      .values(insertModel)
      .returning();
    return model;
  }

  async filterChassisModels(conditionSlug?: string, size?: string, manufacturer?: string, characteristic?: string): Promise<ChassisModel[]> {
    try {
      // First get all chassis models
      const allModels = await db.select().from(chassisModels).execute();
      
      // Ensure allModels is an array
      if (!Array.isArray(allModels)) {
        console.error("Database didn't return an array for chassisModels:", allModels);
        return [];
      }
      
      // Then filter them in memory
      let filteredModels = [...allModels];
      
      if (conditionSlug && conditionSlug !== 'all') {
        const condition = await this.getConditionBySlug(conditionSlug);
        if (condition) {
          filteredModels = filteredModels.filter(model => model.conditionId === condition.id);
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
    const existingConditions = await this.getAllConditions();
    
    if (existingConditions.length === 0) {
      console.log("Initializing database with seed data...");
      await this.seedData();
    }
  }

  // Seed initial data
  private async seedData() {
    // Import real chassis data
    const { newChassisData, usedChassisData } = await import('../data/chassis-data');
    
    // Seed conditions
    const newCondition = await this.createCondition({
      name: "New Chassis",
      slug: "new-chassis",
      description: "Brand new chassis with full warranty and the latest features and technology.",
      imageUrl: "/assets/new-chassis.jpg"
    });
    
    const usedCondition = await this.createCondition({
      name: "Used Chassis",
      slug: "used-chassis",
      description: "Quality pre-owned chassis that have been thoroughly inspected and refurbished as needed.",
      imageUrl: "/assets/used-chassis.jpg"
    });
    
    // Seed real chassis data
    console.log("Seeding new chassis models...");
    for (const chassisData of newChassisData) {
      await this.createChassisModel({
        ...chassisData,
        conditionId: newCondition.id
      });
    }
    
    console.log("Seeding used chassis models...");
    for (const chassisData of usedChassisData) {
      await this.createChassisModel({
        ...chassisData,
        conditionId: usedCondition.id
      });
    }
  }
}

// Create storage instance and initialize
const storage = new DatabaseStorage();
storage.initializeDatabase().catch(err => {
  console.error("Failed to initialize database:", err);
});

export { storage };

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

// Productos directamente en el código para evitar problemas de importación
const PRODUCT_DATA = [
  {
    name: "20/40' 12 Pins Triaxle Container Chassis",
    nameEs: "Chasis Contenedor Triaxial 20/40' 12 Pines",
    slug: "20-40-12-pins-triaxle",
    conditionId: 1,
    manufacturer: "AXN",
    size: "20-40ft",
    axleConfig: "Triaxle",
    description: "Versatile triaxle container chassis designed for 20' and 40' containers with 12-pin configuration and hydraulic locking system.",
    descriptionEs: "Chasis contenedor triaxial versátil diseñado para contenedores de 20' y 40' con configuración de 12 pines y sistema de bloqueo hidráulico.",
    imageUrl: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&h=400&fit=crop",
    additionalImages: [],
    overallLength: "31'-7'' (retracted) or 40'-11'' (extended)",
    overallWidth: "96''",
    fifthWheelHeight: "47±1''",
    rearDeckHeight: "48±1''",
    axleSpread: "61''+61''",
    tareWeight: "10,900 lbs ±2%",
    payload: "66,100lbs for 20' loaded or 74,100lbs for 40' loaded",
    frameComponents: ["Main Beam: 16''×5'' fabricated I-beam"],
    suspensionDetails: ["AXN 61'' tri-axle, underslung configuration"],
    brakeSystemDetails: ["SEALCO 110800 spring brake priority valve system"],
    electricalDetails: ["PHILLIPS mold seal wiring harness"],
    additionalEquipment: ["AXN FW32E00J Landing Gear"],
    featured: true,
    sortOrder: 1
  },
  {
    name: "40FT Gooseneck with Genset",
    nameEs: "Chasis Gooseneck 40FT con Generador",
    slug: "40ft-gooseneck-genset",
    conditionId: 1,
    manufacturer: "SAF Holland",
    size: "40ft",
    axleConfig: "Tandem",
    description: "Heavy-duty 40-foot gooseneck chassis equipped with generator set for specialized container transportation needs.",
    descriptionEs: "Chasis gooseneck de servicio pesado de 40 pies equipado con generador para necesidades especializadas de transporte de contenedores.",
    imageUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&h=400&fit=crop",
    additionalImages: [],
    overallLength: "40'-11''",
    overallWidth: "96''",
    fifthWheelHeight: "48±1''",
    rearDeckHeight: "48±1''",
    axleSpread: "49''",
    tareWeight: "6,600 lbs ±2%",
    payload: "67,200 lbs",
    frameComponents: ["Main Beam: WI209lb/ft hot-rolled H-beam"],
    suspensionDetails: ["HUTCH H9700 mechanical tandem suspension"],
    brakeSystemDetails: ["Standard ABS brake system"],
    electricalDetails: ["Standard LED lighting"],
    additionalEquipment: ["Standard landing gear"],
    featured: true,
    sortOrder: 2
  },
  {
    name: "45ft Multimodal Chassis",
    nameEs: "Chasis Multimodal 45ft",
    slug: "45ft-multimodal-esp",
    conditionId: 1,
    manufacturer: "JOST",
    size: "45ft",
    axleConfig: "Tridem",
    description: "Specialized 45-foot multimodal chassis designed for efficient intermodal transportation with enhanced load capacity.",
    descriptionEs: "Chasis multimodal especializado de 45 pies diseñado para transporte intermodal eficiente con capacidad de carga mejorada.",
    imageUrl: "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?w=600&h=400&fit=crop",
    additionalImages: [],
    overallLength: "45'-2 33/64'' (13780 mm)",
    overallWidth: "98'' (2490 mm)",
    fifthWheelHeight: "46''±1'' (1170 mm)",
    rearDeckHeight: "56''±1'' (1436 mm)",
    axleSpread: "52'' (1310 mm)",
    tareWeight: "14,991 lbs (±2%) (6800 kg)",
    payload: "66,139 lbs (30000 kg)",
    frameComponents: ["Main Beam: Fabricated H-beam H420x140x14x6x14mm"],
    suspensionDetails: ["ZY brand with 22,046 lbs capacity"],
    brakeSystemDetails: ["KORMEE ABS system"],
    electricalDetails: ["LED lighting system, 12V"],
    additionalEquipment: ["JOST Brand landing gear, 61,729 lbs capacity"],
    featured: true,
    sortOrder: 3
  },
  {
    name: "20' SL Tandem Container Chassis",
    nameEs: "Chasis Contenedor Tandem 20' SL",
    slug: "20-sl-tandem",
    conditionId: 1,
    manufacturer: "AXN",
    size: "20ft",
    axleConfig: "Tandem",
    description: "Lightweight tandem axle chassis specifically designed for 20-foot containers with superior maneuverability.",
    descriptionEs: "Chasis tándem ligero específicamente diseñado para contenedores de 20 pies con maniobrabilidad superior.",
    imageUrl: "https://images.unsplash.com/photo-1551708297-7a8b264c6e27?w=600&h=400&fit=crop",
    additionalImages: [],
    overallLength: "31'-6''",
    overallWidth: "96''",
    fifthWheelHeight: "47±1''",
    rearDeckHeight: "48±1''",
    axleSpread: "54''",
    tareWeight: "8,500 lbs ±2%",
    payload: "59,500 lbs",
    frameComponents: ["Main Beam: High-strength steel I-beam construction"],
    suspensionDetails: ["AXN tandem suspension system"],
    brakeSystemDetails: ["ABS-equipped brake system"],
    electricalDetails: ["LED lighting package"],
    additionalEquipment: ["Heavy-duty landing gear"],
    featured: true,
    sortOrder: 4
  },
  {
    name: "20/40/45' Extendable Triaxle Container Chassis",
    nameEs: "Chasis Contenedor Triaxial Extensible 20/40/45'",
    slug: "20-40-45-extendable-triaxle",
    conditionId: 1,
    manufacturer: "Multi-Config",
    size: "20-40-45ft",
    axleConfig: "Triaxle",
    description: "Ultra-versatile extendable triaxle chassis accommodating 20', 40', and 45' containers with advanced hydraulic extension system.",
    descriptionEs: "Chasis triaxial extensible ultra versátil que acomoda contenedores de 20', 40' y 45' con sistema de extensión hidráulica avanzada.",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
    additionalImages: [],
    overallLength: "Variable: 32'-45' depending on configuration",
    overallWidth: "96''",
    fifthWheelHeight: "47±1''",
    rearDeckHeight: "48±1''",
    axleSpread: "Variable triaxle configuration",
    tareWeight: "12,200 lbs ±2%",
    payload: "Up to 75,800 lbs depending on configuration",
    frameComponents: ["Extendable main beam with telescoping capability"],
    suspensionDetails: ["Advanced triaxle air suspension"],
    brakeSystemDetails: ["Full ABS brake system"],
    electricalDetails: ["Advanced LED lighting system"],
    additionalEquipment: ["Hydraulic extension system"],
    featured: true,
    sortOrder: 5
  }
];

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
    console.log("Getting chassis models from embedded data...");
    
    console.log(`Total products in embedded data: ${PRODUCT_DATA.length}`);
    
    // Filter to only allowed products
    const filteredData = PRODUCT_DATA.filter(item => ALLOWED_PRODUCT_SLUGS.includes(item.slug));
    console.log(`Filtered to ${filteredData.length} allowed products`);
    
    // Return the data directly
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

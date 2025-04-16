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

// In-memory storage implementation
export class MemStorage implements IStorage {
  private conditions: Map<number, Condition>;
  private chassisModels: Map<number, ChassisModel>;
  private contactMessages: Map<number, ContactMessage>;
  private conditionIdCounter: number;
  private chassisIdCounter: number;
  private messageIdCounter: number;

  constructor() {
    this.conditions = new Map();
    this.chassisModels = new Map();
    this.contactMessages = new Map();
    this.conditionIdCounter = 1;
    this.chassisIdCounter = 1;
    this.messageIdCounter = 1;
    
    // Initialize with seed data
    this.seedData();
  }

  // Condition operations
  async getAllConditions(): Promise<Condition[]> {
    return Array.from(this.conditions.values());
  }

  async getConditionBySlug(slug: string): Promise<Condition | undefined> {
    return Array.from(this.conditions.values()).find(condition => condition.slug === slug);
  }

  async createCondition(insertCondition: InsertCondition): Promise<Condition> {
    const id = this.conditionIdCounter++;
    const condition: Condition = { ...insertCondition, id };
    this.conditions.set(id, condition);
    return condition;
  }

  // Chassis model operations
  async getAllChassisModels(): Promise<ChassisModel[]> {
    return Array.from(this.chassisModels.values());
  }

  async getChassisModelsByCondition(conditionId: number): Promise<ChassisModel[]> {
    return Array.from(this.chassisModels.values())
      .filter(model => model.conditionId === conditionId);
  }

  async getChassisModelBySlug(slug: string): Promise<ChassisModel | undefined> {
    return Array.from(this.chassisModels.values())
      .find(model => model.slug === slug);
  }

  async createChassisModel(insertModel: InsertChassisModel): Promise<ChassisModel> {
    const id = this.chassisIdCounter++;
    const model: ChassisModel = { 
      ...insertModel, 
      id,
      features: insertModel.features || null,
      specifications: insertModel.specifications || null
    };
    this.chassisModels.set(id, model);
    return model;
  }

  async filterChassisModels(conditionSlug?: string, size?: string, manufacturer?: string): Promise<ChassisModel[]> {
    let models = Array.from(this.chassisModels.values());
    
    if (conditionSlug && conditionSlug !== 'all') {
      const condition = await this.getConditionBySlug(conditionSlug);
      if (condition) {
        models = models.filter(model => model.conditionId === condition.id);
      }
    }
    
    if (size && size !== 'all') {
      models = models.filter(model => model.size === size);
    }
    
    if (manufacturer && manufacturer !== 'all') {
      models = models.filter(model => model.manufacturer.toLowerCase() === manufacturer.toLowerCase());
    }
    
    return models;
  }

  // Contact message operations
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.messageIdCounter++;
    const message: ContactMessage = { 
      ...insertMessage, 
      id,
      company: insertMessage.company || null,
      phone: insertMessage.phone || null,
      units: insertMessage.units || null,
      interest: insertMessage.interest || null
    };
    this.contactMessages.set(id, message);
    return message;
  }

  // Seed initial data
  private seedData() {
    // Seed conditions
    const newCondition = this.createCondition({
      name: "New Chassis",
      slug: "new-chassis",
      description: "Brand new chassis with full warranty and the latest features and technology.",
      imageUrl: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    });
    
    const usedCondition = this.createCondition({
      name: "Used Chassis",
      slug: "used-chassis",
      description: "Quality pre-owned chassis that have been thoroughly inspected and refurbished as needed.",
      imageUrl: "https://images.unsplash.com/photo-1573413005382-4b56a5092502?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    });
    
    // Seed chassis models - New Condition
    this.createChassisModel({
      name: "40ft Container Chassis",
      slug: "new-bull-40ft-container",
      conditionId: 1, // New Chassis
      manufacturer: "Bull",
      size: "40ft",
      dutyType: "Heavy Duty",
      description: "Brand new versatile 40ft container chassis with reinforced frame and advanced suspension.",
      imageUrl: "https://images.unsplash.com/photo-1586191582151-f73872dce13c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      features: ["Reinforced frame", "Advanced suspension", "Corrosion-resistant coating", "LED lighting"],
      specifications: ["Length: 40ft", "Weight capacity: 45,000 lbs", "Axles: Tandem", "Kingpin: 2 inch"]
    });
    
    this.createChassisModel({
      name: "53ft Extendable Chassis",
      slug: "new-bull-53ft-extendable",
      conditionId: 1, // New Chassis
      manufacturer: "Bull",
      size: "53ft",
      dutyType: "Extra Heavy Duty",
      description: "Brand new heavy-duty 53ft extendable chassis with enhanced load capacity and durability.",
      imageUrl: "https://images.unsplash.com/photo-1498887960847-2a5e46312788?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      features: ["Extendable frame", "Enhanced load capacity", "Heavy-duty components", "Premium braking system"],
      specifications: ["Length: 53ft (extendable)", "Weight capacity: 67,000 lbs", "Axles: Tri-axle", "Kingpin: 2 inch"]
    });
    
    this.createChassisModel({
      name: "53ft Gooseneck Chassis",
      slug: "new-cheetah-53ft-gooseneck",
      conditionId: 1, // New Chassis
      manufacturer: "Cheetah",
      size: "53ft",
      dutyType: "Extra Heavy Duty",
      description: "Brand new premium 53ft gooseneck chassis with extended reach and superior stability.",
      imageUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      features: ["Gooseneck design", "Extended reach", "Superior stability", "Air-ride suspension"],
      specifications: ["Length: 53ft", "Weight capacity: 65,000 lbs", "Axles: Tri-axle", "Kingpin: 2 inch"]
    });
    
    // Seed chassis models - Used Condition
    this.createChassisModel({
      name: "20ft Intermodal Chassis",
      slug: "used-pratt-20ft-intermodal",
      conditionId: 2, // Used Chassis
      manufacturer: "Pratt",
      size: "20ft",
      dutyType: "Standard Duty",
      description: "Pre-owned 20ft intermodal chassis with optimized weight distribution and maneuverability. Fully inspected and reconditioned.",
      imageUrl: "https://images.unsplash.com/photo-1555412654-72a95a495858?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      features: ["Optimized weight distribution", "Enhanced maneuverability", "Compact design", "Versatile coupler"],
      specifications: ["Length: 20ft", "Weight capacity: 30,000 lbs", "Axles: Single", "Kingpin: 2 inch"]
    });
    
    this.createChassisModel({
      name: "40ft Combo Chassis",
      slug: "used-pratt-40ft-combo",
      conditionId: 2, // Used Chassis
      manufacturer: "Pratt",
      size: "40ft",
      dutyType: "Heavy Duty",
      description: "Pre-owned 40ft combo chassis designed for flexibility with multiple container configurations. Thoroughly inspected.",
      imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      features: ["Multiple container configurations", "Adaptable design", "Heavy-duty construction", "Enhanced stability"],
      specifications: ["Length: 40ft", "Weight capacity: 48,000 lbs", "Axles: Tandem", "Kingpin: 2 inch"]
    });
    
    this.createChassisModel({
      name: "45ft Slider Chassis",
      slug: "used-stoughton-45ft-slider",
      conditionId: 2, // Used Chassis
      manufacturer: "Stoughton",
      size: "45ft",
      dutyType: "Heavy Duty",
      description: "Pre-owned 45ft slider chassis with multiple locking positions for versatile container handling. Fully refurbished.",
      imageUrl: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      features: ["Adjustable slider", "Multiple locking positions", "Versatile container handling", "Premium materials"],
      specifications: ["Length: 45ft", "Weight capacity: 50,000 lbs", "Axles: Tandem", "Kingpin: 2 inch"]
    });
  }
}

export const storage = new MemStorage();

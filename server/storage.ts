import {
  brands, 
  chassisModels, 
  contactMessages,
  type Brand, 
  type InsertBrand, 
  type ChassisModel, 
  type InsertChassisModel,
  type ContactMessage,
  type InsertContactMessage
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // Brand operations
  getAllBrands(): Promise<Brand[]>;
  getBrandBySlug(slug: string): Promise<Brand | undefined>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  
  // Chassis model operations
  getAllChassisModels(): Promise<ChassisModel[]>;
  getChassisModelsByBrand(brandId: number): Promise<ChassisModel[]>;
  getChassisModelBySlug(slug: string): Promise<ChassisModel | undefined>;
  createChassisModel(model: InsertChassisModel): Promise<ChassisModel>;
  filterChassisModels(brandSlug?: string, size?: string): Promise<ChassisModel[]>;
  
  // Contact message operations
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private brands: Map<number, Brand>;
  private chassisModels: Map<number, ChassisModel>;
  private contactMessages: Map<number, ContactMessage>;
  private brandIdCounter: number;
  private chassisIdCounter: number;
  private messageIdCounter: number;

  constructor() {
    this.brands = new Map();
    this.chassisModels = new Map();
    this.contactMessages = new Map();
    this.brandIdCounter = 1;
    this.chassisIdCounter = 1;
    this.messageIdCounter = 1;
    
    // Initialize with seed data
    this.seedData();
  }

  // Brand operations
  async getAllBrands(): Promise<Brand[]> {
    return Array.from(this.brands.values());
  }

  async getBrandBySlug(slug: string): Promise<Brand | undefined> {
    return Array.from(this.brands.values()).find(brand => brand.slug === slug);
  }

  async createBrand(insertBrand: InsertBrand): Promise<Brand> {
    const id = this.brandIdCounter++;
    const brand: Brand = { ...insertBrand, id };
    this.brands.set(id, brand);
    return brand;
  }

  // Chassis model operations
  async getAllChassisModels(): Promise<ChassisModel[]> {
    return Array.from(this.chassisModels.values());
  }

  async getChassisModelsByBrand(brandId: number): Promise<ChassisModel[]> {
    return Array.from(this.chassisModels.values())
      .filter(model => model.brandId === brandId);
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

  async filterChassisModels(brandSlug?: string, size?: string): Promise<ChassisModel[]> {
    let models = Array.from(this.chassisModels.values());
    
    if (brandSlug && brandSlug !== 'all') {
      const brand = await this.getBrandBySlug(brandSlug);
      if (brand) {
        models = models.filter(model => model.brandId === brand.id);
      }
    }
    
    if (size && size !== 'all') {
      models = models.filter(model => model.size === size);
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
    // Seed brands
    const bullChassis = this.createBrand({
      name: "Bull Chassis",
      slug: "bull-chassis",
      description: "Rugged and reliable chassis solutions built to withstand the toughest conditions.",
      imageUrl: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    });
    
    const cheetahChassis = this.createBrand({
      name: "Cheetah Chassis",
      slug: "cheetah-chassis",
      description: "Innovative designs with superior performance for efficient transportation.",
      imageUrl: "https://images.unsplash.com/photo-1573413005382-4b56a5092502?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    });
    
    const prattChassis = this.createBrand({
      name: "Pratt Intermodal Chassis",
      slug: "pratt-chassis",
      description: "Versatile intermodal solutions designed for maximum efficiency and durability.",
      imageUrl: "https://images.unsplash.com/photo-1591768783525-68c1482d2058?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    });
    
    const stoughtonChassis = this.createBrand({
      name: "Stoughton Chassis",
      slug: "stoughton-chassis",
      description: "Premium quality chassis known for exceptional engineering and longevity.",
      imageUrl: "https://images.unsplash.com/photo-1570942872213-11670c3632d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    });
    
    // Seed chassis models
    this.createChassisModel({
      name: "40ft Container Chassis",
      slug: "bull-40ft-container",
      brandId: 1, // Bull Chassis
      size: "40ft",
      dutyType: "Heavy Duty",
      description: "Versatile 40ft container chassis with reinforced frame and advanced suspension.",
      imageUrl: "https://images.unsplash.com/photo-1586191582151-f73872dce13c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      features: ["Reinforced frame", "Advanced suspension", "Corrosion-resistant coating", "LED lighting"],
      specifications: ["Length: 40ft", "Weight capacity: 45,000 lbs", "Axles: Tandem", "Kingpin: 2 inch"]
    });
    
    this.createChassisModel({
      name: "53ft Extendable Chassis",
      slug: "bull-53ft-extendable",
      brandId: 1, // Bull Chassis
      size: "53ft",
      dutyType: "Extra Heavy Duty",
      description: "Heavy-duty 53ft extendable chassis with enhanced load capacity and durability.",
      imageUrl: "https://images.unsplash.com/photo-1498887960847-2a5e46312788?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      features: ["Extendable frame", "Enhanced load capacity", "Heavy-duty components", "Premium braking system"],
      specifications: ["Length: 53ft (extendable)", "Weight capacity: 67,000 lbs", "Axles: Tri-axle", "Kingpin: 2 inch"]
    });
    
    this.createChassisModel({
      name: "53ft Gooseneck Chassis",
      slug: "cheetah-53ft-gooseneck",
      brandId: 2, // Cheetah Chassis
      size: "53ft",
      dutyType: "Extra Heavy Duty",
      description: "Premium 53ft gooseneck chassis with extended reach and superior stability.",
      imageUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      features: ["Gooseneck design", "Extended reach", "Superior stability", "Air-ride suspension"],
      specifications: ["Length: 53ft", "Weight capacity: 65,000 lbs", "Axles: Tri-axle", "Kingpin: 2 inch"]
    });
    
    this.createChassisModel({
      name: "20ft Intermodal Chassis",
      slug: "pratt-20ft-intermodal",
      brandId: 3, // Pratt Intermodal
      size: "20ft",
      dutyType: "Standard Duty",
      description: "Compact 20ft intermodal chassis with optimized weight distribution and maneuverability.",
      imageUrl: "https://images.unsplash.com/photo-1555412654-72a95a495858?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      features: ["Optimized weight distribution", "Enhanced maneuverability", "Compact design", "Versatile coupler"],
      specifications: ["Length: 20ft", "Weight capacity: 30,000 lbs", "Axles: Single", "Kingpin: 2 inch"]
    });
    
    this.createChassisModel({
      name: "40ft Combo Chassis",
      slug: "pratt-40ft-combo",
      brandId: 3, // Pratt Intermodal
      size: "40ft",
      dutyType: "Heavy Duty",
      description: "Versatile 40ft combo chassis designed for flexibility with multiple container configurations.",
      imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      features: ["Multiple container configurations", "Adaptable design", "Heavy-duty construction", "Enhanced stability"],
      specifications: ["Length: 40ft", "Weight capacity: 48,000 lbs", "Axles: Tandem", "Kingpin: 2 inch"]
    });
    
    this.createChassisModel({
      name: "45ft Slider Chassis",
      slug: "stoughton-45ft-slider",
      brandId: 4, // Stoughton Chassis
      size: "45ft",
      dutyType: "Heavy Duty",
      description: "Adjustable 45ft slider chassis with multiple locking positions for versatile container handling.",
      imageUrl: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      features: ["Adjustable slider", "Multiple locking positions", "Versatile container handling", "Premium materials"],
      specifications: ["Length: 45ft", "Weight capacity: 50,000 lbs", "Axles: Tandem", "Kingpin: 2 inch"]
    });
  }
}

export const storage = new MemStorage();

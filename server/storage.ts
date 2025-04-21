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
      imageUrl: "/assets/new-chassis.jpg"
    });
    
    const usedCondition = this.createCondition({
      name: "Used Chassis",
      slug: "used-chassis",
      description: "Quality pre-owned chassis that have been thoroughly inspected and refurbished as needed.",
      imageUrl: "/assets/used-chassis.jpg"
    });
    
    // Seed chassis models - New Condition
    this.createChassisModel({
      name: "20' SL Tandem Container Chassis",
      slug: "new-20ft-sl-tandem",
      conditionId: 1, // New Chassis
      manufacturer: "American Chassis Depot",
      size: "20ft",
      dutyType: "Heavy Duty",
      description: "Heavy-duty 20-foot container chassis with sliding tandem axle configuration. Designed to transport standard 20' ISO containers with durability and compliance for highway and intermodal use.",
      imageUrl: "/assets/new-chassis-1.jpg",
      features: [
        "Sliding tandem frame with locking pin system",
        "DOT and AAR compliant construction",
        "Heavy-duty steel main beam and bolsters",
        "LED lighting with sealed wiring harness"
      ],
      specifications: [
        "Overall Length: 23'-8\" (retracted) / 27'-8\" (extended)",
        "Axle Configuration: Tandem, 49\" spread",
        "Suspension: HUTCH H9700 mechanical with low-arch leaf spring",
        "Tare Weight: 6,900 lbs ±2%"
      ]
    });
    
    this.createChassisModel({
      name: "20/40' Extendable Tandem Container Chassis",
      slug: "new-20-40ft-extendable-tandem",
      conditionId: 1, // New Chassis
      manufacturer: "American Chassis Depot",
      size: "20-40ft",
      dutyType: "Heavy Duty",
      description: "Extendable chassis engineered to carry either one 20' or one 40' ISO container. Features a high-strength steel structure, sliding tandem axle system, and air-actuated locking pins for reliable and flexible transport.",
      imageUrl: "/assets/triaxle-chassis.jpg",
      features: [
        "Air-operated locking system with third glad hand control",
        "Extendable I-beam frame with Grade 100 steel flanges",
        "DOT, AAR, FMVSS, and ANSI compliant",
        "LED lighting with sealed wiring harness and ABS-ready system"
      ],
      specifications: [
        "Overall Length: 29'-11\" (retracted) / 40'-10\" (extended)",
        "Axle Configuration: Tandem, 49\" spread",
        "Tare Weight: 7,660 lbs ±3%",
        "Suspension: HUTCH H9700 mechanical with high-arch springs"
      ]
    });
    
    this.createChassisModel({
      name: "20/40' 12 Pins Triaxle Container Chassis",
      slug: "new-20-40ft-12pins-triaxle",
      conditionId: 1, // New Chassis
      manufacturer: "American Chassis Depot",
      size: "20-40ft",
      dutyType: "Extra Heavy Duty",
      description: "Versatile triaxle chassis designed to transport one 40' ISO container, one loaded 20', or two empty 20' containers. Equipped with 12 twist locks and an extendable frame, it offers maximum payload flexibility and compliance with all relevant transport regulations.",
      imageUrl: "/assets/new-chassis.jpg",
      features: [
        "12 container locks for 1x40', 1x20' or 2x20' empties",
        "Air-operated locking pin system",
        "Reinforced I-beam gooseneck mainframe",
        "LED lighting system with sealed harness and 10-year warranty"
      ],
      specifications: [
        "Overall Length: 31'-7\" (retracted) / 40'-11\" (extended)",
        "Axle Configuration: Triaxle (61\" + 61\" spread)",
        "Tare Weight: 10,900 lbs ± 2%",
        "Suspension: AXN tri-axle underslung, high-arch single spring"
      ]
    });
    
    // More new chassis models
    this.createChassisModel({
      name: "40/45' Extendable Container Chassis",
      slug: "new-40-45ft-extendable",
      conditionId: 1, // New Chassis
      manufacturer: "American Chassis Depot",
      size: "40-45ft",
      dutyType: "Heavy Duty",
      description: "Extendable container chassis designed to transport 40 ft and 45 ft ISO containers. Built to meet U.S. highway and safety regulations, it features a self-locking extension system, robust steel construction, and reliable suspension and braking components for dependable performance.",
      imageUrl: "/assets/triaxle-chassis.jpg",
      features: [
        "Self-locating and self-locking frame extension system",
        "High-strength hot-rolled steel main beam (ASTM A572 Grade 50)",
        "Pre-painted steel components with powder-coated finish",
        "Integrated 2-speed landing gear with 60,000 lbs capacity"
      ],
      specifications: [
        "Overall Length: 40'-11\" (retracted) / 45'-11\" (extended)",
        "Tare Weight: 7,400 lbs ±2%",
        "Payload Capacity: 67,200 lbs",
        "Axle Spread: 49\""
      ]
    });
    
    // Seed chassis models - Used Condition
    this.createChassisModel({
      name: "40' Gooseneck Container Chassis",
      slug: "used-40ft-gooseneck",
      conditionId: 2, // Used Chassis
      manufacturer: "American Chassis Depot",
      size: "40ft",
      dutyType: "Heavy Duty",
      description: "Chasis de cuello de ganso diseñado específicamente para el transporte de contenedores ISO de 40 pies. Cumple con los estándares de seguridad y transporte de EE.UU. y ofrece una construcción robusta, suspensión mecánica confiable y sistema eléctrico de alto rendimiento.",
      imageUrl: "/assets/used-chassis.jpg",
      features: [
        "Gooseneck design optimized for 40' ISO containers",
        "Hot-rolled H-beam mainframe (ASTM A572 Grade 50)",
        "Pre-painted chassis with electrophoresis primer and powder coating (7-year warranty)",
        "2-speed landing gear with 60,000 lbs capacity"
      ],
      specifications: [
        "Overall Length: 40'-11\"",
        "Tare Weight: 6,600 lbs ±2%",
        "Payload Capacity: 67,200 lbs",
        "Axle Spread: 49\""
      ]
    });
    
    this.createChassisModel({
      name: "20/40/45' Extendable Triaxle Container Chassis",
      slug: "used-20-40-45ft-extendable-triaxle",
      conditionId: 2, // Used Chassis
      manufacturer: "American Chassis Depot",
      size: "20-40-45ft",
      dutyType: "Extra Heavy Duty",
      description: "Chasis extensible triaxial diseñado para transportar contenedores ISO de 20, 40 y 45 pies. Ofrece una estructura reforzada, sistema de extensión con bloqueo neumático y capacidad de carga variable según la posición del contenedor. Cumple con los estándares de seguridad y transporte vigentes.",
      imageUrl: "/assets/used-chassis-1.jpg",
      features: [
        "Air-operated locking system with spring brakes and third glad hand",
        "Tri-axle suspension with high-arch 3-leaf spring configuration",
        "Fabricated high-strength steel frame with Grade 80 and 100 components",
        "Pre-painted with electrophoresis primer and powder topcoat (7-year warranty)"
      ],
      specifications: [
        "Overall Length: 36' 10\" (retracted) / 45' 6\" (extended)",
        "Tare Weight: 10,210 lbs ±2%",
        "Payload Capacity: 49,400 lbs (20') / 67,200 lbs (40'/45')",
        "Axle Spread: 61\" + 61\""
      ]
    });
  }
}

export const storage = new MemStorage();

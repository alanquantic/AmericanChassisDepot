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
    name: "20' SL Tandem Container Chassis",
    nameEs: "Chasis Contenedor Tandem 20' SL",
    slug: "20-sl-tandem",
    conditionId: 1,
    manufacturer: "AXN",
    size: "20ft",
    axleConfig: "Tandem",
    description: "Lightweight tandem axle chassis specifically designed for 20-foot containers with superior maneuverability.",
    descriptionEs: "Chasis tándem ligero específicamente diseñado para contenedores de 20 pies con maniobrabilidad superior.",
    imageUrl: "/assets/20-sl-tandem.webp",
    additionalImages: [
      "/assets/20_SL_Tandem_2.jpg",
      "/assets/20_SL_Tandem_3.jpg"
    ],
    overallLength: "31'-6''",
    overallWidth: "96''",
    fifthWheelHeight: "47±1''",
    rearDeckHeight: "48±1''",
    kingpinLocation: "18'' (From the rear of the front bolster)",
    landingGearLocation: "100'' (From the kingpin center)",
    axleSpread: "54''",
    tareWeight: "8,500 lbs ±2%",
    payload: "59,500 lbs",
    frameComponents: [
      "Main Beam: High-strength steel I-beam construction",
      "Front Bolster: Heavy-duty fabricated assembly",
      "Rear Bolster: Reinforced construction for container locks"
    ],
    suspensionDetails: [
      "AXN tandem suspension system",
      "Air ride configuration",
      "Enhanced stability design"
    ],
    brakeSystemDetails: [
      "ABS-equipped brake system",
      "Automatic slack adjusters",
      "DOT compliant brake chambers"
    ],
    electricalDetails: [
      "LED lighting package",
      "Standard 7-way connector",
      "ABS-ready wiring harness"
    ],
    additionalEquipment: [
      "Heavy-duty landing gear",
      "Premium tire package",
      "DOT reflective tape",
      "Container twist locks"
    ],
    featured: true,
    sortOrder: 1
  },
  {
    name: "20' SL Tandem Extended Version",
    nameEs: "Chasis Tándem 20' SL Versión Extendida",
    slug: "20-sl-tandem-extended",
    conditionId: 1,
    manufacturer: "AXN",
    size: "20ft",
    axleConfig: "Tandem",
    description: "Extended version of the 20' SL tandem chassis with enhanced features and capabilities.",
    descriptionEs: "Versión extendida del chasis tándem 20' SL con características y capacidades mejoradas.",
    imageUrl: "/assets/20-sl-tandem-extended.webp",
    additionalImages: [
      "/assets/20_SL_Tandem_2.jpg",
      "/assets/20_SL_Tandem_3.jpg"
    ],
    overallLength: "32'-6''",
    overallWidth: "96''",
    fifthWheelHeight: "47±1''",
    rearDeckHeight: "48±1''",
    kingpinLocation: "18'' (From the rear of the front bolster)",
    landingGearLocation: "100'' (From the kingpin center)",
    axleSpread: "54''",
    tareWeight: "8,800 lbs ±2%",
    payload: "59,200 lbs",
    frameComponents: [
      "Extended main beam structure",
      "Enhanced bolster assemblies",
      "Reinforced connection points"
    ],
    suspensionDetails: [
      "Advanced tandem suspension system",
      "Extended range configuration",
      "Enhanced stability design"
    ],
    brakeSystemDetails: [
      "Extended ABS-equipped brake system",
      "Advanced slack adjusters",
      "Enhanced DOT compliant brake chambers"
    ],
    electricalDetails: [
      "Extended LED lighting package",
      "Advanced 7-way connector",
      "Enhanced ABS-ready wiring harness"
    ],
    additionalEquipment: [
      "Extended landing gear system",
      "Advanced tire monitoring",
      "Enhanced safety features"
    ],
    featured: false,
    sortOrder: 2
  },
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
    imageUrl: "/assets/triaxle_20.webp",
    additionalImages: [
      "/assets/triaxle_20_2.webp",
      "/assets/triaxle_20_3.webp",
      "/assets/triaxle_20_4.webp",
      "/assets/triaxle_20_5.webp"
    ],
    overallLength: "31'-7'' (retracted) or 40'-11'' (extended)",
    overallWidth: "96''",
    fifthWheelHeight: "47±1''",
    rearDeckHeight: "48±1''",
    kingpinLocation: "18'' (From the rear of the front bolster)",
    landingGearLocation: "100'' (From the kingpin center)",
    axleSpread: "61''+61''",
    tareWeight: "10,900 lbs ±2%",
    payload: "66,100lbs for 20' loaded or 74,100lbs for 40' loaded",
    frameComponents: [
      "Main Beam: 16''×5'' fabricated I-beam with high strength flanges",
      "Upper Coupler: 5/16'' pick up plate with JOST 2'' diameter square type kingpin",
      "Front Bolster: Fabricated bolster assembly with 89'' centers",
      "Intermediate Bolster: Fabricated with retractable twistlocks",
      "Rear Bolster: Tapered rectangle bolster with flip up twistlocks"
    ],
    suspensionDetails: [
      "AXN 61'' tri-axle, underslung configuration",
      "High-arch single spring (360-00)",
      "Pre-painted BLACK color"
    ],
    brakeSystemDetails: [
      "SEALCO 110800 spring brake priority valve system",
      "WABCO 4S/2M ABS system",
      "HALDEX Goldseal T30/30, 2.5'' stroke brake chamber",
      "PHILLIPS glad hand 12-0061 and 12-0081"
    ],
    electricalDetails: [
      "PHILLIPS mold seal wiring harness",
      "OPTRONICS LED lights",
      "Reserved PSI and GPS connector",
      "10-year warranty electrical system"
    ],
    additionalEquipment: [
      "AXN FW32E00J Landing Gear with 60,000 lbs capacity",
      "WESTLAKE 255/70R22.5-16PR tubeless tires",
      "JINGU 22.5×8.25 10-stud hub-piloted wheels",
      "3M Conspicuity Tape per federal regulations"
    ],
    featured: true,
    sortOrder: 3
  },
  {
    name: "20/40' Extendable Tandem Container Chassis",
    nameEs: "Chasis Contenedor Tándem Extensible 20/40'",
    slug: "20-40-extendable-tandem",
    conditionId: 1,
    manufacturer: "FlexFrame",
    size: "20-40ft",
    axleConfig: "Tandem",
    description: "Efficient extendable tandem chassis for 20' and 40' containers with reliable extension mechanism and superior fuel economy.",
    descriptionEs: "Chasis tándem extensible eficiente para contenedores de 20' y 40' con mecanismo de extensión confiable y economía de combustible superior.",
    imageUrl: "/assets/20-40-extendable-tandem.webp",
    additionalImages: [
      "/assets/20_40_Extendable_Tandem_2.jpg"
    ],
    overallLength: "31'-7'' (retracted) to 40'-11'' (extended)",
    overallWidth: "96''",
    fifthWheelHeight: "47±1''",
    rearDeckHeight: "48±1''",
    kingpinLocation: "18'' (From the rear of the front bolster)",
    landingGearLocation: "100'' (From the kingpin center)",
    axleSpread: "54''",
    tareWeight: "9,800 lbs ±2%",
    payload: "Up to 70,200 lbs",
    frameComponents: [
      "Lightweight extendable main beam",
      "Precision extension mechanism",
      "Reinforced bolster assemblies",
      "Integrated locking system"
    ],
    suspensionDetails: [
      "High-efficiency tandem suspension",
      "Optimized for fuel economy",
      "Reduced maintenance design"
    ],
    brakeSystemDetails: [
      "Standard ABS brake system",
      "Reliable brake components",
      "Easy maintenance access"
    ],
    electricalDetails: [
      "Standard LED lighting",
      "Reliable wiring harness",
      "Weather-resistant connections"
    ],
    additionalEquipment: [
      "Manual extension system",
      "Standard container locks",
      "Efficient landing gear",
      "DOT compliance package"
    ],
    featured: false,
    sortOrder: 4
  },
  {
    name: "20/40' Extendable Tandem Container Chassis With PSI",
    nameEs: "Chasis Contenedor Tándem Extensible 20/40' con PSI",
    slug: "20-40-extendable-tandem-psi",
    conditionId: 1,
    manufacturer: "FlexFrame",
    size: "20-40ft",
    axleConfig: "Tandem",
    description: "Advanced extendable tandem chassis with PSI integration for enhanced monitoring and control.",
    descriptionEs: "Chasis tándem extensible avanzado con integración PSI para monitoreo y control mejorados.",
    imageUrl: "/assets/20-40-extendable-tandem.webp",
    additionalImages: [
      "/assets/20_40_Extendable_Tandem_2.jpg"
    ],
    overallLength: "31'-7'' (retracted) to 40'-11'' (extended)",
    overallWidth: "96''",
    fifthWheelHeight: "47±1''",
    rearDeckHeight: "48±1''",
    kingpinLocation: "18'' (From the rear of the front bolster)",
    landingGearLocation: "100'' (From the kingpin center)",
    axleSpread: "54''",
    tareWeight: "10,200 lbs ±2%",
    payload: "Up to 70,800 lbs",
    frameComponents: [
      "PSI-integrated main beam",
      "Advanced extension mechanism",
      "Enhanced bolster assemblies",
      "Integrated monitoring system"
    ],
    suspensionDetails: [
      "PSI-monitored tandem suspension",
      "Advanced load-leveling capability",
      "Enhanced stability control"
    ],
    brakeSystemDetails: [
      "PSI-integrated ABS brake system",
      "Advanced electronic brake distribution",
      "Enhanced brake monitoring"
    ],
    electricalDetails: [
      "PSI-compatible LED lighting",
      "Advanced wiring harness",
      "Integrated monitoring controls"
    ],
    additionalEquipment: [
      "PSI-integrated extension system",
      "Advanced container locks",
      "Enhanced landing gear",
      "Comprehensive monitoring package"
    ],
    featured: false,
    sortOrder: 5
  },
  {
    name: "20/40' Slider 12pins Container Chassis Tandem",
    nameEs: "Chasis Contenedor Tándem 20/40' Slider 12 Pines",
    slug: "20-40-slider-12pins-tandem",
    conditionId: 1,
    manufacturer: "AXN",
    size: "20-40ft",
    axleConfig: "Tandem",
    description: "Versatile slider tandem chassis with 12-pin configuration for flexible container handling.",
    descriptionEs: "Chasis tándem slider versátil con configuración de 12 pines para manejo flexible de contenedores.",
    imageUrl: "/assets/20-40-slider-12pins-tandem.webp",
    additionalImages: [],
    overallLength: "31'-7'' (retracted) to 40'-11'' (extended)",
    overallWidth: "96''",
    fifthWheelHeight: "47±1''",
    rearDeckHeight: "48±1''",
    kingpinLocation: "18'' (From the rear of the front bolster)",
    landingGearLocation: "100'' (From the kingpin center)",
    axleSpread: "54''",
    tareWeight: "9,500 lbs ±2%",
    payload: "Up to 69,500 lbs",
    frameComponents: [
      "Slider main beam design",
      "12-pin connection system",
      "Flexible bolster assemblies",
      "Advanced locking mechanism"
    ],
    suspensionDetails: [
      "Slider tandem suspension",
      "Flexible load distribution",
      "Enhanced maneuverability"
    ],
    brakeSystemDetails: [
      "Standard ABS brake system",
      "Reliable brake components",
      "Easy maintenance access"
    ],
    electricalDetails: [
      "Standard LED lighting",
      "Reliable wiring harness",
      "Weather-resistant connections"
    ],
    additionalEquipment: [
      "Slider extension system",
      "12-pin container locks",
      "Standard landing gear",
      "DOT compliance package"
    ],
    featured: false,
    sortOrder: 6
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
    imageUrl: "/assets/20-40-45-extendable-triaxle.webp",
    additionalImages: [],
    overallLength: "Variable: 32'-45' depending on configuration",
    overallWidth: "96''",
    fifthWheelHeight: "47±1''",
    rearDeckHeight: "48±1''",
    kingpinLocation: "18'' (From the rear of the front bolster)",
    landingGearLocation: "100'' (From the kingpin center)",
    axleSpread: "Variable triaxle configuration",
    tareWeight: "12,200 lbs ±2%",
    payload: "Up to 75,800 lbs depending on configuration",
    frameComponents: [
      "Extendable main beam with telescoping capability",
      "Reinforced connection points for extension mechanism",
      "Multi-position bolster system",
      "Heavy-duty extension cylinders"
    ],
    suspensionDetails: [
      "Advanced triaxle air suspension",
      "Load-leveling capability",
      "Enhanced stability control"
    ],
    brakeSystemDetails: [
      "Full ABS brake system",
      "Electronic brake distribution",
      "Premium brake components"
    ],
    electricalDetails: [
      "Advanced LED lighting system",
      "Multi-configuration wiring harness",
      "Electronic extension controls"
    ],
    additionalEquipment: [
      "Hydraulic extension system",
      "Multi-position container locks",
      "Heavy-duty landing gear",
      "Advanced tire monitoring system"
    ],
    featured: true,
    sortOrder: 7
  },
  {
    name: "20'/40'/45' COMBO TRIDEM",
    nameEs: "20'/40'/45' COMBO TRIDEM",
    slug: "20-40-45-combo-tandem",
    conditionId: 1,
    manufacturer: "AXN",
    size: "20-40-45ft",
    axleConfig: "Tridem",
    description: "High-strength tridem chassis designed for stevedoring and transporting 20', 40', and 45' containers with 100Kpsi materials and advanced suspension system.",
    descriptionEs: "Chasis tridem de alta resistencia diseñado para estiba y transporte de contenedores de 20', 40' y 45' con materiales de 100Kpsi y sistema de suspensión avanzado.",
    imageUrl: "/assets/20-40-45-combo-tridem.webp",
    additionalImages: [],
    overallLength: "46'-2 1/8'' (extended) or 31'-3 1/8'' (retracted)",
    overallWidth: "96''",
    fifthWheelHeight: "46 3/4''",
    rearDeckHeight: "48 3/8''",
    kingpinLocation: "17 1/2'' (From rear face of front bolster)",
    landingGearLocation: "118 3/8'' (From rear face of front bolster)",
    axleSpread: "61'' tridem configuration",
    tareWeight: "11,300 lbs ±2%",
    payload: "79,000 lbs for 40' and 45' containers, 77,000 lbs for 20' containers",
    frameComponents: [
      "Main Beam: 16''×5'' fabricated I-beam with 100Kpsi materials flanges",
      "Slider Beam: Fabricated 14 3/4''×5'' I-beam, 2-pin locking system",
      "Cross Member: 3/16'' thick fabricated channel type",
      "Upper Coupler: 1/4'' pick up plate with JOST 2'' diameter square type kingpin",
      "Front Bolster: 6 5/8'' wide x 7 3/8'' high, 1/4'' thick tube section",
      "Center Bolster: 5'' wide x 3/8'' thick top plate with 5'' wide x 4 1/4'' deep x 1/4'' thick U-type bottom channel",
      "Rear Bolster: Fabricated 6'' wide x 3/8'' thick top plate with 5'' wide x 4 5/8'' deep x 3/8'' thick tube type"
    ],
    suspensionDetails: [
      "61'' axle spread tridem suspension with single leaf high arch spring",
      "11,000 lb capacity per spring",
      "Hutchen/AXN suspension system",
      "Pre-painted BLACK color"
    ],
    brakeSystemDetails: [
      "SEALCO valve system and WABCO 4S-2M system",
      "Three tanks system (Capacity 2850 cu-in)",
      "3/8'' air tubing",
      "30/30 double diaphragm brake chambers",
      "PHILLIPS glad hands 12-0081/12-0061/12-010"
    ],
    electricalDetails: [
      "12 volt LED lighting system with wiring harness for ABS",
      "4'' Stop/Turn lamp",
      "2'' clearance lamp with flange mounting",
      "GROTE lighting system"
    ],
    additionalEquipment: [
      "AXN FW32E00J Landing Gear with 50,000 lbs capacity",
      "WESTLAKE 255/70R22.5-16PR tubeless tires",
      "JINGU 22.5×8.25 10-stud hub-piloted wheels",
      "3M Conspicuity Tape per federal regulations",
      "24''×24'' black rubber anti-sail mud flap"
    ],
    featured: true,
    sortOrder: 8
  },
  {
    name: "20ft ISO Tank Container Chassis",
    nameEs: "Chasis Contenedor ISO Tank 20ft",
    slug: "20ft-iso-tank-container-chassis",
    conditionId: 1,
    manufacturer: "AXN",
    size: "20ft",
    axleConfig: "Tandem",
    description: "Specialized chassis designed for ISO tank containers with enhanced safety and stability features.",
    descriptionEs: "Chasis especializado diseñado para contenedores ISO tank con características mejoradas de seguridad y estabilidad.",
    imageUrl: "/assets/20ft-iso-tank-container-chassis.webp",
    additionalImages: [],
    overallLength: "31'-6''",
    overallWidth: "96''",
    fifthWheelHeight: "47±1''",
    rearDeckHeight: "48±1''",
    kingpinLocation: "18'' (From the rear of the front bolster)",
    landingGearLocation: "100'' (From the kingpin center)",
    axleSpread: "54''",
    tareWeight: "8,200 lbs ±2%",
    payload: "58,800 lbs",
    frameComponents: [
      "ISO tank-specific main beam",
      "Enhanced safety bolster assemblies",
      "Specialized connection points",
      "Reinforced structure"
    ],
    suspensionDetails: [
      "ISO tank tandem suspension",
      "Enhanced stability design",
      "Load-specific configuration"
    ],
    brakeSystemDetails: [
      "Enhanced ABS brake system",
      "Safety-focused brake components",
      "DOT inspection certified"
    ],
    electricalDetails: [
      "ISO tank LED lighting",
      "Enhanced wiring harness",
      "Safety-compliant connections"
    ],
    additionalEquipment: [
      "ISO tank landing gear",
      "Safety monitoring system",
      "Enhanced tire package",
      "Comprehensive safety features"
    ],
    featured: false,
    sortOrder: 9
  },
  {
    name: "33' Slider Tri-Axle Container Chassis",
    nameEs: "Chasis Contenedor Triaxial Slider 33'",
    slug: "33ft-slider-tri-axle",
    conditionId: 1,
    manufacturer: "AXN",
    size: "33ft",
    axleConfig: "Triaxle",
    description: "Heavy-duty 33-foot tri-axle slider chassis for specialized container transportation needs.",
    descriptionEs: "Chasis triaxial slider de servicio pesado de 33 pies para necesidades especializadas de transporte de contenedores.",
    imageUrl: "/assets/33-slider-triaxle.webp",
    additionalImages: [],
    overallLength: "33'-0''",
    overallWidth: "96''",
    fifthWheelHeight: "47±1''",
    rearDeckHeight: "48±1''",
    kingpinLocation: "18'' (From the rear of the front bolster)",
    landingGearLocation: "100'' (From the kingpin center)",
    axleSpread: "61''+61''",
    tareWeight: "11,200 lbs ±2%",
    payload: "71,800 lbs",
    frameComponents: [
      "33ft tri-axle main beam",
      "Slider extension mechanism",
      "Enhanced bolster assemblies",
      "Heavy-duty connection points"
    ],
    suspensionDetails: [
      "Tri-axle slider suspension",
      "Enhanced load distribution",
      "Advanced stability control"
    ],
    brakeSystemDetails: [
      "Tri-axle ABS brake system",
      "Advanced brake distribution",
      "Enhanced brake monitoring"
    ],
    electricalDetails: [
      "Advanced LED lighting",
      "Enhanced wiring harness",
      "Integrated control systems"
    ],
    additionalEquipment: [
      "Tri-axle landing gear",
      "Advanced extension system",
      "Enhanced tire package",
      "Comprehensive monitoring"
    ],
    featured: false,
    sortOrder: 10
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
  "40_45_Extendable_6.jpg",
  "40_45_Extendable_7.jpg",
  "40_45_Extendable_8.jpg",
  "40_45_Extendable_9.jpg",
  "40_45_Extendable_10.jpg"
];

// Función para verificar si una imagen está bloqueada
function isImageBlocked(imageUrl: string): boolean {
  return BLOCKED_IMAGE_SUBSTRINGS.some(blocked => imageUrl.includes(blocked));
}

// Función para filtrar imágenes bloqueadas
function filterBlockedImages(images: string[]): string[] {
  return images.filter(image => !isImageBlocked(image));
}

// Función para obtener todos los modelos de chasis
export async function getAllChassisModels(): Promise<ChassisModel[]> {
  try {
    // Filtrar productos basados en la lista permitida
    const filteredData = PRODUCT_DATA.filter(product => 
      ALLOWED_PRODUCT_SLUGS.includes(product.slug)
    );

    // Mapear los datos al formato ChassisModel
    const mappedData = filteredData.map((product, index) => ({
      id: index + 1,
      name: product.name,
      nameEs: product.nameEs,
      slug: product.slug,
      conditionId: product.conditionId,
      manufacturer: product.manufacturer,
      size: product.size,
      axleConfig: product.axleConfig,
      description: product.description,
      descriptionEs: product.descriptionEs,
      imageUrl: product.imageUrl,
      additionalImages: filterBlockedImages(product.additionalImages || []),
      overallLength: product.overallLength,
      overallWidth: product.overallWidth,
      fifthWheelHeight: product.fifthWheelHeight,
      rearDeckHeight: product.rearDeckHeight,
      kingpinLocation: product.kingpinLocation,
      landingGearLocation: product.landingGearLocation,
      axleSpread: product.axleSpread,
      tareWeight: product.tareWeight,
      payload: product.payload,
      frameComponents: product.frameComponents,
      suspensionDetails: product.suspensionDetails,
      brakeSystemDetails: product.brakeSystemDetails,
      electricalDetails: product.electricalDetails,
      additionalEquipment: product.additionalEquipment,
      featured: product.featured,
      sortOrder: product.sortOrder,
      overallHeight: product.overallHeight || null,
      gvwr: product.gvwr || null
    }));

    return mappedData;
  } catch (error) {
    console.error('Error getting chassis models:', error);
    return [];
  }
}

// Función para obtener un modelo de chasis por slug
export async function getChassisModelBySlug(slug: string): Promise<ChassisModel | null> {
  try {
    const product = PRODUCT_DATA.find(p => p.slug === slug);
    
    if (!product) {
      return null;
    }

    return {
      id: 1,
      name: product.name,
      nameEs: product.nameEs,
      slug: product.slug,
      conditionId: product.conditionId,
      manufacturer: product.manufacturer,
      size: product.size,
      axleConfig: product.axleConfig,
      description: product.description,
      descriptionEs: product.descriptionEs,
      imageUrl: product.imageUrl,
      additionalImages: filterBlockedImages(product.additionalImages || []),
      overallLength: product.overallLength,
      overallWidth: product.overallWidth,
      fifthWheelHeight: product.fifthWheelHeight,
      rearDeckHeight: product.rearDeckHeight,
      kingpinLocation: product.kingpinLocation,
      landingGearLocation: product.landingGearLocation,
      axleSpread: product.axleSpread,
      tareWeight: product.tareWeight,
      payload: product.payload,
      frameComponents: product.frameComponents,
      suspensionDetails: product.suspensionDetails,
      brakeSystemDetails: product.brakeSystemDetails,
      electricalDetails: product.electricalDetails,
      additionalEquipment: product.additionalEquipment,
      featured: product.featured,
      sortOrder: product.sortOrder,
      overallHeight: product.overallHeight || null,
      gvwr: product.gvwr || null
    };
  } catch (error) {
    console.error('Error getting chassis model by slug:', error);
    return null;
  }
}

// Función para obtener condiciones
export async function getConditions(): Promise<Condition[]> {
  try {
    const result = await db.select().from(conditions);
    return result;
  } catch (error) {
    console.error('Error getting conditions:', error);
    return [];
  }
}

// Función para obtener una condición por ID
export async function getConditionById(id: number): Promise<Condition | null> {
  try {
    const result = await db.select().from(conditions).where(eq(conditions.id, id));
    return result[0] || null;
  } catch (error) {
    console.error('Error getting condition by ID:', error);
    return null;
  }
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
    
    // Convert to proper ChassisModel format
    const models = filteredData.map((item, index) => ({
      id: index + 1, // Use numeric ID
      name: item.name,
      nameEs: item.nameEs,
      slug: item.slug,
      conditionId: item.conditionId,
      manufacturer: item.manufacturer,
      size: item.size,
      axleConfig: item.axleConfig,
      description: item.description,
      descriptionEs: item.descriptionEs,
      imageUrl: item.imageUrl,
      additionalImages: item.additionalImages || [],
      overallLength: item.overallLength,
      overallWidth: item.overallWidth,
      overallHeight: null, // Add missing field
      fifthWheelHeight: item.fifthWheelHeight,
      rearDeckHeight: item.rearDeckHeight,
      kingpinLocation: null, // Add missing field
      landingGearLocation: null, // Add missing field
      axleSpread: item.axleSpread,
      tareWeight: item.tareWeight,
      payload: item.payload,
      gvwr: null, // Add missing field
      frameComponents: item.frameComponents,
      suspensionDetails: item.suspensionDetails,
      brakeSystemDetails: item.brakeSystemDetails,
      electricalDetails: item.electricalDetails,
      additionalEquipment: item.additionalEquipment,
      featured: item.featured,
      sortOrder: item.sortOrder
    }));
    
    console.log(`Returning ${models.length} models with proper format`);
    return models;
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
    console.log(`Looking for product with slug: ${slug}`);
    
    // Solo permitir acceso a productos en la lista permitida
    if (!ALLOWED_PRODUCT_SLUGS.includes(slug)) {
      console.log(`Slug ${slug} not in allowed list`);
      return undefined;
    }
    
    // Buscar en los datos embebidos
    const product = PRODUCT_DATA.find(item => item.slug === slug);
    
    if (!product) {
      console.log(`Product with slug ${slug} not found in data`);
      return undefined;
    }
    
    console.log(`Found product: ${product.name}`);
    
    // Convertir a formato ChassisModel
    const model = {
      id: 1, // Use 1 as default ID
      name: product.name,
      nameEs: product.nameEs,
      slug: product.slug,
      conditionId: product.conditionId,
      manufacturer: product.manufacturer,
      size: product.size,
      axleConfig: product.axleConfig,
      description: product.description,
      descriptionEs: product.descriptionEs,
      imageUrl: product.imageUrl,
      additionalImages: product.additionalImages || [],
      overallLength: product.overallLength,
      overallWidth: product.overallWidth,
      overallHeight: null,
      fifthWheelHeight: product.fifthWheelHeight,
      rearDeckHeight: product.rearDeckHeight,
      kingpinLocation: product.kingpinLocation || null,
      landingGearLocation: product.landingGearLocation || null,
      axleSpread: product.axleSpread,
      tareWeight: product.tareWeight,
      payload: product.payload,
      gvwr: null,
      frameComponents: product.frameComponents,
      suspensionDetails: product.suspensionDetails,
      brakeSystemDetails: product.brakeSystemDetails,
      electricalDetails: product.electricalDetails,
      additionalEquipment: product.additionalEquipment,
      featured: product.featured,
      sortOrder: product.sortOrder
    };
    
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

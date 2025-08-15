import type { InsertChassisModel } from '../shared/schema';

// Real chassis data extracted from the specification files
export const newChassisData: InsertChassisModel[] = [
  {
    name: "20/40' 12 Pins Triaxle Container Chassis",
    nameEs: "Chasis Contenedor Triaxial 20/40' 12 Pines",
    slug: "20-40-12-pins-triaxle-container-chassis",
    conditionId: 1, // New
    manufacturer: "AXN",
    size: "20-40ft",
    axleConfig: "Triaxle",
    description: "Versatile triaxle container chassis designed for 20' and 40' containers with 12-pin configuration and hydraulic locking system.",
    descriptionEs: "Chasis contenedor triaxial versátil diseñado para contenedores de 20' y 40' con configuración de 12 pines y sistema de bloqueo hidráulico.",
    imageUrl: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&h=400&fit=crop",
    additionalImages: [
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=600&h=400&fit=crop"
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
    sortOrder: 1
  },
  {
    name: "40FT Gooseneck with Genset",
    nameEs: "Chasis Gooseneck 40FT con Generador",
    slug: "40ft-gooseneck-with-genset",
    conditionId: 1, // New
    manufacturer: "SAF Holland",
    size: "40ft",
    axleConfig: "Tandem",
    description: "Heavy-duty 40-foot gooseneck chassis equipped with generator set for specialized container transportation needs.",
    descriptionEs: "Chasis gooseneck de servicio pesado de 40 pies equipado con generador para necesidades especializadas de transporte de contenedores.",
    imageUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&h=400&fit=crop",
    additionalImages: [
      "https://images.unsplash.com/photo-1558717097-ea7caadc8ed7?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&h=400&fit=crop",
      "/attached_assets/40_Gooseneck_4.jpg",
      "/attached_assets/40_Gooseneck_5.jpg"
    ],
    overallLength: "40'-11''",
    overallWidth: "96''",
    fifthWheelHeight: "48±1''",
    rearDeckHeight: "48±1''",
    kingpinLocation: "30'' (From rear face of front bolster)",
    landingGearLocation: "100'' (From the kingpin center)",
    axleSpread: "49''",
    tareWeight: "6,600 lbs ±2% (exclude Genset weight)",
    payload: "67,200 lbs (30,480kgs)",
    frameComponents: [
      "Main Beam: WI209lb/ft hot-rolled H-beam, ASTM A572 Grade 50",
      "Cross Member: 3/16'' thick x 3'' wide x 9'' deep channel",
      "GN Member: 5-1/4'' deep×4'' wide hot-rolled H-beam",
      "Upper Coupler: 1/4'' pick up plate with JOST 2'' diameter kingpin",
      "Front Bolster: 8'' wide x 10'' high ×1/4'' thick open section"
    ],
    suspensionDetails: [
      "HUTCH H9700 mechanical tandem suspension",
      "Overslung configuration with CASC high-arch 3-leaf spring",
      "Pre-painted BLACK color"
    ],
    brakeSystemDetails: [
      "SAF Holland York axles with Q+ 16.5''×7'' 4515Q brake",
      "HALDEX 6.0'' automatic slack adjusters",
      "ABS ready front, non-ABS rear configuration"
    ],
    electricalDetails: [
      "PHILLIPS mold seal wiring harness",
      "OPTRONICS LED lights with theft proof design",
      "PHILLIPS 16-724 plastic receptacle with split pins"
    ],
    additionalEquipment: [
      "SAF-HOLLAND ATLAS65 with 65,000 lbs capacity landing gear",
      "WESTLAKE 11R22.5-14PR tubeless tires",
      "SUNRISE 22.5×8.25 10-stud hub-piloted wheels",
      "Generator set unit equipped",
      "TPC 30''×24''×1/4'' Black PVC mud flaps"
    ],
    featured: true,
    sortOrder: 2
  },
  {
    name: "45ft Multimodal Chassis",
    nameEs: "Chasis Multimodal 45ft",
    slug: "45ft-multimodal-chassis",
    conditionId: 1, // New
    manufacturer: "JOST",
    size: "45ft",
    axleConfig: "Tridem",
    description: "Specialized 45-foot multimodal chassis designed for efficient intermodal transportation with enhanced load capacity.",
    descriptionEs: "Chasis multimodal especializado de 45 pies diseñado para transporte intermodal eficiente con capacidad de carga mejorada.",
    imageUrl: "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?w=600&h=400&fit=crop",
    additionalImages: [
      "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&h=400&fit=crop"
    ],
    overallLength: "45'-2 33/64'' (13780 mm)",
    overallWidth: "98'' (2490 mm)",
    overallHeight: "59'' (1493 mm)",
    fifthWheelHeight: "46''±1'' (1170 mm)",
    rearDeckHeight: "56''±1'' (1436 mm)",
    kingpinLocation: "33'' (830 mm)",
    axleSpread: "52'' (1310 mm)",
    tareWeight: "14,991 lbs (±2%) (6800 kg)",
    payload: "66,139 lbs (30000 kg)",
    gvwr: "81,130 lbs (36800 kg)",
    frameComponents: [
      "Main Beam: Fabricated H-beam H420x140x14x6x14mm, ASTM A572 Grade 50",
      "Cross Member: 'U' channel, width 3.1'' x height 1.6'' x thick 1/6''",
      "Front Bolster: 1/5 inches thick x 7 inches height x 8.7 inches width",
      "Rear Bolster: 1/5 inches thick x 7 inches height x 8.7 inches width",
      "King Pin: Welding 2 inches, JOST Brand"
    ],
    suspensionDetails: [
      "ZY brand with 22,046 lbs capacity",
      "Mechanical tridem suspension with 3 leaf springs"
    ],
    brakeSystemDetails: [
      "KORMEE ABS system",
      "Dual line trailer brake system",
      "Sealco valve, 30/30 brake chamber"
    ],
    electricalDetails: [
      "LED lighting system, 12V",
      "Phillips brand electric socket"
    ],
    additionalEquipment: [
      "JOST Brand landing gear, 61,729 lbs capacity",
      "DRC 11R22.5 16 PR tires",
      "8.25×22.5, 10 holes ISO rims",
      "Standard marking and rubber mud flap"
    ],
    featured: true,
    sortOrder: 3
  },
  {
    name: "20' SL Tandem Container Chassis",
    nameEs: "Chasis Contenedor Tandem 20' SL",
    slug: "20-sl-tandem-container-chassis",
    conditionId: 1, // New
    manufacturer: "AXN",
    size: "20ft",
    axleConfig: "Tandem",
    description: "Lightweight tandem axle chassis specifically designed for 20-foot containers with superior maneuverability.",
    descriptionEs: "Chasis tándem ligero específicamente diseñado para contenedores de 20 pies con maniobrabilidad superior.",
    imageUrl: "https://images.unsplash.com/photo-1551708297-7a8b264c6e27?w=600&h=400&fit=crop",
    additionalImages: [
      "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop"
    ],
    overallLength: "31'-6''",
    overallWidth: "96''",
    fifthWheelHeight: "47±1''",
    rearDeckHeight: "48±1''",
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
    sortOrder: 4
  },
  {
    name: "20/40/45' Extendable Triaxle Container Chassis",
    nameEs: "Chasis Contenedor Triaxial Extensible 20/40/45'",
    slug: "20-40-45-extendable-triaxle-container-chassis",
    conditionId: 1, // New
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
    sortOrder: 5
  },
  {
    name: "20/40' Extendable Tandem Container Chassis",
    nameEs: "Chasis Contenedor Tándem Extensible 20/40'",
    slug: "20-40-extendable-tandem-container-chassis",
    conditionId: 1, // New
    manufacturer: "FlexFrame",
    size: "20-40ft",
    axleConfig: "Tandem",
    description: "Efficient extendable tandem chassis for 20' and 40' containers with reliable extension mechanism and superior fuel economy.",
    descriptionEs: "Chasis tándem extensible eficiente para contenedores de 20' y 40' con mecanismo de extensión confiable y economía de combustible superior.",
    imageUrl: "https://images.unsplash.com/photo-1519648023493-d82b5f8d7b8a?w=600&h=400&fit=crop",
    additionalImages: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop"
    ],
    overallLength: "31'-7'' (retracted) to 40'-11'' (extended)",
    overallWidth: "96''",
    fifthWheelHeight: "47±1''",
    rearDeckHeight: "48±1''",
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
    sortOrder: 6
  },
  {
    name: "20'/40'/45' COMBO TRIDEM",
    nameEs: "20'/40'/45' COMBO TRIDEM",
    slug: "20-40-45-combo-tridem",
    conditionId: 1, // New
    manufacturer: "AXN",
    size: "20-40-45ft",
    axleConfig: "Tridem",
    description: "High-strength tridem chassis designed for stevedoring and transporting 20', 40', and 45' containers with 100Kpsi materials and advanced suspension system.",
    descriptionEs: "Chasis tridem de alta resistencia diseñado para estiba y transporte de contenedores de 20', 40' y 45' con materiales de 100Kpsi y sistema de suspensión avanzado.",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
    additionalImages: [
      "https://images.unsplash.com/photo-1519648023493-d82b5f8d7b8a?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&h=400&fit=crop"
    ],
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
    sortOrder: 7
  }
];

// Sample used chassis data for demonstration
export const usedChassisData: InsertChassisModel[] = [
  {
    name: "Used 40' Gooseneck Chassis - Refurbished",
    nameEs: "Chasis Gooseneck 40' Usado - Reacondicionado",
    slug: "used-40-gooseneck-chassis-refurbished",
    conditionId: 2, // Used
    manufacturer: "Various",
    size: "40ft",
    axleConfig: "Tandem",
    description: "Quality pre-owned 40' gooseneck chassis, fully inspected and refurbished to meet safety standards.",
    descriptionEs: "Chasis gooseneck de 40' de calidad pre-owned, completamente inspeccionado y reacondicionado para cumplir estándares de seguridad.",
    imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&h=400&fit=crop",
    additionalImages: [
      "https://images.unsplash.com/photo-1519648023493-d82b5f8d7b8a?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop"
    ],
    overallLength: "40'-11''",
    overallWidth: "96''",
    tareWeight: "Varies by unit",
    payload: "Up to 67,000 lbs",
    frameComponents: [
      "Inspected main beam structure",
      "Refurbished bolster assemblies",
      "Tested connection points"
    ],
    suspensionDetails: [
      "Inspected suspension components",
      "Replaced wear items as needed"
    ],
    brakeSystemDetails: [
      "Fully serviced brake system",
      "New brake components where required",
      "DOT inspection certified"
    ],
    electricalDetails: [
      "Updated lighting system",
      "Tested wiring harness",
      "Compliant electrical components"
    ],
    additionalEquipment: [
      "Serviced landing gear",
      "Quality used tires or new as specified",
      "Full safety inspection included"
    ],
    featured: false,
    sortOrder: 1
  }
];
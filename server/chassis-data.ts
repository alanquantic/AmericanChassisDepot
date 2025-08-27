import type { InsertChassisModel } from '../shared/schema';

// Real chassis data extracted from the specification files
export const newChassisData: InsertChassisModel[] = [
  {
    name: "20/40' 12 Pins Triaxle Container Chassis",
    nameEs: "Chasis Contenedor Triaxial 20/40' 12 Pines",
    slug: "20-40-12-pins-triaxle",
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
    slug: "40ft-gooseneck-genset",
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
    slug: "45ft-multimodal-esp",
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
    slug: "20-sl-tandem",
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
    slug: "20-40-45-extendable-triaxle",
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
    slug: "20-40-extendable-tandem",
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
    slug: "20-40-45-combo-tandem",
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
  },
  {
    name: "40' GN Tandem",
    nameEs: "40' GN Tandem",
    slug: "40ft-gn-tandem",
    conditionId: 1, // New
    manufacturer: "AXN",
    size: "40ft",
    axleConfig: "Tandem",
    description: "Heavy-duty 40-foot gooseneck tandem chassis designed for reliable container transportation with superior stability and load capacity.",
    descriptionEs: "Chasis gooseneck tándem de servicio pesado de 40 pies diseñado para transporte confiable de contenedores con estabilidad superior y capacidad de carga.",
    imageUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&h=400&fit=crop",
    additionalImages: [
      "https://images.unsplash.com/photo-1558717097-ea7caadc8ed7?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&h=400&fit=crop"
    ],
    overallLength: "40'-11''",
    overallWidth: "96''",
    fifthWheelHeight: "48±1''",
    rearDeckHeight: "48±1''",
    kingpinLocation: "30'' (From rear face of front bolster)",
    landingGearLocation: "100'' (From the kingpin center)",
    axleSpread: "49''",
    tareWeight: "6,600 lbs ±2%",
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
    featured: false,
    sortOrder: 8
  },
  {
    name: "20' SL Tandem Extended Version",
    nameEs: "Chasis Tándem 20' SL Versión Extendida",
    slug: "20-sl-tandem-extended",
    conditionId: 1, // New
    manufacturer: "AXN",
    size: "20ft",
    axleConfig: "Tandem",
    description: "Extended version of the 20' SL tandem chassis with enhanced features and capabilities.",
    descriptionEs: "Versión extendida del chasis tándem 20' SL con características y capacidades mejoradas.",
    imageUrl: "/assets/20-sl-tandem.webp",
    additionalImages: [
      "/assets/20_SL_Tandem_2.jpg",
      "/assets/20_SL_Tandem_3.jpg"
    ],
    overallLength: "32'-6''",
    overallWidth: "96''",
    fifthWheelHeight: "47±1''",
    rearDeckHeight: "48±1''",
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
    sortOrder: 9
  },
  {
    name: "20/40 Extendable Tandem Container Chassis With PSI",
    nameEs: "Chasis Contenedor Tándem Extensible 20/40 con PSI",
    slug: "20-40-extendable-tandem-psi",
    conditionId: 1, // New
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
    sortOrder: 10
  },
  {
    name: "20/40' Slider 12pins Container Chassis Tandem",
    nameEs: "Chasis Contenedor Tándem 20/40' Slider 12 Pines",
    slug: "20-40-slider-12pins-tandem",
    conditionId: 1, // New
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
    sortOrder: 11
  },
  {
    name: "20ft ISO Tank Container Chassis",
    nameEs: "Chasis Contenedor ISO Tank 20ft",
    slug: "20ft-iso-tank-container-chassis",
    conditionId: 1, // New
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
    sortOrder: 12
  },
  {
    name: "33' Slider Tri-Axle Container Chassis",
    nameEs: "Chasis Contenedor Triaxial Slider 33'",
    slug: "33ft-slider-tri-axle",
    conditionId: 1, // New
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
    sortOrder: 13
  },
  {
    name: "40ft Lightweight Four-Axle Chassis",
    nameEs: "Chasis Cuatro Ejes Ligero 40ft",
    slug: "40ft-lightweight-four-axle",
    conditionId: 1, // New
    manufacturer: "AXN",
    size: "40ft",
    axleConfig: "Four-Axle",
    description: "Lightweight four-axle chassis designed for maximum payload capacity with reduced tare weight.",
    descriptionEs: "Chasis de cuatro ejes ligero diseñado para máxima capacidad de carga con peso tara reducido.",
    imageUrl: "/assets/40ft-lightweight-four-axle.webp",
    additionalImages: [],
    overallLength: "40'-11''",
    overallWidth: "96''",
    fifthWheelHeight: "47±1''",
    rearDeckHeight: "48±1''",
    axleSpread: "61''+61''+61''",
    tareWeight: "12,800 lbs ±2%",
    payload: "80,200 lbs",
    frameComponents: [
      "Lightweight four-axle main beam",
      "Optimized bolster assemblies",
      "Enhanced connection points",
      "Weight-reduced structure"
    ],
    suspensionDetails: [
      "Four-axle lightweight suspension",
      "Optimized load distribution",
      "Enhanced stability control"
    ],
    brakeSystemDetails: [
      "Four-axle ABS brake system",
      "Advanced brake distribution",
      "Enhanced brake monitoring"
    ],
    electricalDetails: [
      "Advanced LED lighting",
      "Enhanced wiring harness",
      "Integrated control systems"
    ],
    additionalEquipment: [
      "Four-axle landing gear",
      "Lightweight tire package",
      "Enhanced monitoring system",
      "Comprehensive safety features"
    ],
    featured: false,
    sortOrder: 14
  },
  {
    name: "40/45 Extendable Container Chassis",
    nameEs: "Chasis Contenedor Extensible 40/45",
    slug: "40-45-extendable",
    conditionId: 1, // New
    manufacturer: "FlexFrame",
    size: "40-45ft",
    axleConfig: "Extendable Tandem",
    description: "Versatile extendable chassis accommodating 40' and 45' containers with advanced extension system.",
    descriptionEs: "Chasis extensible versátil que acomoda contenedores de 40' y 45' con sistema de extensión avanzado.",
    imageUrl: "/assets/40-45-extendable-container.webp",
    additionalImages: [
      "/assets/40_45_Extendable_2.jpg",
      "/assets/40_45_Extendable_3.jpg",
      "/assets/40_45_Extendable_4.jpg",
      "/assets/40_45_Extendable_5.jpg"
    ],
    overallLength: "40'-11'' (retracted) to 45'-2'' (extended)",
    overallWidth: "96''",
    fifthWheelHeight: "47±1''",
    rearDeckHeight: "48±1''",
    axleSpread: "54''",
    tareWeight: "10,500 lbs ±2%",
    payload: "Up to 72,500 lbs",
    frameComponents: [
      "Extendable main beam design",
      "Advanced extension mechanism",
      "Enhanced bolster assemblies",
      "Integrated locking system"
    ],
    suspensionDetails: [
      "Extendable tandem suspension",
      "Advanced load-leveling capability",
      "Enhanced stability control"
    ],
    brakeSystemDetails: [
      "Advanced ABS brake system",
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
    featured: false,
    sortOrder: 15
  },
  {
    name: "40/45/48/53' Extendable Triaxle Container Chassis",
    nameEs: "Chasis Contenedor Triaxial Extensible 40/45/48/53'",
    slug: "40-45-48-53-extendable-triaxle",
    conditionId: 1, // New
    manufacturer: "Multi-Config",
    size: "40-53ft",
    axleConfig: "Triaxle",
    description: "Ultra-versatile extendable triaxle chassis for 40', 45', 48', and 53' containers with advanced hydraulic system.",
    descriptionEs: "Chasis triaxial extensible ultra versátil para contenedores de 40', 45', 48' y 53' con sistema hidráulico avanzado.",
    imageUrl: "/assets/40-45-48-53-extendable-triaxle.webp",
    additionalImages: [],
    overallLength: "40'-11'' (retracted) to 53'-0'' (extended)",
    overallWidth: "96''",
    fifthWheelHeight: "47±1''",
    rearDeckHeight: "48±1''",
    axleSpread: "61''+61''",
    tareWeight: "13,500 lbs ±2%",
    payload: "Up to 79,500 lbs",
    frameComponents: [
      "Ultra-extendable main beam",
      "Advanced hydraulic extension",
      "Enhanced bolster assemblies",
      "Multi-position locking system"
    ],
    suspensionDetails: [
      "Extendable triaxle suspension",
      "Advanced load-leveling capability",
      "Enhanced stability control"
    ],
    brakeSystemDetails: [
      "Advanced ABS brake system",
      "Electronic brake distribution",
      "Premium brake components"
    ],
    electricalDetails: [
      "Advanced LED lighting system",
      "Multi-configuration wiring harness",
      "Electronic extension controls"
    ],
    additionalEquipment: [
      "Advanced hydraulic extension system",
      "Multi-position container locks",
      "Heavy-duty landing gear",
      "Advanced tire monitoring system"
    ],
    featured: false,
    sortOrder: 16
  },
  {
    name: "40FT Gooseneck Triaxle",
    nameEs: "Chasis Cuello de Ganso Triaxial 40FT",
    slug: "40ft-gooseneck-triaxle",
    conditionId: 1, // New
    manufacturer: "AXN",
    size: "40ft",
    axleConfig: "Triaxle",
    description: "Heavy-duty 40-foot gooseneck triaxle chassis for specialized container transportation with enhanced stability.",
    descriptionEs: "Chasis cuello de ganso triaxial de servicio pesado de 40 pies para transporte especializado de contenedores con estabilidad mejorada.",
    imageUrl: "/assets/40ft-gooseneck-triaxle.webp",
    additionalImages: [],
    overallLength: "40'-11''",
    overallWidth: "96''",
    fifthWheelHeight: "48±1''",
    rearDeckHeight: "48±1''",
    axleSpread: "61''+61''",
    tareWeight: "11,800 lbs ±2%",
    payload: "71,200 lbs",
    frameComponents: [
      "Gooseneck triaxle main beam",
      "Enhanced bolster assemblies",
      "Heavy-duty connection points",
      "Reinforced structure"
    ],
    suspensionDetails: [
      "Gooseneck triaxle suspension",
      "Enhanced load distribution",
      "Advanced stability control"
    ],
    brakeSystemDetails: [
      "Triaxle ABS brake system",
      "Advanced brake distribution",
      "Enhanced brake monitoring"
    ],
    electricalDetails: [
      "Advanced LED lighting",
      "Enhanced wiring harness",
      "Integrated control systems"
    ],
    additionalEquipment: [
      "Triaxle landing gear",
      "Advanced tire package",
      "Enhanced monitoring system",
      "Comprehensive safety features"
    ],
    featured: false,
    sortOrder: 17
  },
  {
    name: "40ft Gooseneck Lightweight",
    nameEs: "Chasis Cuello de Ganso Ligero 40ft",
    slug: "40ft-gooseneck-lightweight",
    conditionId: 1, // New
    manufacturer: "AXN",
    size: "40ft",
    axleConfig: "Tandem",
    description: "Lightweight 40-foot gooseneck chassis designed for maximum payload capacity with reduced tare weight.",
    descriptionEs: "Chasis cuello de ganso ligero de 40 pies diseñado para máxima capacidad de carga con peso tara reducido.",
    imageUrl: "/assets/40ft-gooseneck-lightweight.webp",
    additionalImages: [],
    overallLength: "40'-11''",
    overallWidth: "96''",
    fifthWheelHeight: "48±1''",
    rearDeckHeight: "48±1''",
    axleSpread: "49''",
    tareWeight: "6,200 lbs ±2%",
    payload: "67,800 lbs",
    frameComponents: [
      "Lightweight gooseneck main beam",
      "Optimized bolster assemblies",
      "Weight-reduced connection points",
      "Enhanced structure"
    ],
    suspensionDetails: [
      "Lightweight gooseneck suspension",
      "Optimized load distribution",
      "Enhanced stability control"
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
      "Standard landing gear",
      "Lightweight tire package",
      "Standard monitoring system",
      "DOT compliance package"
    ],
    featured: false,
    sortOrder: 18
  },
  {
    name: "40′ GN Lightweight – 4 Axles",
    nameEs: "Chasis GN Ligero – 4 Ejes",
    slug: "40-gn-lightweight-4-axles",
    conditionId: 1, // New
    manufacturer: "AXN",
    size: "40ft",
    axleConfig: "Gooseneck Triaxle",
    description: "Lightweight four-axle gooseneck chassis for maximum payload capacity with enhanced stability.",
    descriptionEs: "Chasis cuello de ganso de cuatro ejes ligero para máxima capacidad de carga con estabilidad mejorada.",
    imageUrl: "/assets/og-image.jpg",
    additionalImages: [],
    overallLength: "40'-11''",
    overallWidth: "96''",
    fifthWheelHeight: "48±1''",
    rearDeckHeight: "48±1''",
    axleSpread: "61''+61''+61''",
    tareWeight: "13,200 lbs ±2%",
    payload: "79,800 lbs",
    frameComponents: [
      "Lightweight four-axle gooseneck main beam",
      "Optimized bolster assemblies",
      "Weight-reduced connection points",
      "Enhanced structure"
    ],
    suspensionDetails: [
      "Lightweight four-axle gooseneck suspension",
      "Optimized load distribution",
      "Enhanced stability control"
    ],
    brakeSystemDetails: [
      "Four-axle ABS brake system",
      "Advanced brake distribution",
      "Enhanced brake monitoring"
    ],
    electricalDetails: [
      "Advanced LED lighting",
      "Enhanced wiring harness",
      "Integrated control systems"
    ],
    additionalEquipment: [
      "Four-axle landing gear",
      "Lightweight tire package",
      "Enhanced monitoring system",
      "Comprehensive safety features"
    ],
    featured: false,
    sortOrder: 19
  },
  {
    name: "53' GN Slider Tandem",
    nameEs: "Chasis GN Slider Tándem 53'",
    slug: "53-gn-slider-tandem",
    conditionId: 1, // New
    manufacturer: "AXN",
    size: "53ft",
    axleConfig: "Gooseneck Tandem",
    description: "Heavy-duty 53-foot gooseneck slider tandem chassis for specialized container transportation.",
    descriptionEs: "Chasis cuello de ganso slider tándem de servicio pesado de 53 pies para transporte especializado de contenedores.",
    imageUrl: "/assets/53-gn-slider-tandem.webp",
    additionalImages: [],
    overallLength: "53'-0''",
    overallWidth: "96''",
    fifthWheelHeight: "48±1''",
    rearDeckHeight: "48±1''",
    axleSpread: "49''",
    tareWeight: "7,800 lbs ±2%",
    payload: "75,200 lbs",
    frameComponents: [
      "53ft gooseneck slider main beam",
      "Enhanced bolster assemblies",
      "Heavy-duty connection points",
      "Reinforced structure"
    ],
    suspensionDetails: [
      "Gooseneck slider tandem suspension",
      "Enhanced load distribution",
      "Advanced stability control"
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
      "Standard landing gear",
      "Advanced tire package",
      "Standard monitoring system",
      "DOT compliance package"
    ],
    featured: false,
    sortOrder: 20
  },
  {
    name: "53' Gooseneck Slider Tandem Container Chassis",
    nameEs: "Chasis Contenedor Cuello de Ganso Slider Tándem 53'",
    slug: "53ft-gooseneck-slider-tandem",
    conditionId: 1, // New
    manufacturer: "AXN",
    size: "53ft",
    axleConfig: "Tandem",
    description: "Heavy-duty 53-foot gooseneck slider tandem container chassis for specialized transportation needs.",
    descriptionEs: "Chasis contenedor cuello de ganso slider tándem de servicio pesado de 53 pies para necesidades especializadas de transporte.",
    imageUrl: "/assets/53-gn-slider-tandem.webp",
    additionalImages: [],
    overallLength: "53'-0''",
    overallWidth: "96''",
    fifthWheelHeight: "48±1''",
    rearDeckHeight: "48±1''",
    axleSpread: "49''",
    tareWeight: "7,800 lbs ±2%",
    payload: "75,200 lbs",
    frameComponents: [
      "53ft gooseneck slider main beam",
      "Enhanced bolster assemblies",
      "Heavy-duty connection points",
      "Reinforced structure"
    ],
    suspensionDetails: [
      "Gooseneck slider tandem suspension",
      "Enhanced load distribution",
      "Advanced stability control"
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
      "Standard landing gear",
      "Advanced tire package",
      "Standard monitoring system",
      "DOT compliance package"
    ],
    featured: false,
    sortOrder: 21
  },
  {
    name: "20/40' 12 Pins Triaxle Container Chassis",
    nameEs: "Chasis Contenedor Triaxial 20/40' 12 Pines",
    slug: "20-40-12-pins-triaxle-esp",
    conditionId: 1, // New
    manufacturer: "AXN",
    size: "20-40ft",
    axleConfig: "Triaxle",
    description: "Heavy-duty triaxle container chassis with 12-pin configuration for versatile container handling.",
    descriptionEs: "Chasis contenedor triaxial de servicio pesado con configuración de 12 pines para manejo versátil de contenedores.",
    imageUrl: "/dist/assets/triaxle_20.webp",
    additionalImages: [
      "/dist/assets/triaxle_20_2.webp",
      "/dist/assets/triaxle_20_3.webp",
      "/dist/assets/triaxle_20_4.webp",
      "/dist/assets/triaxle_20_5.webp"
    ],
    overallLength: "31'-7'' (retracted) to 40'-11'' (extended)",
    overallWidth: "96''",
    fifthWheelHeight: "47±1''",
    rearDeckHeight: "48±1''",
    axleSpread: "61''+61''",
    tareWeight: "11,500 lbs ±2%",
    payload: "71,500 lbs",
    frameComponents: [
      "Triaxle main beam design",
      "12-pin connection system",
      "Enhanced bolster assemblies",
      "Heavy-duty connection points"
    ],
    suspensionDetails: [
      "Triaxle suspension system",
      "Enhanced load distribution",
      "Advanced stability control"
    ],
    brakeSystemDetails: [
      "Triaxle ABS brake system",
      "Advanced brake distribution",
      "Enhanced brake monitoring"
    ],
    electricalDetails: [
      "Advanced LED lighting",
      "Enhanced wiring harness",
      "Integrated control systems"
    ],
    additionalEquipment: [
      "Triaxle landing gear",
      "Advanced tire package",
      "Enhanced monitoring system",
      "Comprehensive safety features"
    ],
    featured: false,
    sortOrder: 22
  },
  {
    name: "20/40 Extendable Tandem Container Chassis",
    nameEs: "Chasis Contenedor Tándem Extensible 20/40",
    slug: "20-40-extendable-tandem-esp",
    conditionId: 1, // New
    manufacturer: "FlexFrame",
    size: "20-40ft",
    axleConfig: "Tandem",
    description: "Versatile extendable tandem chassis for 20' and 40' containers with advanced extension system.",
    descriptionEs: "Chasis tándem extensible versátil para contenedores de 20' y 40' con sistema de extensión avanzado.",
    imageUrl: "/assets/20-40-extendable-tandem.webp",
    additionalImages: [
      "/assets/20_40_Extendable_Tandem_2.jpg"
    ],
    overallLength: "31'-7'' (retracted) to 40'-11'' (extended)",
    overallWidth: "96''",
    fifthWheelHeight: "47±1''",
    rearDeckHeight: "48±1''",
    axleSpread: "54''",
    tareWeight: "10,200 lbs ±2%",
    payload: "Up to 70,800 lbs",
    frameComponents: [
      "Extendable main beam design",
      "Advanced extension mechanism",
      "Enhanced bolster assemblies",
      "Integrated locking system"
    ],
    suspensionDetails: [
      "Extendable tandem suspension",
      "Advanced load-leveling capability",
      "Enhanced stability control"
    ],
    brakeSystemDetails: [
      "Advanced ABS brake system",
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
    featured: false,
    sortOrder: 23
  },
  {
    name: "20/40 Extendable Tandem Container Chassis With PSI",
    nameEs: "Chasis Contenedor Tándem Extensible 20/40 con PSI",
    slug: "20-40-extendable-tandem-psi-esp",
    conditionId: 1, // New
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
    sortOrder: 24
  },
  {
    name: "20/40' Slider 12pins Container Chassis Tandem",
    nameEs: "Chasis Contenedor Tándem 20/40' Slider 12 Pines",
    slug: "20-40-slider-12pins-tandem-esp",
    conditionId: 1, // New
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
    sortOrder: 25
  },
  {
    name: "20/40' 12pins Triaxle Container Chassis",
    nameEs: "Chasis Contenedor Triaxial 20/40' 12 Pines",
    slug: "20-40-12pins-triaxle-esp",
    conditionId: 1, // New
    manufacturer: "AXN",
    size: "20-40ft",
    axleConfig: "Triaxle",
    description: "Heavy-duty triaxle container chassis with 12-pin configuration for versatile container handling.",
    descriptionEs: "Chasis contenedor triaxial de servicio pesado con configuración de 12 pines para manejo versátil de contenedores.",
    imageUrl: "/dist/assets/triaxle_20.webp",
    additionalImages: [
      "/dist/assets/triaxle_20_2.webp",
      "/dist/assets/triaxle_20_3.webp",
      "/dist/assets/triaxle_20_4.webp",
      "/dist/assets/triaxle_20_5.webp"
    ],
    overallLength: "31'-7'' (retracted) to 40'-11'' (extended)",
    overallWidth: "96''",
    fifthWheelHeight: "47±1''",
    rearDeckHeight: "48±1''",
    axleSpread: "61''+61''",
    tareWeight: "11,500 lbs ±2%",
    payload: "71,500 lbs",
    frameComponents: [
      "Triaxle main beam design",
      "12-pin connection system",
      "Enhanced bolster assemblies",
      "Heavy-duty connection points"
    ],
    suspensionDetails: [
      "Triaxle suspension system",
      "Enhanced load distribution",
      "Advanced stability control"
    ],
    brakeSystemDetails: [
      "Triaxle ABS brake system",
      "Advanced brake distribution",
      "Enhanced brake monitoring"
    ],
    electricalDetails: [
      "Advanced LED lighting",
      "Enhanced wiring harness",
      "Integrated control systems"
    ],
    additionalEquipment: [
      "Triaxle landing gear",
      "Advanced tire package",
      "Enhanced monitoring system",
      "Comprehensive safety features"
    ],
    featured: false,
    sortOrder: 26
  },
  {
    name: "20'/40'/45' COMBO TRIDEM",
    nameEs: "20'/40'/45' COMBO TRIDEM",
    slug: "20-40-45-combo-tandem-esp",
    conditionId: 1, // New
    manufacturer: "AXN",
    size: "20-45ft",
    axleConfig: "Tridem",
    description: "Versatile combo tridem chassis accommodating 20', 40', and 45' containers with advanced configuration.",
    descriptionEs: "Chasis combo tridem versátil que acomoda contenedores de 20', 40' y 45' con configuración avanzada.",
    imageUrl: "/assets/20-40-45-combo-tridem.webp",
    additionalImages: [],
    overallLength: "31'-7'' (retracted) to 45'-2'' (extended)",
    overallWidth: "96''",
    fifthWheelHeight: "47±1''",
    rearDeckHeight: "48±1''",
    axleSpread: "61''+61''+61''",
    tareWeight: "14,200 lbs ±2%",
    payload: "78,800 lbs",
    frameComponents: [
      "Combo tridem main beam",
      "Advanced extension mechanism",
      "Enhanced bolster assemblies",
      "Multi-position locking system"
    ],
    suspensionDetails: [
      "Combo tridem suspension",
      "Advanced load-leveling capability",
      "Enhanced stability control"
    ],
    brakeSystemDetails: [
      "Tridem ABS brake system",
      "Advanced brake distribution",
      "Enhanced brake monitoring"
    ],
    electricalDetails: [
      "Advanced LED lighting",
      "Enhanced wiring harness",
      "Integrated control systems"
    ],
    additionalEquipment: [
      "Tridem landing gear",
      "Advanced extension system",
      "Enhanced tire package",
      "Comprehensive monitoring"
    ],
    featured: false,
    sortOrder: 27
  },
  {
    name: "20/40/45' Extendable Triaxle Container Chassis",
    nameEs: "Chasis Contenedor Triaxial Extensible 20/40/45'",
    slug: "20-40-45-extendable-triaxle-esp",
    conditionId: 1, // New
    manufacturer: "Multi-Config",
    size: "20-45ft",
    axleConfig: "Triaxle",
    description: "Versatile extendable triaxle chassis for 20', 40', and 45' containers with advanced hydraulic system.",
    descriptionEs: "Chasis triaxial extensible versátil para contenedores de 20', 40' y 45' con sistema hidráulico avanzado.",
    imageUrl: "/assets/20-40-45-extendable-triaxle.webp",
    additionalImages: [],
    overallLength: "31'-7'' (retracted) to 45'-2'' (extended)",
    overallWidth: "96''",
    fifthWheelHeight: "47±1''",
    rearDeckHeight: "48±1''",
    axleSpread: "61''+61''",
    tareWeight: "12,500 lbs ±2%",
    payload: "70,500 lbs",
    frameComponents: [
      "Extendable triaxle main beam",
      "Advanced hydraulic extension",
      "Enhanced bolster assemblies",
      "Multi-position locking system"
    ],
    suspensionDetails: [
      "Extendable triaxle suspension",
      "Advanced load-leveling capability",
      "Enhanced stability control"
    ],
    brakeSystemDetails: [
      "Triaxle ABS brake system",
      "Advanced brake distribution",
      "Enhanced brake monitoring"
    ],
    electricalDetails: [
      "Advanced LED lighting",
      "Enhanced wiring harness",
      "Integrated control systems"
    ],
    additionalEquipment: [
      "Triaxle landing gear",
      "Advanced extension system",
      "Enhanced tire package",
      "Comprehensive monitoring"
    ],
    featured: false,
    sortOrder: 28
  },
  {
    name: "20ft ISO Tank Container Chassis",
    nameEs: "Chasis Contenedor ISO Tank 20ft",
    slug: "20ft-iso-tank-container-chassis-esp",
    conditionId: 1, // New
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
    sortOrder: 29
  },
  {
    name: "20ft Flushback Chassis",
    nameEs: "Chasis Flushback 20ft",
    slug: "20-flushback-chassis-esp",
    conditionId: 1, // New
    manufacturer: "AXN",
    size: "20ft",
    axleConfig: "Tandem",
    description: "Specialized flushback chassis designed for specific container applications with enhanced features.",
    descriptionEs: "Chasis flushback especializado diseñado para aplicaciones específicas de contenedores con características mejoradas.",
    imageUrl: "/assets/20-flushback-chassis.webp",
    additionalImages: [],
    overallLength: "31'-6''",
    overallWidth: "96''",
    fifthWheelHeight: "47±1''",
    rearDeckHeight: "48±1''",
    axleSpread: "54''",
    tareWeight: "8,000 lbs ±2%",
    payload: "59,000 lbs",
    frameComponents: [
      "Flushback main beam design",
      "Enhanced bolster assemblies",
      "Specialized connection points",
      "Reinforced structure"
    ],
    suspensionDetails: [
      "Flushback tandem suspension",
      "Enhanced stability design",
      "Load-specific configuration"
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
      "Standard landing gear",
      "Standard tire package",
      "Standard monitoring system",
      "DOT compliance package"
    ],
    featured: false,
    sortOrder: 30
  },
  {
    name: "33' Slider Tri-Axle Container Chassis",
    nameEs: "Chasis Contenedor Triaxial Slider 33'",
    slug: "33-slider-triaxle-esp",
    conditionId: 1, // New
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
    sortOrder: 31
  },
  {
    name: "40' Gooseneck Container Chassis",
    nameEs: "Chasis Contenedor Cuello de Ganso 40'",
    slug: "40-gooseneck-esp",
    conditionId: 1, // New
    manufacturer: "AXN",
    size: "40ft",
    axleConfig: "Tandem",
    description: "Heavy-duty 40-foot gooseneck tandem chassis designed for reliable container transportation with superior stability and load capacity.",
    descriptionEs: "Chasis gooseneck tándem de servicio pesado de 40 pies diseñado para transporte confiable de contenedores con estabilidad superior y capacidad de carga.",
    imageUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&h=400&fit=crop",
    additionalImages: [
      "https://images.unsplash.com/photo-1558717097-ea7caadc8ed7?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&h=400&fit=crop"
    ],
    overallLength: "40'-11''",
    overallWidth: "96''",
    fifthWheelHeight: "48±1''",
    rearDeckHeight: "48±1''",
    kingpinLocation: "30'' (From rear face of front bolster)",
    landingGearLocation: "100'' (From the kingpin center)",
    axleSpread: "49''",
    tareWeight: "6,600 lbs ±2%",
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
    featured: false,
    sortOrder: 32
  },
  {
    name: "40ft Lightweight Four-Axle Chassis",
    nameEs: "Chasis Cuatro Ejes Ligero 40ft",
    slug: "40-lightweight-four-axle-esp",
    conditionId: 1, // New
    manufacturer: "AXN",
    size: "40ft",
    axleConfig: "Four-Axle",
    description: "Lightweight four-axle chassis designed for maximum payload capacity with reduced tare weight.",
    descriptionEs: "Chasis de cuatro ejes ligero diseñado para máxima capacidad de carga con peso tara reducido.",
    imageUrl: "/assets/40ft-lightweight-four-axle.webp",
    additionalImages: [],
    overallLength: "40'-11''",
    overallWidth: "96''",
    fifthWheelHeight: "47±1''",
    rearDeckHeight: "48±1''",
    axleSpread: "61''+61''+61''",
    tareWeight: "12,800 lbs ±2%",
    payload: "80,200 lbs",
    frameComponents: [
      "Lightweight four-axle main beam",
      "Optimized bolster assemblies",
      "Enhanced connection points",
      "Weight-reduced structure"
    ],
    suspensionDetails: [
      "Four-axle lightweight suspension",
      "Optimized load distribution",
      "Enhanced stability control"
    ],
    brakeSystemDetails: [
      "Four-axle ABS brake system",
      "Advanced brake distribution",
      "Enhanced brake monitoring"
    ],
    electricalDetails: [
      "Advanced LED lighting",
      "Enhanced wiring harness",
      "Integrated control systems"
    ],
    additionalEquipment: [
      "Four-axle landing gear",
      "Lightweight tire package",
      "Enhanced monitoring system",
      "Comprehensive safety features"
    ],
    featured: false,
    sortOrder: 33
  },
  {
    name: "40/45 Extendable Container Chassis",
    nameEs: "Chasis Contenedor Extensible 40/45",
    slug: "40-45-extendable-container-chassis-esp",
    conditionId: 1, // New
    manufacturer: "FlexFrame",
    size: "40-45ft",
    axleConfig: "Extendable Tandem",
    description: "Versatile extendable chassis accommodating 40' and 45' containers with advanced extension system.",
    descriptionEs: "Chasis extensible versátil que acomoda contenedores de 40' y 45' con sistema de extensión avanzado.",
    imageUrl: "/assets/40-45-extendable-container.webp",
    additionalImages: [
      "/assets/40_45_Extendable_2.jpg",
      "/assets/40_45_Extendable_3.jpg",
      "/assets/40_45_Extendable_4.jpg",
      "/assets/40_45_Extendable_5.jpg"
    ],
    overallLength: "40'-11'' (retracted) to 45'-2'' (extended)",
    overallWidth: "96''",
    fifthWheelHeight: "47±1''",
    rearDeckHeight: "48±1''",
    axleSpread: "54''",
    tareWeight: "10,500 lbs ±2%",
    payload: "Up to 72,500 lbs",
    frameComponents: [
      "Extendable main beam design",
      "Advanced extension mechanism",
      "Enhanced bolster assemblies",
      "Integrated locking system"
    ],
    suspensionDetails: [
      "Extendable tandem suspension",
      "Advanced load-leveling capability",
      "Enhanced stability control"
    ],
    brakeSystemDetails: [
      "Advanced ABS brake system",
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
    featured: false,
    sortOrder: 34
  },
  {
    name: "40/45/48/53' Extendable Triaxle Container Chassis",
    nameEs: "Chasis Contenedor Triaxial Extensible 40/45/48/53'",
    slug: "40-45-48-53-extendable-triaxle-esp",
    conditionId: 1, // New
    manufacturer: "Multi-Config",
    size: "40-53ft",
    axleConfig: "Triaxle",
    description: "Ultra-versatile extendable triaxle chassis for 40', 45', 48', and 53' containers with advanced hydraulic system.",
    descriptionEs: "Chasis triaxial extensible ultra versátil para contenedores de 40', 45', 48' y 53' con sistema hidráulico avanzado.",
    imageUrl: "/assets/40-45-48-53-extendable-triaxle.webp",
    additionalImages: [],
    overallLength: "40'-11'' (retracted) to 53'-0'' (extended)",
    overallWidth: "96''",
    fifthWheelHeight: "47±1''",
    rearDeckHeight: "48±1''",
    axleSpread: "61''+61''",
    tareWeight: "13,500 lbs ±2%",
    payload: "Up to 79,500 lbs",
    frameComponents: [
      "Ultra-extendable main beam",
      "Advanced hydraulic extension",
      "Enhanced bolster assemblies",
      "Multi-position locking system"
    ],
    suspensionDetails: [
      "Extendable triaxle suspension",
      "Advanced load-leveling capability",
      "Enhanced stability control"
    ],
    brakeSystemDetails: [
      "Advanced ABS brake system",
      "Electronic brake distribution",
      "Premium brake components"
    ],
    electricalDetails: [
      "Advanced LED lighting system",
      "Multi-configuration wiring harness",
      "Electronic extension controls"
    ],
    additionalEquipment: [
      "Advanced hydraulic extension system",
      "Multi-position container locks",
      "Heavy-duty landing gear",
      "Advanced tire monitoring system"
    ],
    featured: false,
    sortOrder: 35
  },
  {
    name: "40ft Gooseneck Lightweight",
    nameEs: "Chasis Cuello de Ganso Ligero 40ft",
    slug: "40ft-gooseneck-lightweight-esp",
    conditionId: 1, // New
    manufacturer: "AXN",
    size: "40ft",
    axleConfig: "Tandem",
    description: "Lightweight 40-foot gooseneck chassis designed for maximum payload capacity with reduced tare weight.",
    descriptionEs: "Chasis cuello de ganso ligero de 40 pies diseñado para máxima capacidad de carga con peso tara reducido.",
    imageUrl: "/assets/40ft-gooseneck-lightweight.webp",
    additionalImages: [],
    overallLength: "40'-11''",
    overallWidth: "96''",
    fifthWheelHeight: "48±1''",
    rearDeckHeight: "48±1''",
    axleSpread: "49''",
    tareWeight: "6,200 lbs ±2%",
    payload: "67,800 lbs",
    frameComponents: [
      "Lightweight gooseneck main beam",
      "Optimized bolster assemblies",
      "Weight-reduced connection points",
      "Enhanced structure"
    ],
    suspensionDetails: [
      "Lightweight gooseneck suspension",
      "Optimized load distribution",
      "Enhanced stability control"
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
      "Standard landing gear",
      "Lightweight tire package",
      "Standard monitoring system",
      "DOT compliance package"
    ],
    featured: false,
    sortOrder: 36
  },
  {
    name: "40FT Gooseneck Triaxle",
    nameEs: "Chasis Cuello de Ganso Triaxial 40FT",
    slug: "40ft-gooseneck-triaxle-esp",
    conditionId: 1, // New
    manufacturer: "AXN",
    size: "40ft",
    axleConfig: "Triaxle",
    description: "Heavy-duty 40-foot gooseneck triaxle chassis for specialized container transportation with enhanced stability.",
    descriptionEs: "Chasis cuello de ganso triaxial de servicio pesado de 40 pies para transporte especializado de contenedores con estabilidad mejorada.",
    imageUrl: "/assets/40ft-gooseneck-triaxle.webp",
    additionalImages: [],
    overallLength: "40'-11''",
    overallWidth: "96''",
    fifthWheelHeight: "48±1''",
    rearDeckHeight: "48±1''",
    axleSpread: "61''+61''",
    tareWeight: "11,800 lbs ±2%",
    payload: "71,200 lbs",
    frameComponents: [
      "Gooseneck triaxle main beam",
      "Enhanced bolster assemblies",
      "Heavy-duty connection points",
      "Reinforced structure"
    ],
    suspensionDetails: [
      "Gooseneck triaxle suspension",
      "Enhanced load distribution",
      "Advanced stability control"
    ],
    brakeSystemDetails: [
      "Triaxle ABS brake system",
      "Advanced brake distribution",
      "Enhanced brake monitoring"
    ],
    electricalDetails: [
      "Advanced LED lighting",
      "Enhanced wiring harness",
      "Integrated control systems"
    ],
    additionalEquipment: [
      "Triaxle landing gear",
      "Advanced tire package",
      "Enhanced monitoring system",
      "Comprehensive safety features"
    ],
    featured: false,
    sortOrder: 37
  },
  {
    name: "40′ GN Lightweight – 4 Axles",
    nameEs: "Chasis GN Ligero – 4 Ejes",
    slug: "40-gn-lightweight-4-axles-esp",
    conditionId: 1, // New
    manufacturer: "AXN",
    size: "40ft",
    axleConfig: "Gooseneck Triaxle",
    description: "Lightweight four-axle gooseneck chassis for maximum payload capacity with enhanced stability.",
    descriptionEs: "Chasis cuello de ganso de cuatro ejes ligero para máxima capacidad de carga con estabilidad mejorada.",
    imageUrl: "/assets/og-image.jpg",
    additionalImages: [],
    overallLength: "40'-11''",
    overallWidth: "96''",
    fifthWheelHeight: "48±1''",
    rearDeckHeight: "48±1''",
    axleSpread: "61''+61''+61''",
    tareWeight: "13,200 lbs ±2%",
    payload: "79,800 lbs",
    frameComponents: [
      "Lightweight four-axle gooseneck main beam",
      "Optimized bolster assemblies",
      "Weight-reduced connection points",
      "Enhanced structure"
    ],
    suspensionDetails: [
      "Lightweight four-axle gooseneck suspension",
      "Optimized load distribution",
      "Enhanced stability control"
    ],
    brakeSystemDetails: [
      "Four-axle ABS brake system",
      "Advanced brake distribution",
      "Enhanced brake monitoring"
    ],
    electricalDetails: [
      "Advanced LED lighting",
      "Enhanced wiring harness",
      "Integrated control systems"
    ],
    additionalEquipment: [
      "Four-axle landing gear",
      "Lightweight tire package",
      "Enhanced monitoring system",
      "Comprehensive safety features"
    ],
    featured: false,
    sortOrder: 38
  },
  {
    name: "40' GN Tandem",
    nameEs: "Chasis GN Tándem 40'",
    slug: "40-gn-tandem-esp",
    conditionId: 1, // New
    manufacturer: "AXN",
    size: "40ft",
    axleConfig: "Tandem",
    description: "Heavy-duty 40-foot gooseneck tandem chassis for reliable container transportation.",
    descriptionEs: "Chasis gooseneck tándem de servicio pesado de 40 pies para transporte confiable de contenedores.",
    imageUrl: "/assets/40-gn-tandem.webp",
    additionalImages: [],
    overallLength: "40'-11''",
    overallWidth: "96''",
    fifthWheelHeight: "48±1''",
    rearDeckHeight: "48±1''",
    axleSpread: "49''",
    tareWeight: "6,600 lbs ±2%",
    payload: "67,200 lbs",
    frameComponents: [
      "Gooseneck tandem main beam",
      "Enhanced bolster assemblies",
      "Heavy-duty connection points",
      "Reinforced structure"
    ],
    suspensionDetails: [
      "Gooseneck tandem suspension",
      "Enhanced load distribution",
      "Advanced stability control"
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
      "Standard landing gear",
      "Standard tire package",
      "Standard monitoring system",
      "DOT compliance package"
    ],
    featured: false,
    sortOrder: 39
  },
  {
    name: "40FT Gooseneck with Genset",
    nameEs: "Chasis Gooseneck 40FT con Generador",
    slug: "40ft-gooseneck-genset-esp",
    conditionId: 1, // New
    manufacturer: "SAF Holland",
    size: "40ft",
    axleConfig: "Tandem",
    description: "Heavy-duty 40-foot gooseneck chassis with integrated genset for specialized applications requiring power generation.",
    descriptionEs: "Chasis gooseneck de servicio pesado de 40 pies con generador integrado para aplicaciones especializadas que requieren generación de energía.",
    imageUrl: "/assets/40ft-gooseneck-genset.webp",
    additionalImages: [],
    overallLength: "40'-11''",
    overallWidth: "96''",
    fifthWheelHeight: "48±1''",
    rearDeckHeight: "48±1''",
    axleSpread: "49''",
    tareWeight: "7,200 lbs ±2%",
    payload: "65,800 lbs",
    frameComponents: [
      "Gooseneck genset main beam",
      "Enhanced bolster assemblies",
      "Genset integration system",
      "Reinforced structure"
    ],
    suspensionDetails: [
      "Gooseneck genset suspension",
      "Enhanced load distribution",
      "Advanced stability control"
    ],
    brakeSystemDetails: [
      "Standard ABS brake system",
      "Reliable brake components",
      "Easy maintenance access"
    ],
    electricalDetails: [
      "Genset-compatible LED lighting",
      "Enhanced wiring harness",
      "Integrated power system"
    ],
    additionalEquipment: [
      "Integrated genset system",
      "Standard landing gear",
      "Standard tire package",
      "Comprehensive monitoring system"
    ],
    featured: false,
    sortOrder: 40
  },
  {
    name: "53' Gooseneck Slider Tandem",
    nameEs: "Chasis Cuello de Ganso Slider Tándem 53'",
    slug: "53-gooseneck-slider-tandem-esp",
    conditionId: 1, // New
    manufacturer: "AXN",
    size: "53ft",
    axleConfig: "Gooseneck Tandem",
    description: "Heavy-duty 53-foot gooseneck slider tandem chassis for specialized container transportation.",
    descriptionEs: "Chasis cuello de ganso slider tándem de servicio pesado de 53 pies para transporte especializado de contenedores.",
    imageUrl: "/assets/53-gn-slider-tandem.webp",
    additionalImages: [],
    overallLength: "53'-0''",
    overallWidth: "96''",
    fifthWheelHeight: "48±1''",
    rearDeckHeight: "48±1''",
    axleSpread: "49''",
    tareWeight: "7,800 lbs ±2%",
    payload: "75,200 lbs",
    frameComponents: [
      "53ft gooseneck slider main beam",
      "Enhanced bolster assemblies",
      "Heavy-duty connection points",
      "Reinforced structure"
    ],
    suspensionDetails: [
      "Gooseneck slider tandem suspension",
      "Enhanced load distribution",
      "Advanced stability control"
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
      "Standard landing gear",
      "Advanced tire package",
      "Standard monitoring system",
      "DOT compliance package"
    ],
    featured: false,
    sortOrder: 41
  },
  {
    name: "53' GN Tandem Intermodal",
    nameEs: "Chasis GN Tándem Intermodal 53'",
    slug: "53-gn-tandem-intermodal-esp",
    conditionId: 1, // New
    manufacturer: "AXN",
    size: "53ft",
    axleConfig: "Gooseneck Tandem",
    description: "Heavy-duty 53-foot gooseneck tandem intermodal chassis for specialized transportation needs.",
    descriptionEs: "Chasis gooseneck tándem intermodal de servicio pesado de 53 pies para necesidades especializadas de transporte.",
    imageUrl: "/assets/53-gn-tandem-intermodal.webp",
    additionalImages: [],
    overallLength: "53'-0''",
    overallWidth: "96''",
    fifthWheelHeight: "48±1''",
    rearDeckHeight: "48±1''",
    axleSpread: "49''",
    tareWeight: "7,800 lbs ±2%",
    payload: "75,200 lbs",
    frameComponents: [
      "53ft gooseneck intermodal main beam",
      "Enhanced bolster assemblies",
      "Heavy-duty connection points",
      "Reinforced structure"
    ],
    suspensionDetails: [
      "Gooseneck intermodal tandem suspension",
      "Enhanced load distribution",
      "Advanced stability control"
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
      "Standard landing gear",
      "Advanced tire package",
      "Standard monitoring system",
      "DOT compliance package"
    ],
    featured: false,
    sortOrder: 42
  },
  {
    name: "20ft Container Chassis 2 Axles",
    nameEs: "Chasis Contenedor 20ft 2 Ejes",
    slug: "20ft-container-chassis-2-axles-esp",
    conditionId: 1, // New
    manufacturer: "AXN",
    size: "20ft",
    axleConfig: "Tandem",
    description: "Standard 20-foot container chassis with 2-axle configuration for reliable container transportation.",
    descriptionEs: "Chasis contenedor estándar de 20 pies con configuración de 2 ejes para transporte confiable de contenedores.",
    imageUrl: "/assets/20ft-container-chassis-2-axles.webp",
    additionalImages: [],
    overallLength: "31'-6''",
    overallWidth: "96''",
    fifthWheelHeight: "47±1''",
    rearDeckHeight: "48±1''",
    axleSpread: "54''",
    tareWeight: "8,000 lbs ±2%",
    payload: "59,000 lbs",
    frameComponents: [
      "Standard 2-axle main beam",
      "Enhanced bolster assemblies",
      "Standard connection points",
      "Reinforced structure"
    ],
    suspensionDetails: [
      "Standard 2-axle tandem suspension",
      "Enhanced load distribution",
      "Standard stability control"
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
      "Standard landing gear",
      "Standard tire package",
      "Standard monitoring system",
      "DOT compliance package"
    ],
    featured: false,
    sortOrder: 43
  }
];

// Sample used chassis data for demonstration
export const usedChassisData: InsertChassisModel[] = [];
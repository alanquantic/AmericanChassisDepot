// Simple i18n system without React Context
let currentLanguage: 'en' | 'es' = 'en';
let listeners: (() => void)[] = [];

export const translations = {
  en: {
    // Navigation
    home: 'Home',
    products: 'Products', 
    about: 'About',
    contact: 'Contact',
    
    // Hero
    heroTitle: 'Premium Chassis Solutions for Every Need',
    heroSubtitle: 'Explore our wide selection of high-quality chassis from leading manufacturers in the industry',
    viewProducts: 'View Products',
    requestQuote: 'Request Quote',
    downloadBrochure: 'Download Brochure',
    downloadStartedTitle: 'Download Started',
    downloadStartedDesc: 'Your brochure is downloading now.',
    downloadFailedTitle: 'Download Failed',
    downloadFailedDesc: 'There was an error downloading the brochure. Please try again.',
    cancel: 'Cancel',
    downloading: 'Downloading...',
    download: 'Download',
    
    // Brands
    trustedBrands: 'Trusted Component Brands',
    
    // Products Section
    ourChassisTypes: 'Our Chassis Types',
    browseSelection: 'Browse our selection of high-quality new and used chassis options to find the perfect solution for your transportation needs.',
    
    // Contact Form
    fullName: 'Full Name',
    emailAddressLabel: 'Email Address',
    companyName: 'Company Name',
    phoneNumberLabel: 'Phone Number',
    interestedIn: 'Interested In',
    numberOfUnits: 'Number of Units',
    message: 'Message',
    sendMessage: 'Send Message',
    sending: 'Sending...',
    selectChassisType: 'Select chassis type',
    howManyUnits: 'How many units do you need?',
    
    // Condition labels
    new: 'New',
    used: 'Used',
    
    // Product section
    learnMore: 'Learn More',
    getQuote: 'Get Quote',
    viewDetails: 'View Details',
    getAQuote: 'Get a Quote',
    viewAllProducts: 'View All Products',
    noChassisFound: 'No chassis models found with the selected filters.',

    // Product details
    technicalSpecifications: 'Technical Specifications',
    overallLength: 'Overall Length',
    overallWidth: 'Overall Width',
    tareWeight: 'Tare Weight',
    payloadCapacity: 'Payload Capacity',
    axleSpread: 'Axle Spread',
    fifthWheelHeight: 'Fifth Wheel Height',
    frameComponentsTitle: 'Frame & Structural Components',
    suspensionSystemTitle: 'Suspension System',
    brakeSystemTitle: 'Brake System',
    electricalSystemTitle: 'Electrical System',
    additionalEquipmentTitle: 'Additional Equipment & Features',
    interestedInThisChassis: 'Interested in this Chassis?',
    contactUsPricingAvailability: 'Contact us for pricing, availability, or to schedule a consultation',
    
    // About Section
    aboutTitle: 'About American Chassis Depot',
    aboutDescription: 'With years of experience in the field, our team is committed to helping you find the perfect chassis solution for your specific needs. We take pride in our extensive inventory, competitive pricing, and exceptional customer service.',
    
    // Footer
    footerDescription: 'Your trusted source for premium chassis solutions from leading manufacturers.',
    quickLinks: 'Quick Links',
    contactInfo: 'Contact Info',
    allRightsReserved: 'All rights reserved.',
    
    // Contact Page
    contactUs: 'Contact Us',
    contactPageSubtitle: 'Have questions or need a quote? Our team is here to help you find the perfect chassis solution.',
    ourLocation: 'Our Location',
    phoneNumberSection: 'Phone Number',
    emailAddressSection: 'Email Address',
    callUsMonday: 'Call us Monday through Friday',
    respondWithin24: 'We\'ll respond within 24 hours',
    businessHours: 'Business Hours',
    sendUsAMessage: 'Send Us a Message',
    fillOutForm: 'Fill out the form below and one of our representatives will get back to you as soon as possible.',
    getAQuoteHero: 'Get a Quote',
    
    // Homepage Contact Section
    contactInformation: 'Contact Information',
    haveQuestionsOrNeedQuote: 'Have questions or need a quote? Reach out to our team using the contact information below or fill out the form.',
    
    // Business Advantages
    businessAdvantagesTitle: 'Business Advantages of Our Chassis',
    businessAdvantagesSubtitle: 'Discover how our premium chassis solutions can transform your transportation operations and drive business growth.',
    costEfficiencyTitle: 'Cost Efficiency',
    operationalExcellenceTitle: 'Operational Excellence',
    safetyComplianceTitle: 'Safety & Compliance',
    
    // Cost Efficiency benefits
    reducedMaintenanceCosts: 'Reduced maintenance costs with durable construction',
    extendedProductLifecycle: 'Extended product lifecycle provides better ROI',
    optimizedFuelEfficiency: 'Optimized fuel efficiency through lightweight design',
    minimizedDowntime: 'Minimized downtime for increased operational hours',
    
    // Operational Excellence benefits
    increasedLoadCapacity: 'Increased load capacity for maximized productivity',
    enhancedManeuverability: 'Enhanced maneuverability in tight spaces',
    versatileModels: 'Versatile models suitable for various cargo types',
    streamlinedProcesses: 'Streamlined loading and unloading processes',
    
    // Safety & Compliance benefits
    dotCompliance: 'Full compliance with DOT regulations and standards',
    advancedSafetyFeatures: 'Advanced safety features for cargo security',
    reducedAccidentRisk: 'Reduced risk of accidents with stable design',
    regularInspection: 'Regular inspection and certification programs',
    
    // Chassis Showcase
    chassisShowcaseTitle: 'Our Chassis Types',
    chassisShowcaseSubtitle: 'Browse our selection of high-quality new and used chassis options to find the perfect solution for your transportation needs.',
    viewModels: 'View Models',
    failedToLoadChassisTypes: 'Failed to load chassis types. Please try again later.',
    noChassisTypesAvailable: 'No chassis types available at the moment. Please check back later.',
    
    // Video Section
    videoQuote: 'Trusted transportation solutions that drive success for businesses across America.',
    videoQuoteAuthor: 'American Chassis Depot',
    partnerWithUs: 'Partner With Us',
    
    // FloatingButton
    callAriaLabel: 'Call American Chassis Depot',
    callTitle: 'Call us at +1 (442) 257-9946',
    emailAriaLabel: 'Send a message to American Chassis Depot',
    emailTitle: 'Contact us via email',
    
    // 404 Page
    pageNotFoundTitle: '404 Page Not Found',
    pageNotFoundDescription: 'The page you are looking for does not exist.',
    goHomeButton: 'Go Home',
    
    // Used Chassis Form
    usedChassisInquiry: 'Used Chassis Inquiry',
    usedChassisInquiryDescription: 'Complete the form below to inquire about our available used chassis. Our team will contact you shortly.',
    chassisType: 'Chassis Type',
    quantity: 'Quantity',
    usedChassisMessagePlaceholder: 'Describe your specific needs, cargo type, size requirements, etc.',
    sendInquiry: 'Send Inquiry',
    usedChassisInquirySent: 'Your used chassis inquiry has been sent. We will contact you soon.',
    failedToSendInquiry: 'Failed to send inquiry. Please try again.',
    
    // Form labels
    name: 'Name',
    email: 'Email',
    company: 'Company',
    phone: 'Phone',
    success: 'Success',
    error: 'Error',
    lang: 'en'
  },
  es: {
    // Navigation  
    home: 'Inicio',
    products: 'Productos',
    about: 'Acerca de', 
    contact: 'Contacto',
    
    // Hero
    heroTitle: 'Soluciones Premium de Chasis para Cada Necesidad',
    heroSubtitle: 'Explora nuestra amplia selección de chasis de alta calidad de los principales fabricantes de la industria',
    viewProducts: 'Ver Productos',
    requestQuote: 'Solicitar Cotización',
    downloadBrochure: 'Descargar Folleto',
    downloadStartedTitle: 'Descarga iniciada',
    downloadStartedDesc: 'Tu folleto se está descargando.',
    downloadFailedTitle: 'Fallo en la descarga',
    downloadFailedDesc: 'Ocurrió un error al descargar el folleto. Intenta nuevamente.',
    cancel: 'Cancelar',
    downloading: 'Descargando...',
    download: 'Descargar',
    
    // Brands
    trustedBrands: 'Marcas de Componentes de Confianza',
    
    // Products Section
    ourChassisTypes: 'Tipos de Chasis',
    browseSelection: 'Navega por nuestra selección de chasis nuevos y usados de alta calidad para encontrar la solución perfecta para tus necesidades de transporte.',
    
    // Contact Form
    fullName: 'Nombre Completo',
    emailAddressLabel: 'Dirección de Email',
    companyName: 'Nombre de la Empresa',
    phoneNumberLabel: 'Número de Teléfono',
    interestedIn: 'Interesado En',
    numberOfUnits: 'Número de Unidades',
    message: 'Mensaje',
    sendMessage: 'Enviar Mensaje',
    sending: 'Enviando...',
    selectChassisType: 'Selecciona tipo de chasis',
    howManyUnits: '¿Cuántas unidades necesitas?',
    
    // Condition labels
    new: 'Nuevo',
    used: 'Usado',
    
    // Product section
    learnMore: 'Saber Más',
    getQuote: 'Obtener Cotización',
    viewDetails: 'Ver Detalles',
    getAQuote: 'Obtener Cotización',
    viewAllProducts: 'Ver Todos los Productos',
    noChassisFound: 'No se encontraron modelos de chasis con los filtros seleccionados.',

    // Product details
    technicalSpecifications: 'Especificaciones Técnicas',
    overallLength: 'Longitud Total',
    overallWidth: 'Anchura Total',
    tareWeight: 'Peso de Tara',
    payloadCapacity: 'Carga Útil',
    axleSpread: 'Separación del Eje',
    fifthWheelHeight: 'Altura de la Quinta Rueda',
    frameComponentsTitle: 'Estructura y Componentes del Bastidor',
    suspensionSystemTitle: 'Sistema de Suspensión',
    brakeSystemTitle: 'Sistema de Frenos',
    electricalSystemTitle: 'Sistema Eléctrico',
    additionalEquipmentTitle: 'Equipo y Características Adicionales',
    interestedInThisChassis: '¿Interesado en este Chasis?',
    contactUsPricingAvailability: 'Contáctanos para precios, disponibilidad o para agendar una consulta',
    
    // About Section
    aboutTitle: 'Acerca de American Chassis Depot',
    aboutDescription: 'Con años de experiencia en el campo, nuestro equipo está comprometido a ayudarte a encontrar la solución de chasis perfecta para tus necesidades específicas. Nos enorgullecemos de nuestro extenso inventario, precios competitivos y servicio al cliente excepcional.',
    
    // Footer
    footerDescription: 'Tu fuente confiable para soluciones premium de chasis de fabricantes líderes.',
    quickLinks: 'Enlaces Rápidos',
    contactInfo: 'Información de Contacto',
    allRightsReserved: 'Todos los derechos reservados.',
    
    // Contact Page
    contactUs: 'Contáctanos',
    contactPageSubtitle: '¿Tienes preguntas o necesitas una cotización? Nuestro equipo está aquí para ayudarte a encontrar la solución de chasis perfecta.',
    ourLocation: 'Nuestra Ubicación',
    phoneNumberSection: 'Número de Teléfono',
    emailAddressSection: 'Dirección de Email',
    callUsMonday: 'Llámanos de lunes a viernes',
    respondWithin24: 'Responderemos dentro de 24 horas',
    businessHours: 'Horarios de Atención',
    sendUsAMessage: 'Envíanos un Mensaje',
    fillOutForm: 'Completa el formulario a continuación y uno de nuestros representantes se pondrá en contacto contigo lo antes posible.',
    getAQuoteHero: 'Obtener Cotización',
    
    // Homepage Contact Section
    contactInformation: 'Información de Contacto',
    haveQuestionsOrNeedQuote: '¿Tienes preguntas o necesitas una cotización? Comunícate con nuestro equipo usando la información de contacto a continuación o completa el formulario.',
    
    // Business Advantages
    businessAdvantagesTitle: 'Ventajas Comerciales de Nuestros Chasis',
    businessAdvantagesSubtitle: 'Descubre cómo nuestras soluciones premium de chasis pueden transformar tus operaciones de transporte e impulsar el crecimiento empresarial.',
    costEfficiencyTitle: 'Eficiencia de Costos',
    operationalExcellenceTitle: 'Excelencia Operacional',
    safetyComplianceTitle: 'Seguridad y Cumplimiento',
    
    // Cost Efficiency benefits
    reducedMaintenanceCosts: 'Costos de mantenimiento reducidos con construcción duradera',
    extendedProductLifecycle: 'Ciclo de vida extendido del producto proporciona mejor ROI',
    optimizedFuelEfficiency: 'Eficiencia de combustible optimizada a través de diseño ligero',
    minimizedDowntime: 'Tiempo de inactividad minimizado para aumentar horas operacionales',
    
    // Operational Excellence benefits
    increasedLoadCapacity: 'Mayor capacidad de carga para productividad maximizada',
    enhancedManeuverability: 'Maniobrabilidad mejorada en espacios reducidos',
    versatileModels: 'Modelos versátiles adecuados para varios tipos de carga',
    streamlinedProcesses: 'Procesos de carga y descarga optimizados',
    
    // Safety & Compliance benefits
    dotCompliance: 'Cumplimiento total con regulaciones y estándares DOT',
    advancedSafetyFeatures: 'Características de seguridad avanzadas para seguridad de la carga',
    reducedAccidentRisk: 'Riesgo reducido de accidentes con diseño estable',
    regularInspection: 'Programas regulares de inspección y certificación',
    
    // Chassis Showcase
    chassisShowcaseTitle: 'Tipos de Chasis',
    chassisShowcaseSubtitle: 'Navega por nuestra selección de opciones de chasis nuevos y usados de alta calidad para encontrar la solución perfecta para tus necesidades de transporte.',
    viewModels: 'Ver Modelos',
    failedToLoadChassisTypes: 'Error al cargar tipos de chasis. Por favor intenta de nuevo más tarde.',
    noChassisTypesAvailable: 'No hay tipos de chasis disponibles en este momento. Por favor vuelve más tarde.',
    
    // Video Section
    videoQuote: 'Soluciones de transporte confiables que impulsan el éxito de empresas en toda América.',
    videoQuoteAuthor: 'American Chassis Depot',
    partnerWithUs: 'Asóciate Con Nosotros',
    
    // FloatingButton
    callAriaLabel: 'Llamar a American Chassis Depot',
    callTitle: 'Llámanos al +1 (442) 257-9946',
    emailAriaLabel: 'Enviar mensaje a American Chassis Depot',
    emailTitle: 'Contáctanos por email',
    
    // 404 Page
    pageNotFoundTitle: '404 Página No Encontrada',
    pageNotFoundDescription: 'La página que buscas no existe.',
    goHomeButton: 'Ir al Inicio',
    
    // Used Chassis Form
    usedChassisInquiry: 'Consulta de Chasis Usados',
    usedChassisInquiryDescription: 'Complete el formulario a continuación para consultar sobre nuestros chasis usados disponibles. Nuestro equipo se pondrá en contacto con usted pronto.',
    chassisType: 'Tipo de Chasis',
    quantity: 'Cantidad',
    usedChassisMessagePlaceholder: 'Describa sus necesidades específicas, tipo de carga, requisitos de tamaño, etc.',
    sendInquiry: 'Enviar Consulta',
    usedChassisInquirySent: 'Su consulta sobre chasis usados ha sido enviada. Nos pondremos en contacto pronto.',
    failedToSendInquiry: 'Error al enviar la consulta. Por favor intente de nuevo.',
    
    // Form labels
    name: 'Nombre',
    email: 'Email',
    company: 'Empresa',
    phone: 'Teléfono',
    success: 'Éxito',
    error: 'Error',
    lang: 'es'
  }
};

export type Language = 'en' | 'es';
export type TranslationKey = keyof typeof translations.en;

// Get current language
export function getCurrentLanguage(): Language {
  return currentLanguage;
}

// Simple function to get current language for components
export function getLanguage(): Language {
  return currentLanguage;
}

// Set language and notify listeners
export function setLanguage(lang: Language) {
  currentLanguage = lang;
  listeners.forEach(listener => listener());
}

// Get translation
export function t(key: TranslationKey): string {
  return translations[currentLanguage]?.[key] || translations.en[key] || key;
}

// Subscribe to language changes
export function subscribeToLanguageChange(callback: () => void) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter(l => l !== callback);
  };
}

// Hook for React components
import { useState, useEffect } from 'react';

export function useLanguage() {
  const [language, setLanguageState] = useState(getCurrentLanguage());

  useEffect(() => {
    const unsubscribe = subscribeToLanguageChange(() => {
      setLanguageState(getCurrentLanguage());
    });
    return unsubscribe;
  }, []);

  const tFunction = (key: TranslationKey): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return {
    language,
    setLanguage,
    t: tFunction
  };
}
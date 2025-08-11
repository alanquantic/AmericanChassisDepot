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
    getAQuoteHero: 'Get a Quote'
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
    getAQuoteHero: 'Obtener Cotización'
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
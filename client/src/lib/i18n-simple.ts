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
    emailAddress: 'Email Address',
    companyName: 'Company Name',
    phoneNumber: 'Phone Number',
    interestedIn: 'Interested In',
    numberOfUnits: 'Number of Units',
    message: 'Message',
    sendMessage: 'Send Message',
    sending: 'Sending...',
    selectChassisType: 'Select chassis type',
    howManyUnits: 'How many units do you need?'
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
    emailAddress: 'Dirección de Email',
    companyName: 'Nombre de la Empresa',
    phoneNumber: 'Número de Teléfono',
    interestedIn: 'Interesado En',
    numberOfUnits: 'Número de Unidades',
    message: 'Mensaje',
    sendMessage: 'Enviar Mensaje',
    sending: 'Enviando...',
    selectChassisType: 'Selecciona tipo de chasis',
    howManyUnits: '¿Cuántas unidades necesitas?'
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
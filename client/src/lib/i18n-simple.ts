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
    trustedBrands: 'Trusted Component Brands'
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
    trustedBrands: 'Marcas de Componentes de Confianza'
  }
};

export type Language = 'en' | 'es';
export type TranslationKey = keyof typeof translations.en;

// Get current language
export function getCurrentLanguage(): Language {
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

  return {
    language,
    setLanguage,
    t
  };
}
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Translation data
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

// Context
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

// Provider component using React.createElement
export function LanguageProvider(props: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: TranslationKey): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const contextValue = { language, setLanguage, t };

  return React.createElement(
    LanguageContext.Provider,
    { value: contextValue },
    props.children
  );
}

// Hook
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
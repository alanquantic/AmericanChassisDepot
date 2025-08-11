import React, { createContext, useContext, useState, ReactNode } from 'react';

export const translations = {
  en: {
    // Navigation
    home: 'Home',
    products: 'Products',
    about: 'About',
    contact: 'Contact',
    
    // Hero Section
    heroTitle: 'Premium Chassis Solutions for Every Need',
    heroSubtitle: 'Explore our wide selection of high-quality chassis from leading manufacturers in the industry',
    viewProducts: 'View Products',
    requestQuote: 'Request Quote',
    getAQuote: 'Get a Quote',
    
    // Brands Section
    trustedBrands: 'Trusted Component Brands',
    
    // Product Section
    featuredModels: 'Featured Chassis Models',
    featuredSubtitle: 'Browse our selection of premium chassis models or filter by your specific requirements',
    newChassis: 'New Chassis',
    usedChassis: 'Used Chassis',
    allProducts: 'All Products',
    size: 'Size',
    viewDetails: 'View Details',
    viewAllProducts: 'View All Products',
    
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
    
    // Hero Section
    heroTitle: 'Soluciones Premium de Chasis para Cada Necesidad',
    heroSubtitle: 'Explora nuestra amplia selección de chasis de alta calidad de los principales fabricantes de la industria',
    viewProducts: 'Ver Productos',
    requestQuote: 'Solicitar Cotización',
    getAQuote: 'Solicitar Cotización',
    
    // Brands Section
    trustedBrands: 'Marcas de Componentes de Confianza',
    
    // Product Section
    featuredModels: 'Modelos de Chasis Destacados',
    featuredSubtitle: 'Navega por nuestra selección de modelos de chasis premium o filtra según tus requisitos específicos',
    newChassis: 'Chasis Nuevos',
    usedChassis: 'Chasis Usados',
    allProducts: 'Todos los Productos',
    size: 'Tamaño',
    viewDetails: 'Ver Detalles',
    viewAllProducts: 'Ver Todos los Productos',
    
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

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t
  };

  return React.createElement(
    LanguageContext.Provider,
    { value: contextValue },
    children
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
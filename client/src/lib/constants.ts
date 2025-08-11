// Condition and size values for filtering  
import { getCurrentLanguage } from './i18n-simple';

export const getConditions = () => {
  const isSpanish = getCurrentLanguage() === 'es';
  return [
    { name: isSpanish ? "Todos los Chasis" : "All Chassis", value: "all" },
    { name: isSpanish ? "Chasis Nuevos" : "New Chassis", value: "new-chassis" },
    { name: isSpanish ? "Chasis Usados" : "Used Chassis", value: "used-chassis" }
  ];
};

export const CONDITIONS = [
  { name: "All Chassis", value: "all" },
  { name: "New Chassis", value: "new-chassis" },
  { name: "Used Chassis", value: "used-chassis" }
];

export const getSizes = () => {
  const isSpanish = getCurrentLanguage() === 'es';
  return [
    { name: isSpanish ? "Todos los Tamaños" : "All Sizes", value: "all" },
    { name: "20ft", value: "20ft" },
    { name: "20-40ft", value: "20-40ft" },
    { name: "40ft", value: "40ft" },
    { name: "40-45ft", value: "40-45ft" },
    { name: "20-40-45ft", value: "20-40-45ft" }
  ];
};

export const SIZES = [
  { name: "All Sizes", value: "all" },
  { name: "20ft", value: "20ft" },
  { name: "20-40ft", value: "20-40ft" },
  { name: "40ft", value: "40ft" },
  { name: "40-45ft", value: "40-45ft" },
  { name: "20-40-45ft", value: "20-40-45ft" }
];

// Contact information
export const getContactInfo = () => {
  const isSpanish = getCurrentLanguage() === 'es';
  return {
    address: "4811 N McCarty St Suite C, Houston, TX 77013",
    phone: "+1 (442) 257-9946",
    email: "sales@americanchassisdepot.com",
    hours: [
      { 
        day: isSpanish ? "Lunes - Viernes" : "Monday - Friday", 
        hours: "8:00 AM - 6:00 PM" 
      },
      { 
        day: isSpanish ? "Sábado" : "Saturday", 
        hours: isSpanish ? "9:00 AM - 2:00 PM" : "9:00 AM - 2:00 PM" 
      },
      { 
        day: isSpanish ? "Domingo" : "Sunday", 
        hours: isSpanish ? "Cerrado" : "Closed" 
      }
    ]
  };
};

export const CONTACT_INFO = {
  address: "4811 N McCarty St Suite C, Houston, TX 77013",
  phone: "+1 (442) 257-9946",
  email: "sales@americanchassisdepot.com",
  hours: [
    { day: "Monday - Friday", hours: "8:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "9:00 AM - 2:00 PM" },
    { day: "Sunday", hours: "Closed" }
  ]
};

// Company information
import { getCurrentLanguage } from './i18n-simple';

export const getCompanyInfo = () => {
  const isSpanish = getCurrentLanguage() === 'es';
  return {
    name: "American Chassis Depot",
    tagline: isSpanish ? "Soluciones Premium de Chasis para Cada Necesidad" : "Premium Chassis Solutions for Every Need",
    description: isSpanish 
      ? "American Chassis Depot es un proveedor líder de soluciones de chasis de alta calidad para la industria del transporte y la logística. Nos especializamos en ofrecer una amplia gama de opciones de chasis de los fabricantes más confiables de la industria."
      : "American Chassis Depot is a leading provider of high-quality chassis solutions for the transportation and logistics industry. We specialize in offering a diverse range of chassis options from the industry's most trusted manufacturers.",
    benefits: [
      { 
        icon: "truck", 
        title: isSpanish ? "Calidad Premium" : "Premium Quality", 
        description: isSpanish ? "Marcas líderes de la industria" : "Top industry brands" 
      },
      { 
        icon: "tools", 
        title: isSpanish ? "Soporte Experto" : "Expert Support", 
        description: isSpanish ? "Especialistas dedicados" : "Dedicated specialists" 
      },
      { 
        icon: "certificate", 
        title: isSpanish ? "Productos Certificados" : "Certified Products", 
        description: isSpanish ? "Cumple con la industria" : "Industry-compliant" 
      }
    ]
  };
};

export const COMPANY_INFO = {
  name: "American Chassis Depot",
  tagline: "Premium Chassis Solutions for Every Need",
  description: "American Chassis Depot is a leading provider of high-quality chassis solutions for the transportation and logistics industry. We specialize in offering a diverse range of chassis options from the industry's most trusted manufacturers.",
  benefits: [
    { icon: "truck", title: "Premium Quality", description: "Top industry brands" },
    { icon: "tools", title: "Expert Support", description: "Dedicated specialists" },
    { icon: "certificate", title: "Certified Products", description: "Industry-compliant" }
  ]
};

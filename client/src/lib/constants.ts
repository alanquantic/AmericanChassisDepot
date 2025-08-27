// Condition and size values for filtering  
import { getCurrentLanguage } from './i18n-simple';

export const getConditions = () => {
  const isSpanish = getCurrentLanguage() === 'es';
  return [
    { name: isSpanish ? "Todos los Chasis" : "All Chassis", value: "all" },
    { name: isSpanish ? "Chasis Nuevos" : "New Chassis", value: isSpanish ? "chassis-nuevos-espanol" : "new-chassis" },
    // Eliminamos opción de usados en UI: siempre mostraremos solo nuevos
  ];
};

export const getSizes = () => {
  const isSpanish = getCurrentLanguage() === 'es';
  return [
    { name: isSpanish ? "Todos los Tamaños" : "All Sizes", value: "all" },
    { name: "20ft", value: "20ft" },
    { name: "20-40ft", value: "20-40ft" },
    { name: "33ft", value: "33ft" },
    { name: "40ft", value: "40ft" },
    { name: "40-45ft", value: "40-45ft" },
    { name: "45ft", value: "45ft" },
    { name: "53ft", value: "53ft" },
    { name: "20-40-45ft", value: "20-40-45ft" }
  ];
};

// New characteristics filters
export const getCharacteristics = () => {
  const isSpanish = getCurrentLanguage() === 'es';
  return [
    { name: isSpanish ? "Todas las Características" : "All Characteristics", value: "all" },
    { name: isSpanish ? "Tandem" : "Tandem", value: "tandem" },
    { name: isSpanish ? "Triaxial" : "Tri Axle", value: "triaxle" },
    { name: isSpanish ? "Cuello de Ganso" : "Gooseneck", value: "gooseneck" },
    { name: isSpanish ? "Extensible" : "Extendable", value: "extendable" }
  ];
};

// Contact information
export const getContactInfo = () => {
  const isSpanish = getCurrentLanguage() === 'es';
  return {
    address: "4811 N McCarty St Suite C, Houston, TX 77013",
    phone: "+1 346 395 6739",
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



// Company information
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



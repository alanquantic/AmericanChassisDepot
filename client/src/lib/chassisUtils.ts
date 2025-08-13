// Utility function to determine the primary characteristic to display
export const getPrimaryCharacteristic = (name: string, axleConfig: string): string => {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('gooseneck')) return 'Gooseneck';
  if (lowerName.includes('extendable')) return 'Extendable';
  if (axleConfig.toLowerCase().includes('triaxle') || lowerName.includes('triaxle')) return 'Tri Axle';
  if (axleConfig.toLowerCase().includes('tandem')) return 'Tandem';
  
  return axleConfig;
};

// Spanish translations for characteristics
export const getCharacteristicInSpanish = (characteristic: string): string => {
  const translations: Record<string, string> = {
    'Gooseneck': 'Cuello de Ganso',
    'Extendable': 'Extensible', 
    'Tri Axle': 'Triaxial',
    'Tandem': 'Tándem'
  };
  
  return translations[characteristic] || characteristic;
};
// Lista de productos permitidos basada en la lista oficial del usuario
export const ALLOWED_PRODUCT_SLUGS = [
  // INGLÉS (20 productos)
  "20-sl-tandem",
  "20-sl-tandem-extended", 
  "20-40-12-pins-triaxle",
  "20-40-extendable-tandem",
  "20-40-extendable-tandem-psi",
  "20-40-slider-12pins-tandem",
  "20-40-45-extendable-triaxle",
  "20-40-45-combo-tandem",
  "20ft-iso-tank-container-chassis",
  "33ft-slider-tri-axle",
  "40ft-gn-tandem",
  "40ft-lightweight-four-axle",
  "40-45-extendable",
  "40-45-48-53-extendable-triaxle",
  "40ft-gooseneck-triaxle",
  "40ft-gooseneck-genset",
  "40ft-gooseneck-lightweight",
  "40-gn-lightweight-4-axles",
  "53-gn-slider-tandem",
  "53ft-gooseneck-slider-tandem",
  
  // ESPAÑOL (23 productos)
  "20-40-12-pins-triaxle-esp",
  "20-40-extendable-tandem-esp",
  "20-40-extendable-tandem-psi-esp",
  "20-40-slider-12pins-tandem-esp",
  "20-40-45-combo-tandem-esp",
  "20-40-45-extendable-triaxle-esp",
  "20ft-iso-tank-container-chassis-esp",
  "20-flushback-chassis-esp",
  "33-slider-triaxle-esp",
  "40-gooseneck-esp",
  "40-lightweight-four-axle-esp",
  "40-45-extendable-container-chassis-esp",
  "40-45-48-53-extendable-triaxle-esp",
  "40ft-gooseneck-lightweight-esp",
  "40ft-gooseneck-triaxle-esp",
  "40-gn-lightweight-4-axles-esp",
  "40-gn-tandem-esp",
  "40ft-gooseneck-genset-esp",
  "45ft-multimodal-esp",
  "53-gooseneck-slider-tandem-esp",
  "53-gn-tandem-intermodal-esp",
  "20ft-container-chassis-2-axles-esp"
];

// Función para verificar si un slug está permitido
export function isProductAllowed(slug: string): boolean {
  return ALLOWED_PRODUCT_SLUGS.includes(slug);
}


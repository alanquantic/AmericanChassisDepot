import { db } from './server/db.js';
import { chassisModels } from './shared/schema.js';

console.log('Forzando reseed de la base de datos...');

try {
  // Limpiar todos los productos existentes
  await db.delete(chassisModels);
  console.log('Productos existentes eliminados');
  
  console.log('Reseed completado. Reinicia el servidor para que se ejecute la inicialización.');
} catch (error) {
  console.error('Error durante el reseed:', error);
}

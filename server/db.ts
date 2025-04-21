
import fs from 'fs';
import path from 'path';
import * as schema from "@shared/schema";

// Definir la estructura de datos en memoria
const inMemoryDB = {
  conditions: [] as any[],
  chassisModels: [] as any[],
  contactMessages: [] as any[]
};

// Rutas para archivos JSON (solo usados en producción)
const DATA_DIR = path.join(process.cwd(), 'data');
const CONDITIONS_FILE = path.join(DATA_DIR, 'conditions.json');
const CHASSIS_MODELS_FILE = path.join(DATA_DIR, 'chassisModels.json');
const CONTACT_MESSAGES_FILE = path.join(DATA_DIR, 'contactMessages.json');

// Asegurar que el directorio de datos exista
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  // Inicializar archivos si no existen
  if (!fs.existsSync(CONDITIONS_FILE)) {
    fs.writeFileSync(CONDITIONS_FILE, JSON.stringify([]));
  }
  if (!fs.existsSync(CHASSIS_MODELS_FILE)) {
    fs.writeFileSync(CHASSIS_MODELS_FILE, JSON.stringify([]));
  }
  if (!fs.existsSync(CONTACT_MESSAGES_FILE)) {
    fs.writeFileSync(CONTACT_MESSAGES_FILE, JSON.stringify([]));
  }
  
  // Cargar datos desde archivos si estamos en producción
  if (process.env.NODE_ENV === 'production') {
    try {
      inMemoryDB.conditions = JSON.parse(fs.readFileSync(CONDITIONS_FILE, 'utf-8'));
      inMemoryDB.chassisModels = JSON.parse(fs.readFileSync(CHASSIS_MODELS_FILE, 'utf-8'));
      inMemoryDB.contactMessages = JSON.parse(fs.readFileSync(CONTACT_MESSAGES_FILE, 'utf-8'));
      console.log('Datos cargados desde archivos JSON');
    } catch (error) {
      console.error('Error cargando datos desde archivos:', error);
    }
  }
} catch (error) {
  console.error('Error inicializando sistema de archivos:', error);
}

// Mock para la interfaz de consulta a la base de datos
const db = {
  select: () => ({
    from: (table: keyof typeof inMemoryDB) => ({
      where: (condition: any) => {
        // Filtrar según condición (simplificado)
        const results = inMemoryDB[table].filter((item) => {
          // Manejo simple para eq (equal)
          if (condition && typeof condition === 'object') {
            const key = Object.keys(condition)[0];
            const value = condition[key];
            return item[key] === value;
          }
          return true;
        });
        return results;
      },
      // Sin condición devuelve todos los elementos
      execute: () => inMemoryDB[table],
      // Para compatibilidad con el código existente
      ...(inMemoryDB[table])
    }),
  }),
  insert: (table: keyof typeof inMemoryDB) => ({
    values: (data: any) => ({
      returning: () => {
        // Generar ID si no existe
        if (!data.id) {
          const maxId = inMemoryDB[table].length > 0 
            ? Math.max(...inMemoryDB[table].map(item => item.id)) 
            : 0;
          data.id = maxId + 1;
        }
        
        // Añadir el elemento
        inMemoryDB[table].push(data);
        
        // Guardar en archivo si estamos en producción
        if (process.env.NODE_ENV === 'production') {
          try {
            const filePath = 
              table === 'conditions' ? CONDITIONS_FILE :
              table === 'chassisModels' ? CHASSIS_MODELS_FILE :
              CONTACT_MESSAGES_FILE;
            
            fs.writeFileSync(filePath, JSON.stringify(inMemoryDB[table], null, 2));
          } catch (error) {
            console.error(`Error guardando ${table} en archivo:`, error);
          }
        }
        
        return [data];
      }
    })
  })
};

// Exportar un objeto vacío como mock de pool
const pool = {};

console.log('Sistema de almacenamiento basado en archivos inicializado correctamente');

export { pool, db };

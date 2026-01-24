import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../../shared/marketplace-schema.js';

// Marketplace database connection
const marketplaceConnectionString = process.env.MARKETPLACE_DATABASE_URL || process.env.DATABASE_URL;

console.log('[Marketplace DB] Connection string available:', !!marketplaceConnectionString);

let marketplaceDb: ReturnType<typeof drizzle> | null = null;

if (marketplaceConnectionString) {
  try {
    // Create Neon HTTP client (works in serverless)
    const sql = neon(marketplaceConnectionString);
    
    // Create Drizzle instance with schema
    marketplaceDb = drizzle(sql, { schema });
    console.log('[Marketplace DB] Drizzle instance created successfully');
  } catch (error) {
    console.error('[Marketplace DB] Error creating database connection:', error);
    marketplaceDb = null;
  }
} else {
  console.warn('[Marketplace DB] MARKETPLACE_DATABASE_URL not set, marketplace features will be disabled');
}

// Helper to check if marketplace DB is available
export function isMarketplaceAvailable(): boolean {
  return marketplaceDb !== null;
}

// Get marketplace DB or throw error
export function getMarketplaceDb() {
  if (!marketplaceDb) {
    throw new Error('Marketplace database is not configured. Check MARKETPLACE_DATABASE_URL environment variable.');
  }
  return marketplaceDb;
}

export { marketplaceDb };
export default marketplaceDb;

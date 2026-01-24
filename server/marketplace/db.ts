import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';

// Configure WebSocket for Neon
neonConfig.webSocketConstructor = ws;

// Marketplace database connection
const marketplaceConnectionString = process.env.MARKETPLACE_DATABASE_URL || process.env.DATABASE_URL;

if (!marketplaceConnectionString) {
  console.warn('MARKETPLACE_DATABASE_URL not set, marketplace features will be disabled');
}

// Create connection pool for marketplace
export const marketplacePool = marketplaceConnectionString 
  ? new Pool({ connectionString: marketplaceConnectionString })
  : null;

// Create Drizzle instance for marketplace
export const marketplaceDb = marketplacePool 
  ? drizzle(marketplacePool)
  : null;

// Helper to check if marketplace DB is available
export function isMarketplaceAvailable(): boolean {
  return marketplaceDb !== null;
}

// Get marketplace DB or throw error
export function getMarketplaceDb() {
  if (!marketplaceDb) {
    throw new Error('Marketplace database is not configured');
  }
  return marketplaceDb;
}

export default marketplaceDb;

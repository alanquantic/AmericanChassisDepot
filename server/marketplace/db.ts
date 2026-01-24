import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Marketplace database connection
const marketplaceConnectionString = process.env.MARKETPLACE_DATABASE_URL || process.env.DATABASE_URL;

if (!marketplaceConnectionString) {
  console.warn('MARKETPLACE_DATABASE_URL not set, marketplace features will be disabled');
}

// Create Neon HTTP client (works in serverless)
const sql = marketplaceConnectionString ? neon(marketplaceConnectionString) : null;

// Create Drizzle instance for marketplace
export const marketplaceDb = sql ? drizzle(sql) : null;

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

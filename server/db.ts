import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

try {
  export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  export const db = drizzle({ client: pool, schema });
  
  // Test the connection
  pool.connect().then(() => {
    console.log("Database connection established successfully");
  }).catch(err => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  });
} catch (err) {
  console.error("Error initializing database:", err);
  process.exit(1);
}

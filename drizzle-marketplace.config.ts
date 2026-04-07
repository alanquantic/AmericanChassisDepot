import { defineConfig } from "drizzle-kit";

if (!process.env.MARKETPLACE_DATABASE_URL) {
  throw new Error("MARKETPLACE_DATABASE_URL is required to push the marketplace schema");
}

export default defineConfig({
  out: "./migrations-marketplace",
  schema: "./shared/marketplace-schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.MARKETPLACE_DATABASE_URL,
  },
});

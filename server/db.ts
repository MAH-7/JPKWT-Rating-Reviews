import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

console.log("Database URL configured:", process.env.DATABASE_URL ? "✓" : "✗");

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

// Test the connection
sql`SELECT 1`
  .then(() => console.log("✓ Database connection successful"))
  .catch((error) => console.error("✗ Database connection failed:", error.message));
import { defineConfig } from "drizzle-kit";

// drizzle-kit doesn't read Next.js env files on its own.
for (const file of [".env.local", ".env.development.local"]) {
  try {
    process.loadEnvFile(file);
  } catch {
    // file doesn't exist — fine
  }
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing. Add it to .env.local.");
}

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL },
});

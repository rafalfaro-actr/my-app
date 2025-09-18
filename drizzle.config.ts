import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/models",
  out: "./drizzle",  // folder for migrations
  dbCredentials: {
    url: process.env.POSTGRES_DB_URI!,
  },
  migrations: {
    schema: 'public'
  }
});
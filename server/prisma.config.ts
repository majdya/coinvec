import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.NEON_DB_CONNECTION_STRING || process.env.DATABASE_URL,
  },
});

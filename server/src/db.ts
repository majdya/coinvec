import { PrismaClient } from "@prisma/client";

if (process.env.NEON_DB_CONNECTION_STRING) {
  process.env.DATABASE_URL = process.env.NEON_DB_CONNECTION_STRING;
}

const prisma = new PrismaClient();

export default prisma;

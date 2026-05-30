import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.NEON_DB_CONNECTION_STRING });
  const prisma = new PrismaClient({ adapter });
  try {
    const users = await prisma.user.findMany();
    console.log("Users:", JSON.stringify(users));
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await prisma["$disconnect"]();
  }
}
main();

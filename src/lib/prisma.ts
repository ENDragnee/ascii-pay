import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

const PrismaClientSingleton = () => {
  if (!connectionString) {
    throw new Error("DATABASE_URL is missing from environment variables");
  }

  const isLocal =
    connectionString.includes("localhost") ||
    connectionString.includes("127.0.0.1");

  const pool = new Pool({
    connectionString,
    ssl: isLocal ? false : { rejectUnauthorized: false },
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({ adapter });
};

// Standard Next.js singleton pattern to prevent multiple instances
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof PrismaClientSingleton> | undefined;
};

export const prisma = globalForPrisma.prisma ?? PrismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

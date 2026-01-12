import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";

// Define a type for the global object to keep TypeScript happy
const globalForPrisma = global as unknown as { prisma: PrismaClient };

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
});

// Use the existing client if it exists, otherwise create a new one
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

// If we are not in production, save the client to the global object
// so it survives across Hot Module Replacement (HMR) refreshes.
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

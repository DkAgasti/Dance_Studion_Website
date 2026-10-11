// Singleton Prisma Client — avoids exhausting DB connections from hot-reloaded
// module instances in dev. See https://pris.ly/d/help/next-js-best-practices
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

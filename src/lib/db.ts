import { PrismaClient } from "@prisma/client";

// Support both Netlify auto-provisioned vars and standard vars
const databaseUrl =
  process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    datasourceUrl: databaseUrl || undefined,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const hasDatabase = !!databaseUrl;

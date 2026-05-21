import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"],
  });

if (process.env["NODE_ENV"] !== "production") {
  globalForPrisma.prisma = prisma;
}

// Verify database connection on startup
prisma.$connect().catch((error: unknown) => {
  console.error("❌ Gagal terhubung ke database:", error);
  process.exit(1);
});

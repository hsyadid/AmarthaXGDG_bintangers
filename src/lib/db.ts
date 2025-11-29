import { PrismaClient } from '@prisma/client';

/**
 * PrismaClient Singleton
 * 
 * This prevents multiple instances of Prisma Client in development
 * due to hot-reloading, which can exhaust database connections.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;

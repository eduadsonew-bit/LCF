import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Función para obtener un cliente fresco de Prisma para lecturas
export function getReadClient(): PrismaClient {
  return new PrismaClient({
    log: ['error'],
  })
}

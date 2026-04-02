import { PrismaClient } from '@prisma/client'

// Force fresh Prisma client for each write operation
// This avoids caching issues with Turbopack dev server
export function getWriteClient(): PrismaClient {
  return new PrismaClient({
    log: ['error'],
  })
}

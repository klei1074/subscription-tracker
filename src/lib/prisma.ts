import { PrismaClient } from '@prisma/client'

const _global = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Check if a global prisma client exists, otherwhise create one
export const prisma =
  _global.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') _global.prisma = prisma

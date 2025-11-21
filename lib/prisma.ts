// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

declare global {
  // Permite adicionar a variável no globalThis sem erro do TS
  var prisma: PrismaClient | undefined
}

// Essa é a forma oficial recomendada pelo Prisma em 2025
// Evita criar dezenas de instâncias no Next.js dev (hot reload)
const prismaClientSingleton = () => {
  return new PrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }
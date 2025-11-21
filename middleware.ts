// src/server/graphql/resolvers/product.resolver.ts
import { prisma } from '@/lib/prisma'

export const resolvers = {
  Query: {
    me: (_: any, __: any, ctx: any) => ctx.user,
    products: async (_: any, { search }: { search?: string }, ctx: any) => {
      if (!ctx.user) throw new Error("Não autenticado")
      return prisma.product.findMany({
        where: {
          userId: ctx.user.id,
          name: search ? { contains: search, mode: 'insensitive' } : undefined
        },
        orderBy: { createdAt: 'desc' }
      })
    },
  },
  Mutation: {
    createProduct: async (_: any, args: any, ctx: any) => {
      if (!ctx.user) throw new Error("Não autenticado")
      return prisma.product.create({
        data: { ...args, userId: ctx.user.id }
      })
    },
    // updateProduct, deleteProduct...
  }
}
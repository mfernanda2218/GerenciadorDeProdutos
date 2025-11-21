// src/server/graphql/resolvers/product.resolver.ts

import { prisma } from '@/lib/prisma'

export const productResolvers = {
  Query: {
    // Lista todos os produtos do usuário logado (com busca opcional)
    products: async (
      _parent: any,
      args: { search?: string },
      context: any
    ) => {
      if (!context.user) throw new Error('Não autenticado')

      return await prisma.product.findMany({
        where: {
          userId: context.user.id,
          ...(args.search && {
            name: {
              contains: args.search,
              mode: 'insensitive' as const,
            },
          }),
        },
        orderBy: { createdAt: 'desc' },
      })
    },

    // Busca um produto específico por ID (só do próprio usuário)
    product: async (
      _parent: any,
      args: { id: string },
      context: any
    ) => {
      if (!context.user) throw new Error('Não autenticado')

      const product = await prisma.product.findUnique({
        where: { id: args.id },
      })

      if (!product || product.userId !== context.user.id) {
        throw new Error('Produto não encontrado')
      }

      return product
    },
  },

  Mutation: {
    // Criar produto
    createProduct: async (
      _parent: any,
      args: {
        name: string
        salePrice: number
        costPrice: number
        quantity: number
        supplier: string
      },
      context: any
    ) => {
      if (!context.user) throw new Error('Não autenticado')

      return await prisma.product.create({
        data: {
          name: args.name,
          salePrice: args.salePrice,
          costPrice: args.costPrice,
          quantity: args.quantity,
          supplier: args.supplier,
          userId: context.user.id,
        },
      })
    },

    // Atualizar produto
    updateProduct: async (
      _parent: any,
      args: {
        id: string
        name?: string
        salePrice?: number
        costPrice?: number
        quantity?: number
        supplier?: string
      },
      context: any
    ) => {
      if (!context.user) throw new Error('Não autenticado')

      const product = await prisma.product.findUnique({
        where: { id: args.id },
      })

      if (!product || product.userId !== context.user.id) {
        throw new Error('Produto não encontrado ou sem permissão')
      }

      return await prisma.product.update({
        where: { id: args.id },
        data: {
          name: args.name,
          salePrice: args.salePrice,
          costPrice: args.costPrice,
          quantity: args.quantity,
          supplier: args.supplier,
        },
      })
    },

    // Deletar produto
    deleteProduct: async (
      _parent: any,
      args: { id: string },
      context: any
    ) => {
      if (!context.user) throw new Error('Não autenticado')

      const product = await prisma.product.findUnique({
        where: { id: args.id },
      })

      if (!product || product.userId !== context.user.id) {
        throw new Error('Produto não encontrado ou sem permissão')
      }

      await prisma.product.delete({
        where: { id: args.id },
      })

      return true
    },
  },
}
// server/graphql/resolvers/product.resolver.ts
import { prisma } from '@/lib/prisma'

// Helper pra não repetir código (opcional, mas deixa lindo)
const ensureOwnership = (product: any, userId: number) => {
  if (!product || product.userId !== userId) {
    throw new Error('Produto não encontrado ou sem permissão')
  }
}

export const productResolvers = {
  Query: {
    // Lista todos os produtos do usuário logado (com busca opcional)
    products: async (
      _parent: unknown,
      args: { search?: string },
      context: { user?: { id: string } }
    ) => {
      if (!context.user?.id) throw new Error('Não autenticado')

      const userId = Number(context.user.id)

      return await prisma.product.findMany({
        where: {
          userId,
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

    // Busca um produto específico por ID
    product: async (
      _parent: unknown,
      args: { id: string },
      context: { user?: { id: string } }
    ) => {
      if (!context.user?.id) throw new Error('Não autenticado')

      const userId = Number(context.user.id)
      const productId = Number(args.id)

      const product = await prisma.product.findUnique({
        where: { id: productId },
      })

      ensureOwnership(product, userId)

      return product
    },
  },

  Mutation: {
    // Criar produto
    createProduct: async (
      _parent: unknown,
      args: {
        name: string
        salePrice: number
        costPrice: number
        quantity: number
        supplier?: string | null
      },
      context: { user?: { id: string } }
    ) => {
      if (!context.user?.id) throw new Error('Não autenticado')

      const userId = Number(context.user.id)

      return await prisma.product.create({
        data: {
          name: args.name,
          salePrice: args.salePrice,
          costPrice: args.costPrice,
          quantity: args.quantity,
          supplier: args.supplier ?? null,
          userId,
        },
      })
    },

    // Atualizar produto
    updateProduct: async (
      _parent: unknown,
      args: {
        id: string
        name?: string
        salePrice?: number
        costPrice?: number
        quantity?: number
        supplier?: string | null
      },
      context: { user?: { id: string } }
    ) => {
      if (!context.user?.id) throw new Error('Não autenticado')

      const userId = Number(context.user.id)
      const productId = Number(args.id)

      // Verifica se existe e pertence ao usuário
      const product = await prisma.product.findUnique({
        where: { id: productId },
      })

      ensureOwnership(product, userId)

      return await prisma.product.update({
        where: { id: productId },
        data: {
          name: args.name,
          salePrice: args.salePrice,
          costPrice: args.costPrice,
          quantity: args.quantity,
          supplier: args.supplier ?? undefined,
        },
      })
    },

    // Deletar produto
    deleteProduct: async (
      _parent: unknown,
      args: { id: string },
      context: { user?: { id: string } }
    ) => {
      if (!context.user?.id) throw new Error('Não autenticado')

      const userId = Number(context.user.id)
      const productId = Number(args.id)

      const product = await prisma.product.findUnique({
        where: { id: productId },
      })

      ensureOwnership(product, userId)

      await prisma.product.delete({
        where: { id: productId },
      })

      return true
    },
  },
}
// server/graphql/resolvers/product.ts
export const productResolvers = {
  Query: {
    products: async (_: any, { search }: { search?: string }, { prisma, user }: any) => {
      if (!user) throw new Error('Não autenticado')

      return await prisma.product.findMany({
        where: {
          user: { email: user.email },
          ...(search && {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { supplier: { contains: search, mode: 'insensitive' } },
            ],
          }),
        },
        orderBy: { createdAt: 'desc' },
      })
    },

    product: async (_: any, { id }: { id: string }, { prisma, user }: any) => {
      if (!user) throw new Error('Não autenticado')
      return await prisma.product.findFirst({
        where: { id: Number(id), user: { email: user.email } },
      })
    },
  },

  Mutation: {
    createProduct: async (_: any, { input }: any, { prisma, user }: any) => {
      if (!user) throw new Error('Não autenticado')
      return await prisma.product.create({
        data: { ...input, user: { connect: { email: user.email } } },
      })
    },

    updateProduct: async (_: any, { id, input }: any, { prisma, user }: any) => {
      if (!user) throw new Error('Não autenticado')

      // Verifica se o produto pertence ao usuário antes de atualizar
      const product = await prisma.product.findFirst({
        where: { id: Number(id), user: { email: user.email } }
      })

      if (!product) throw new Error('Produto não encontrado ou sem permissão para editar')

      return await prisma.product.update({
        where: { id: Number(id) },
        data: {
            ...input,
            // Garante que salePrice e costPrice sejam números (floats) para o Prisma
            // ou converte para string se o Prisma exigir Decimal robusto
            ...(input.salePrice !== undefined && { salePrice: input.salePrice }),
            ...(input.costPrice !== undefined && { costPrice: input.costPrice }),
        },
      })
    },

    deleteProduct: async (_: any, { id }: { id: string }, { prisma, user }: any) => {
      if (!user) throw new Error('Não autenticado')

      // Verifica se o produto pertence ao usuário antes de deletar
      const product = await prisma.product.findFirst({
        where: { id: Number(id), user: { email: user.email } }
      })

      if (!product) throw new Error('Produto não encontrado ou sem permissão para excluir')

      await prisma.product.delete({ where: { id: Number(id) } })
      return true
    },
  },
}
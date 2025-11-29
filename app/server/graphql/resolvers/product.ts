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
        where: { id, user: { email: user.email } },
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
      return await prisma.product.update({
        where: { id },
        data: input,
      })
    },

    deleteProduct: async (_: any, { id }: { id: string }, { prisma, user }: any) => {
      if (!user) throw new Error('Não autenticado')
      await prisma.product.delete({ where: { id } })
      return true
    },
  },
}
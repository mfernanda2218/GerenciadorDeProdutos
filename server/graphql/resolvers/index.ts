// src/server/graphql/resolvers/index.ts

import { productResolvers } from './product.resolver'
import { userResolvers } from './user.resolver'

// Junta todos os resolvers em um só objeto (padrão GraphQL Yoga)
export const resolvers = {
  Query: {
    // User
    me: userResolvers.Query.me,

    // Products
    products: productResolvers.Query.products,
    product: productResolvers.Query.product,
  },

  Mutation: {
    // Products
    createProduct: productResolvers.Mutation.createProduct,
    updateProduct: productResolvers.Mutation.updateProduct,
    deleteProduct: productResolvers.Mutation.deleteProduct,

    // User (exemplo futuro)
    updateProfile: userResolvers.Mutation.updateProfile,
  },

  // Resolvers de campo (opcional, mas recomendado)
  // Resolve o campo "user" dentro de Product automaticamente
  Product: {
    user: async (parent: any, _args: any, context: any) => {
      if (!parent.userId) return null
      return await context.prisma.user.findUnique({
        where: { id: parent.userId },
        select: { id: true, name: true, email: true },
      })
    },
  },
}
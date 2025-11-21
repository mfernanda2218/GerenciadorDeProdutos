// src/server/graphql/resolvers/user.resolver.ts
import { prisma } from '@/lib/prisma'

export const userResolvers = {
  Query: {
    // Retorna o usuário logado (usado em todo o frontend)
    me: async (_parent: any, _args: any, context: any) => {
      if (!context.user) {
        throw new Error('Não autenticado')
      }

      // Opcional: retorna mais dados do banco se precisar
      const user = await prisma.user.findUnique({
        where: { id: context.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          provider: true,
          createdAt: true,
        },
      })

      return user
    },
  },

  Mutation: {
    // Exemplo futuro: atualizar nome do usuário
    updateProfile: async (_parent: any, args: { name: string }, context: any) => {
      if (!context.user) throw new Error('Não autenticado')

      const updatedUser = await prisma.user.update({
        where: { id: context.user.id },
        data: { name: args.name },
        select: { id: true, name: true, email: true },
      })

      return updatedUser
    },
  },
}
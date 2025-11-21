// src/server/api/graphql/route.ts
import { createYoga, createSchema } from 'graphql-yoga'
import { typeDefs } from './schema'
import { resolvers } from './resolvers'
import { getUserFromToken } from '@/lib/auth'

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  context: async ({ request }) => {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = token ? await getUserFromToken(token) : null
    return { user, prisma }
  },
  graphqlEndpoint: '/api/graphql',
})

export { yoga as GET, yoga as POST }
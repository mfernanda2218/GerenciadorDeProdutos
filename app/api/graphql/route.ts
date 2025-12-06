// app/api/graphql/route.ts
import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { typeDefs } from '@/app/server/graphql/typeDefs'
import { resolvers } from '@/app/server/graphql/resolvers'
import { createContext } from '@/app/server/graphql/context'
import { NextRequest } from 'next/server'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  formatError: (err) => {
    console.error('GraphQL Error:', err)
    return err
  },
})

// Isso é a mágica: transforma seu Apollo Server em uma API Route do Next.js
const handler = startServerAndCreateNextHandler(server, {
  context: async (req: NextRequest) => {
    const context = await createContext({ req })
    return context
  },
})

export { handler as GET, handler as POST }

export const dynamic = 'force-dynamic'
export const bodyParser = false
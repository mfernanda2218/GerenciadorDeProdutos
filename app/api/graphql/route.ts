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

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req: NextRequest) => {
    const context = await createContext({ req })
    return context
  },
})

export async function GET(request: NextRequest) {
  return handler(request)
}

export async function POST(request: NextRequest) {
  return handler(request)
}

export const dynamic = 'force-dynamic'
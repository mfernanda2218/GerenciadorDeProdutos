// lib/apollo-server.ts
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''
  // Prioridade 1: Vercel dynamic URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  // Prioridade 2: Variável manual se houver
  if (process.env.NEXT_PUBLIC_URL) return process.env.NEXT_PUBLIC_URL
  // Fallback dev
  return 'http://localhost:3000'
}

const httpLink = new HttpLink({
  uri: `${getBaseUrl()}/api/graphql`,
})

export function getApolloServerClient(cookie?: string) {
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        cookie: cookie || '',
      },
    }
  })

  return new ApolloClient({
    ssrMode: true,
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  })
}
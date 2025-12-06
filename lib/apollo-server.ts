// lib/apollo-server.ts
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const httpLink = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/graphql`,
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
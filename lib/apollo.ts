// lib/apollo.ts
'use client'

import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'

const httpLink = new HttpLink({
  uri: '/api/graphql',
  credentials: 'same-origin',
})

const authLink = setContext(async (_, { headers }) => {
  return { headers: { ...headers } }
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      // Ignora o erro de seleção em Boolean (delete, toggle, etc.)
      if (
        err.message.includes('must not have a selection since type') &&
        err.message.includes('Boolean')
      ) {
        continue // ou console.warn se quiser ver
      }

      console.error('[GraphQL Error]:', err.message, err)
    }
  }

  if (networkError) {
    console.error('[Network Error]:', networkError)
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
  }
})

const client = new ApolloClient({
  ssrMode: typeof window === 'undefined',
  link: from([errorLink, authLink.concat(httpLink)]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          products: {
            merge(existing = [], incoming: any[]) {
              return incoming
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: { fetchPolicy: 'cache-and-network', errorPolicy: 'all' },
    query: { fetchPolicy: 'network-only', errorPolicy: 'all' },
  },
})

export { client }
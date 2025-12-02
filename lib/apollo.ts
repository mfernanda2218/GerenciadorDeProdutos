// lib/apollo.ts — VERSÃO QUE NUNCA MAIS VAI DAR ERRO DE HEADERS
'use client'

import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'

const httpLink = new HttpLink({
  uri: '/api/graphql',
  credentials: 'same-origin', // ← NextAuth usa cookies httpOnly → PERFEITO
})

const authLink = setContext(async (_, { headers }) => {
  // ISSO É O SEGREDO: NÃO CHAMA auth() AQUI NO CLIENTE
  // Só devolve os headers vazios — a sessão vem pelo cookie mesmo
  return {
    headers: {
      ...headers,
      // Não precisa de Authorization, Bearer, nada
      // O NextAuth manda o cookie automaticamente com credentials: 'same-origin'
    },
  }
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }) => {
      console.error(`[GraphQL Error]: ${message}`)
    })
  }

  if (networkError) {
    console.error(`[Network Error]: ${networkError}`)
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
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  },
})

export { client }
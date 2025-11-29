// lib/apollo.ts
'use client'

import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { auth } from '@/lib/auth'

const httpLink = new HttpLink({
  uri: '/api/graphql',
  credentials: 'same-origin', // Envia cookies automaticamente (NextAuth usa isso)
})

const authLink = setContext(async (_, { headers }) => {
  try {
    const session = await auth()
    // Não precisa de token no header — NextAuth usa cookies httpOnly
    // Mas deixamos vazio pra não dar erro
    return { headers }
  } catch (error) {
    console.error('Erro ao obter sessão no Apollo:', error)
    return { headers }
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

// CRIA O CLIENTE ÚNICO E REUTILIZÁVEL
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

// EXPORTA DIRETAMENTE O CLIENTE (USADO NO layout.tsx)
export { client }

// Funções antigas mantidas por compatibilidade (opcional)
let apolloClient = client

export function initializeApollo() {
  return client
}

export function useApollo() {
  return client
}
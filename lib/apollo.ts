// src/lib/apollo.ts
'use client'
import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'

const httpLink = new HttpLink({ uri: '/api/graphql' })

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('next-auth.session-token') // ou use cookies
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
})

export const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache()
})
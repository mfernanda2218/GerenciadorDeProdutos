import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { headers } from 'next/headers'

const getBaseUrl = () => {
  // 1. Client-side
  if (typeof window !== 'undefined') return ''

  // 2. Vercel dynamic URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`

  // 3. Variável de ambiente manual
  if (process.env.NEXT_PUBLIC_URL) return process.env.NEXT_PUBLIC_URL

  // 4. Detecção via headers (para Server Actions & SSR)
  try {
    const headersList = headers()
    const host = (headersList as any).get('host')
    if (host) {
      const protocol = host.includes('localhost') ? 'http' : 'https'
      return `${protocol}://${host}`
    }
  } catch (e) {
    // Ignora se os headers não estiverem disponíveis
  }

  // Fallback dev padrão
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
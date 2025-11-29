// app/Providers.tsx
'use client'

import { SessionProvider } from 'next-auth/react'
import { ApolloProvider } from '@apollo/client'
import { client } from '@/lib/apollo'
import Header from '@/components/Header' // ← Vamos separar o header em outro arquivo

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ApolloProvider client={client}>
        <Header /> {/* Header separado, com useSession dentro dele */}
        <main className="min-h-screen bg-base-200 pt-20">
          {children}
        </main>
      </ApolloProvider>
    </SessionProvider>
  )
}
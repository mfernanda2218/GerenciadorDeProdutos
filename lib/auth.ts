// lib/auth.ts — VERSÃO FINAL OFICIAL (funciona em tudo)
import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import { JWT } from 'next-auth/jwt'

// Augmenting types (obrigatório pro user.id aparecer)
interface Session {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  } & import('next-auth').DefaultSession['user']
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
  }
}

// CRIA TUDO DE UMA VEZ SÓ — ESSA É A FORMA OFICIAL DO V5
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig)

// Helper pra server components (funciona perfeitamente)
export const getCurrentUser = () => auth()
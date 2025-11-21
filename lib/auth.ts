// lib/auth.ts
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { jwtVerify } from 'jose'

const secretKey = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!)

export async function getUserFromToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey)

    // por padrão o NextAuth coloca o id em `sub` (subject)
    const userId = payload.sub as string | undefined
    if (!userId) return null

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      name: user.name ?? null,
    }
  } catch {
    return null
  }
}

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: String(credentials.email).toLowerCase().trim() }
        })

        if (!user?.password) return null

        const ok = await bcrypt.compare(String(credentials.password), user.password)
        return ok ? { id: user.id, email: user.email, name: user.name ?? null } : null
      },
    }),
  ],

  session: { strategy: 'jwt' },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id as string
      return token
    },
    async session({ session, token }) {
      if (token.id) session.user.id = token.id as string
      return session
    },
  },

  pages: { signIn: '/login' },
  secret: process.env.NEXTAUTH_SECRET!,
})
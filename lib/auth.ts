// lib/auth.ts
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: 'jwt' },
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
      async authorize(credentials) : Promise<any> {
        if (!credentials?.email || !credentials?.password) return null

        const email = String(credentials.email).toLowerCase().trim()

        const user = await prisma.user.findUnique({
          where: { email },
        })

        // Usuário não encontrado ou não tem senha (ex: cadastrado via Google)
        if (!user || !user.password) return null

        const isValid = await bcrypt.compare(
          String(credentials.password),
          user.password
        )

        if (!isValid) return null

        return {
          id: user.id,           // ← já é string (UUID), não precisa .toString()
          name: user.name,
          email: user.email,
          image: user.image,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Quando o usuário faz login, injeta o id no token
      if (user) {
        token.id = user.id // ← já é string (UUID)
      }
      return token
    },

    async session({ session, token }) {
      // Passa o id do token pra session (sempre string)
      if (token.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },

  pages: {
    signIn: '/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development', // ajuda a ver erros no console
})
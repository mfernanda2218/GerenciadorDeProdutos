// lib/auth.config.ts
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authConfig = {
    adapter: PrismaAdapter(prisma),
    session: { strategy: 'jwt' },
    secret: process.env.NEXTAUTH_SECRET!,
    pages: {
        signIn: '/login',
        error: '/login?error=auth_failed'  // ← Adicione isso para capturar erros de OAuth
    },

    providers: [
        GitHub({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        Credentials({
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Senha', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null
                const email = String(credentials.email).toLowerCase().trim()
                const user = await prisma.user.findUnique({ where: { email } })
                if (!user?.password) return null
                const ok = await bcrypt.compare(String(credentials.password), user.password)
                if (!ok) return null
                return { id: user.id, name: user.name, email: user.email, image: user.image }
            },
        }),
    ],

    callbacks: {
        jwt({ token, user }) {
            if (user) token.id = user.id as string
            return token
        },
        session({ session, token }) {
            if (token.id) session.user.id = token.id as string
            return session
        },
        async redirect({ url, baseUrl }) {
            const dashboardUrl = `${baseUrl}/dashboard`
            if (url.startsWith('/')) {
                return url === '/' ? dashboardUrl : `${baseUrl}${url}`
            }
            if (new URL(url).origin === baseUrl) return url
            return dashboardUrl
        }
    },
    events: {
        async signIn(message) {
            console.log('Sign in', message)
        },
        async signOut(message) {
            console.log('Sign out', message)
        }
    }
} satisfies import('next-auth').NextAuthConfig
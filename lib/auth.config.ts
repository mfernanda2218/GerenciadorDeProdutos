// lib/auth.config.ts
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
    adapter: PrismaAdapter(prisma),
    session: { strategy: 'jwt' } as const,
    secret: process.env.NEXTAUTH_SECRET!,
    pages: {
        signIn: '/login',
        error: '/login',
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

                if (!user || !user.password) return null

                const isValid = await bcrypt.compare(String(credentials.password), user.password)
                if (!isValid) return null

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                }
            },
        }),
    ],

    callbacks: {
        // Resolve OAuthAccountNotLinked automaticamente
        async signIn({ user, account }) {
            if (!account || !user.email || !account.providerAccountId) return true

            if (account.provider === 'google' || account.provider === 'github') {
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email },
                })

                if (existingUser) {
                    // Vincula a conta OAuth ao usuário existente
                    await prisma.account.upsert({
                        where: {
                            provider_providerAccountId: {
                                provider: account.provider,
                                providerAccountId: account.providerAccountId,
                            },
                        },
                        update: {},
                        create: {
                            userId: existingUser.id,
                            type: 'oauth',
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                            refresh_token: account.refresh_token ?? null,
                            access_token: account.access_token ?? null,
                            expires_at: account.expires_at ?? null,
                            token_type: account.token_type ?? null,
                            scope: account.scope ?? null,
                            id_token: account.id_token ?? null,
                        },
                    })
                }
            }

            return true
        },

        jwt({ token, user }) {
            if (user) token.id = user.id as string
            return token
        },

        session({ session, token }) {
            if (token.id) session.user.id = token.id as string
            return session
        },

        async redirect({ baseUrl }) {
            return `${baseUrl}/dashboard`
        },
    },

    events: {
        async signIn({ user, account }) {
            console.log('Login com sucesso →', account?.provider, user.email)
        },
        async signOut() {
            console.log('Logout')
        },
    },
} satisfies NextAuthConfig
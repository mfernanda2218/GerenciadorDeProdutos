// server/graphql/context.ts
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

export interface Context {
    prisma: typeof prisma
    user: {
        id: string
        name?: string | null
        email?: string | null
        image?: string | null
    } | null
}

export async function createContext({ req }: { req: NextRequest }): Promise<Context> {
    try {
        // Pega a sessão do NextAuth (funciona com cookies automáticos)
        const session = await auth()

        const user = session?.user ? {
            id: session.user.id || '',
            name: session.user.name || null,
            email: session.user.email || null,
            image: session.user.image || null,
        } : null

        return {
            prisma,
            user,
        }
    } catch (error) {
        console.error('Erro ao criar contexto GraphQL:', error)
        return {
            prisma,
            user: null,
        }
    }
}
// server/graphql/context.ts
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function createContext({ req }: { req: any }) {
  const session = await auth()

  return {
    prisma,
    session,
    user: session?.user ?? null,
    userId: session?.user?.id ?? null,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
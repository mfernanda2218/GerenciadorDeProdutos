// src/lib/auth.ts
import { auth } from "@/app/api/auth/[...nextauth]/route"

export const getCurrentUser = async () => {
  const session = await auth()
  return session?.user ?? null
}
// app/api/auth/signout/route.ts
import { signOut } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST() {
  await signOut({ redirect: false })
  return NextResponse.redirect(new URL('/login', 'http://localhost:3000'))
}
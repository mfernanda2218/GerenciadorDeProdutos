// app/api/auth/signout/route.ts
import { signOut } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  await signOut({ redirect: false })
  const origin = request.headers.get('origin') || request.nextUrl.origin
  return NextResponse.redirect(new URL('/login', origin))
}
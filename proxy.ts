// src/middleware.ts — VERSÃO QUE FUNCIONA 100% NO EDGE (MIDDLEWARE)
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
export default auth((req: any) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth?.user

  // Logado indo pro login/cadastro → dashboard
  if (isLoggedIn && (pathname === '/login' || pathname === '/cadastro')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Não logado indo pro dashboard → login
  if (!isLoggedIn && pathname.startsWith('/dashboard')) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}

// middleware.ts
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

interface AuthRequest extends NextRequest {
  auth?: any
}

export default auth((req: AuthRequest) => {
  const { nextUrl } = req
  const session = req.auth

  const isLoggedIn = !!session?.user
  const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
  const isOnLogin = nextUrl.pathname === '/login'

  // Logado tentando ir pro /login → manda pro dashboard
  if (isLoggedIn && isOnLogin) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl))
  }

  // Não logado tentando acessar /dashboard → manda pro login
  if (!isLoggedIn && isOnDashboard) {
    return NextResponse.redirect(new URL('/login', nextUrl))
  }

  // Tudo certo → continua
  return NextResponse.next()
})

// Rotas que o middleware vai rodar
export const config = {
  matcher: [
    '/dashboard/:path*',  // todas as rotas do dashboard
    '/login',             // página de login
    '/cadastro',          // (opcional) se tiver tela de cadastro
  ],
}
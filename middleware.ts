// middleware.ts (na raiz do projeto)
import { auth } from '@/lib/auth'

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isPublicPage = nextUrl.pathname === '/login' || 
                       nextUrl.pathname === '/cadastro' || 
                       nextUrl.pathname.startsWith('/api/auth')

  // Se estiver logado e tentar acessar login/cadastro → manda pro dashboard
  if (isLoggedIn && (nextUrl.pathname === '/login' || nextUrl.pathname === '/cadastro')) {
    return Response.redirect(new URL('/dashboard', nextUrl))
  }

  // Se NÃO estiver logado e tentar acessar área protegida → manda pro login
  if (!isLoggedIn && !isPublicPage) {
    return Response.redirect(new URL('/login', nextUrl))
  }

  // Tudo certo → continua
  return
})

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/cadastro',
    '/api/auth/:path*',
  ],
}

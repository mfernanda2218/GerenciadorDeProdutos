// app/(auth)/login/page.tsx
'use client'

import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  // Verifica sessão diretamente via API (funciona 100% com Auth.js v5 + JWT)
  useEffect(() => {
    fetch('/api/auth/session', { cache: 'no-store' })
      .then(res => res.json())
      .then(session => {
        if (session?.user) {
          console.log('Sessão encontrada → redirecionando para /dashboard')
          router.replace('/dashboard')
        }
      })
      .catch(() => {
        // Se falhar, assume que não tem sessão (normal)
      })
  }, [router])

  const handleOAuth = (provider: 'google' | 'github') => {
    signIn(provider, {
      callbackUrl: '/dashboard', // v5 aceita callbackUrl normalmente
    })
  }

  const handleCredentials = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const email = form.email.value.trim()
    const password = form.password.value

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      alert('Email ou senha incorretos')
    } else {
      router.replace('/dashboard')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-2xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-3xl mb-8">Login</h2>

          {/* Exibe erro do OAuth (ex: conta já usada, acesso negado, etc) */}
          {error && (
            <div className="alert alert-error mb-4 text-sm">
              <span>
                {error === 'OAuthAccountNotLinked' && 'Esta conta já está vinculada a outro método de login.'}
                {error === 'Callback' && 'Erro no callback do provedor. Tente novamente.'}
                {error === 'AccessDenied' && 'Acesso negado pelo provedor.'}
                {error && `Erro: ${error}`}
              </span>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => handleOAuth('google')}
              className="btn btn-outline w-full gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 6.75c1.65 0 3.12.64 4.29 1.68l3.21-3.21C17.46 2.98 14.97 2 12 2 7.7 2 3.99 4.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continuar com Google
            </button>

            <button
              onClick={() => handleOAuth('github')}
              className="btn btn-outline w-full gap-3"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Continuar com GitHub
            </button>
          </div>

          <div className="divider">OU</div>

          <form onSubmit={handleCredentials} className="space-y-4">
            <input
              name="email"
              type="email"
              placeholder="seu@email.com"
              className="input input-bordered w-full"
              required
            />
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              className="input input-bordered w-full"
              required
            />
            <button type="submit" className="btn btn-primary w-full">
              Entrar com Email/Senha
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
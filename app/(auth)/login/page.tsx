// app/(auth)/login/page.tsx
'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const { status } = useSession()

  // Redireciona se já estiver logado
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard')
    }
  }, [status, router])

  const [isVisible, setIsVisible] = useState(false)

  const handleOAuth = (provider: 'google' | 'github') => {
    signIn(provider, {
      callbackUrl: '/dashboard', // v5 aceita callbackUrl normalmente
    })
  }

  const handleCredentials = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim()
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

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
    <div className="flex min-h-screen items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-[420px] bg-base-100 shadow-2xl">
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
            <div className="relative w-full">
              <input
                name="password"
                type={isVisible ? "text" : "password"}
                placeholder="••••••••"
                className="input input-bordered w-full pr-10"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setIsVisible(!isVisible)}
              >
                {isVisible ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-eye-off">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-eye">
                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Entrar com Email/Senha
            </button>
          </form>

          <div className="text-center">
            <span className="text-sm">Ainda não tem uma conta? </span>
            <Link 
              href="/signup"
              className="btn btn-link btn-sm p-0 h-auto min-h-0 text-primary"
            >
              Criar conta
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
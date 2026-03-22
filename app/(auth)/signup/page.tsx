// app/(auth)/signup/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Verifica se usuário já está logado
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

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const form = e.currentTarget
    const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim()
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim().toLowerCase()
    const password = (form.elements.namedItem('password') as HTMLInputElement).value
    const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value

    // Validações básicas
    if (!name || !email || !password || !confirmPassword) {
      setError('Todos os campos são obrigatórios')
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao criar conta')
        setIsLoading(false)
        return
      }

      // Conta criada com sucesso, redireciona para login
      alert('Conta criada com sucesso! Faça login para continuar.')
      router.push('/login')
    } catch (err) {
      setError('Erro ao conectar com o servidor')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-2xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-3xl mb-8">Criar Conta</h2>

          {/* Exibe erro se houver */}
          {error && (
            <div className="alert alert-error mb-4 text-sm">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <input
              name="name"
              type="text"
              placeholder="Seu nome"
              className="input input-bordered w-full"
              required
              disabled={isLoading}
            />
            <input
              name="email"
              type="email"
              placeholder="seu@email.com"
              className="input input-bordered w-full"
              required
              disabled={isLoading}
            />
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              className="input input-bordered w-full"
              required
              disabled={isLoading}
              minLength={6}
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirme sua senha"
              className="input input-bordered w-full"
              required
              disabled={isLoading}
              minLength={6}
            />
            <button 
              type="submit" 
              className="btn btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                'Criar Conta'
              )}
            </button>
          </form>

          <div className="divider">OU</div>

          <div className="text-center">
            <span className="text-sm">Já tem uma conta? </span>
            <button 
              onClick={() => router.push('/login')}
              className="btn btn-link btn-sm p-0 h-auto min-h-0 text-primary"
            >
              Faça login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

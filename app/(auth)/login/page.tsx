'use client'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    getSession().then(session => {
      if (session) router.replace('/dashboard')
    })
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-2xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl">Login</h2>

          <div className="flex flex-col gap-3 mt-6">
            <button onClick={() => signIn('google')} className="btn btn-outline">
              Google
            </button>
            <button onClick={() => signIn('github')} className="btn btn-outline">
              GitHub
            </button>
          </div>

          <div className="divider">OU</div>

          <form onSubmit={async (e) => {
            e.preventDefault()
            const form = e.target as HTMLFormElement
            await signIn('credentials', {
              email: form.email.value,
              password: form.password.value,
              redirect: false,
            })
            router.replace('/dashboard')
          }}>
            <label className="input input-bordered flex items-center gap-2 mb-3">
              <input name="email" type="email" className="grow" placeholder="Email" required />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <input name="password" type="password" className="grow" placeholder="Senha" required />
            </label>
            <button type="submit" className="btn btn-primary w-full mt-4">
              Entrar com email/senha
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
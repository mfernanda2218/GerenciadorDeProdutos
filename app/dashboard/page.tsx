'use client'

import Link from 'next/link'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <div className="flex-none gap-4">
          <div className="avatar">
            <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                src={session.user?.image ?? '/default-avatar.png'}
                alt={session.user?.name ?? 'Usuário'}
              />
            </div>
          </div>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><span className="font-medium">{session.user?.name ?? 'Usuário'}</span></li>
              <li><span className="text-sm opacity-70">{session.user?.email}</span></li>
              <li className="mt-2">
                <form action="/api/auth/signout" method="post">
                  <button type="submit" className="btn btn-error btn-sm w-full">
                    Sair
                  </button>
                </form>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-8">
        <div className="stats shadow w-full">
          <div className="stat">
            <div className="stat-title">Bem-vindo(a) de volta!</div>
            <div className="stat-value text-primary">{session.user?.name?.split(' ')[0] ?? 'Usuário'}</div>
            <div className="stat-desc">Você está logado com sucesso</div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Produtos</h2>
              <p>Gerencie seu estoque</p>
              <div className="card-actions justify-end">
                <Link href="/dashboard/produtos" className="btn btn-primary">Ir</Link>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Relatórios</h2>
              <p>Veja suas estatísticas</p>
              <div className="card-actions justify-end">
                <button className="btn btn-ghost" disabled>Em breve</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Configurações</h2>
              <p>Ajuste seu perfil</p>
              <div className="card-actions justify-end">
                <button className="btn btn-ghost" disabled>Em breve</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
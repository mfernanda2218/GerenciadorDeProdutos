// app/Header.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return (
      <div className="navbar bg-base-100 shadow-xl sticky top-0 z-50">
        <div className="flex-1 px-6">
          <div className="h-8 w-48 bg-base-300 rounded animate-pulse" />
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    setTimeout(() => router.push('/login'), 0)
    return null
  }

  const user = session!.user

  return (
    <div className="navbar bg-base-100 shadow-xl sticky top-0 z-50">
      <div className="flex-1">
        <h1 className="text-2xl font-bold px-6 text-primary">Gerenciador</h1>
      </div>

      <div className="flex-none gap-4 px-6">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="avatar cursor-pointer">
            <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 hover:ring-offset-4 transition-all">
              <img
                src={user?.image ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                alt="Avatar"
                className="object-cover"
              />
            </div>
          </div>
          <ul tabIndex={0} className="menu dropdown-content mt-3 z-50 p-4 shadow-2xl bg-base-100 rounded-box w-72 border border-base-300">
            <li className="menu-title">
              <span className="font-bold text-lg">{user?.name ?? 'Usuário'}</span>
            </li>
            <li>
              <span className="text-sm opacity-80">{user?.email}</span>
            </li>
            <li className="mt-4">
              <form action="/api/auth/signout" method="post" className="w-full">
                <button type="submit" className="btn btn-error btn-sm w-full hover:btn-outline">
                  Sair da conta
                </button>
              </form>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
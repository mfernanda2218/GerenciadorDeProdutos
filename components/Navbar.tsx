// components/Navbar.tsx
'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="navbar bg-base-100 shadow-lg fixed top-0 z-50 px-4 md:px-8">
      <div className="navbar-start">
        <Link href="/dashboard" className="btn btn-ghost text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-600 px-2">
          Gerenciador
        </Link>
      </div>

      <div className="navbar-end gap-4">
        {session?.user && (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar border border-primary/20 hover:border-primary transition-colors">
              <div className="w-10 rounded-full">
                {session.user.image ? (
                  <img src={session.user.image} alt={session.user.name || 'User'} />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {session.user.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-xl menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-200">
              <li className="menu-title px-4 py-2 border-b border-base-200 mb-2 font-bold text-base-content/60">
                {session.user.name}
              </li>
              <li><a className="py-3 px-4 hover:bg-base-200" onClick={() => signOut({ callbackUrl: '/login' })}>Sair da conta</a></li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  )
}

// components/Navbar.tsx
'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="navbar bg-base-100 shadow-lg fixed top-0 z-50 px-4 md:px-8">
      <div className="navbar-start">
        {/* Mobile-only menu icon */}
        <div className="dropdown lg:hidden">
          <label tabIndex={0} className="btn btn-ghost lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          {menuOpen && (
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 border border-base-200" onClick={() => setMenuOpen(false)}>
              <li><Link href="/dashboard">Dashboard</Link></li>
              <li><Link href="/dashboard/produtos">Todos os Produtos</Link></li>
              <li><Link href="/dashboard/produtos/cadastrar">Novo Produto</Link></li>
            </ul>
          )}
        </div>
        
        <Link href="/dashboard" className="btn btn-ghost text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-600 px-2">
          Gerenciador
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2 font-medium text-base">
          <li>
            <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
          </li>
          <li>
            <Link href="/dashboard/produtos" className="hover:text-primary transition-colors">Todos os Produtos</Link>
          </li>
          <li>
            <Link href="/dashboard/produtos/cadastrar" className="hover:text-primary transition-colors">Novo Produto</Link>
          </li>
        </ul>
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

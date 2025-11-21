// app/layout.tsx   ← tem que ficar aqui, na raiz do app/
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { logout } from '@/app/actions/auth-actions'
import { auth } from '@/lib/auth'

// DaisyUI + Tailwind
import 'daisyui/dist/full.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Gerenciador de Produtos',
  description: 'Gerencie seu estoque com facilidade',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" data-theme="light">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

async function HeaderComLogout() {
  const session = await auth()

  return (
    <div className="navbar bg-base-100 shadow-lg px-6">
      <div className="flex-1">
        <h1 className="text-2xl font-bold">Gerenciador de Produtos</h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="font-medium">{session?.user?.name || 'Usuário'}</p>
          <p className="text-sm opacity-70">{session?.user?.email}</p>
        </div>

        <div className="avatar">
          <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img
              src={session?.user?.image || '/default-avatar.png'}
              alt="Avatar"
            />
          </div>
        </div>

        {/* BOTÃO DE LOGOUT */}
        <form action={logout}>
          <button type="submit" className="btn btn-error btn-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sair
          </button>
        </form>
      </div>
    </div>
  )
}
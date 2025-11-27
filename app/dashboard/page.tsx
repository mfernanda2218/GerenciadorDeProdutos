// app/dashboard/page.tsx
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import SearchBar from '@/components/SearchBar'

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user?.id) redirect('/login')

  console.log('session.user.id →', session.user.id)
  console.log('typeof →', typeof session.user.id)

  const userId = session.user.id

  console.log('userId (UUID) →', userId)

  if (!userId || typeof userId !== 'string') {
    console.error('USER ID INVÁLIDO →', userId)
    redirect('/login')
  }

  const totalProdutos = await prisma.product.count({
    where: { userId },
  })

  return (
    <div className="min-h-screen bg-base-200">
      {/* NAVBAR */}
      <div className="navbar bg-base-100 shadow-xl sticky top-0 z-50">
        <div className="flex-1">
          <h1 className="text-2xl font-bold px-6 text-primary">Gerenciador</h1>
        </div>

        <div className="flex-none gap-4 px-6">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="avatar cursor-pointer">
              <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 hover:ring-offset-4 transition-all">
                <img
                  src={session.user?.image ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user?.email}`}
                  alt="Avatar"
                  className="object-cover"
                />
              </div>
            </div>
            <ul tabIndex={0} className="menu dropdown-content mt-3 z-50 p-4 shadow-2xl bg-base-100 rounded-box w-72 border border-base-300">
              <li className="menu-title">
                <span className="font-bold text-lg">{session.user?.name ?? 'Usuário'}</span>
              </li>
              <li>
                <span className="text-sm opacity-80">{session.user?.email}</span>
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

      {/* CONTEÚDO PRINCIPAL */}
      <div className="container mx-auto p-8 pt-12">
        {/* BOAS-VINDAS + CONTADOR */}
        <div className="text-center mb-14">
          <h2 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4">
            Bem-vindo de volta, {session.user?.name?.split(' ')[0] || 'Usuário'}!
          </h2>
          <p className="text-2xl text-base-content/90 font-medium">
            Você tem{' '}
            <span className="text-primary font-bold text-3xl">{totalProdutos}</span>{' '}
            {totalProdutos === 1 ? 'produto cadastrado' : 'produtos cadastrados'}
          </p>
        </div>

        {/* SEARCHBAR */}
        <div className="max-w-3xl mx-auto mb-16">
          <SearchBar />
        </div>

        {/* CARD PRINCIPAL */}
        <div className="max-w-5xl mx-auto">
          <div className="card bg-base-100 shadow-2xl hover:shadow-3xl transition-all duration-500 border border-primary/30 overflow-hidden">
            <div className="card-body text-center py-24 px-10 bg-gradient-to-br from-base-100 to-base-200">
              <div className="mb-12">
                <div className="w-28 h-28 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-20 h-20 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>

              <h2 className="card-title text-5xl md:text-6xl font-black mb-8 text-primary">Produtos</h2>
              <p className="text-xl md:text-2xl text-base-content/80 mb-14 max-w-3xl mx-auto leading-relaxed">
                Gerencie seu estoque com total controle: cadastre novos produtos, edite preços, acompanhe quantidades e remova itens quando necessário.
              </p>

              <div className="card-actions justify-center">
                <Link
                  href="/dashboard/produtos"
                  className="btn btn-primary btn-lg text-xl px-16 py-7 gap-5 hover:scale-105 transition-all shadow-2xl hover:shadow-primary/50"
                >
                  <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Acessar Produtos
                  {totalProdutos > 0 && (
                    <div className="badge badge-secondary badge-lg text-lg px-4 py-2 ml-4 animate-pulse">
                      {totalProdutos}
                    </div>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* RODAPÉ */}
        <div className="text-center mt-24 text-base-content/40 text-sm">
          <p>Gerenciador de Produtos • Next.js 14+ • Prisma • Auth.js • DaisyUI</p>
        </div>
      </div>
    </div>
  )
}
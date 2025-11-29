// app/dashboard/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import SearchBar from '@/components/SearchBar'
import { revalidatePath } from 'next/cache'
import DeleteButton from '@/components/DeleteButton'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const userId = session.user.id as string
  const query = searchParams.q?.trim()

  const totalProdutos = await prisma.product.count({
    where: {
      user: {
        email: session.user.email!
      }
    }
  })
  const produtos = query
    ? await prisma.product.findMany({
      where: {
        user: { email: session.user.email! },
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { supplier: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    : []

  // Função de deletar — 100% funcional com ID Int
  async function deleteProduct(productId: number) {
    'use server'

    await prisma.product.delete({
      where: { id: productId }
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/produtos')
  }

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

      <div className="container mx-auto p-8 pt-20 max-w-7xl">

        {/* TÍTULO + CONTADOR */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-600 mb-6">
            Bem-vindo de volta, {session.user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-xl text-base-content/80">
            Você tem{' '}
            <span className="font-bold text-primary text-3xl">{totalProdutos}</span>{' '}
            {totalProdutos === 1 ? 'produto cadastrado' : 'produtos cadastrados'}
          </p>
        </div>

        {/* SEARCHBAR CENTRALIZADA */}
        <div className="max-w-3xl mx-auto mb-20">
          <SearchBar />
        </div>

        {/* RESULTADOS DA BUSCA (só aparece se tiver query */}
        {query && produtos.length > 0 && (
          <div className="mt-32 max-w-6xl mx-auto mb-20">
            <div className="bg-base-100 rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-pink-600 p-6">
                <h3 className="text-2xl font-bold text-white">
                  Resultados para: "{query}" ({produtos.length})
                </h3>
              </div>

              {/* TABELA COMPLETA */}
              <div className="overflow-x-auto">
                <table className="table table-lg">
                  <thead>
                    <tr className="bg-base-300">
                      <th>Produto</th>
                      <th>Fornecedor</th>
                      <th className="text-right">Preço Custo</th>
                      <th className="text-right">Preço Venda</th>
                      <th className="text-center">Estoque</th>
                      <th className="text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtos.map((p) => (
                      <tr key={p.id} className="hover:bg-base-200 transition-colors">
                        {/* NOME DO PRODUTO */}
                        <td className="font-semibold">{p.name}</td>

                        {/* FORNECEDOR */}
                        <td>{p.supplier || '—'}</td>

                        {/* PREÇO DE CUSTO */}
                        <td className="text-right font-medium text-base-content/70">
                          R$ {Number(p.costPrice).toFixed(2).replace('.', ',')}
                        </td>

                        {/* PREÇO DE VENDA */}
                        <td className="text-right font-bold text-success">
                          R$ {Number(p.salePrice).toFixed(2).replace('.', ',')}
                        </td>

                        {/* ESTOQUE COM CORES */}
                        <td className="text-center">
                          <div className={`badge badge-lg font-bold ${p.quantity === 0 ? 'badge-error' : p.quantity <= 10 ? 'badge-warning' : 'badge-success'}`}>
                            {p.quantity} un
                          </div>
                        </td>

                        {/* AÇÕES — EDITAR E DELETAR */}
                        <td className="text-center">
                          <div className="flex justify-center gap-3">
                            {/* EDITAR */}
                            <Link
                              href={`/dashboard/produtos/editar/${p.id}`}
                              className="btn btn-sm btn-outline btn-primary tooltip"
                              data-tip="Editar"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </Link>

                            {/* DELETAR */}
                            <DeleteButton productId={p.id} productName={p.name} />

                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {/* CARD PRINCIPAL - EXATAMENTE COMO NO FIGMA */}
        <div className="max-w-2xl mx-auto">
          <div className="card bg-base-100 shadow-2xl rounded-3xl overflow-hidden">
            <div className="card-body text-center py-16 px-12">
              {/* ÍCONE CENTRALIZADO */}
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>

              {/* TÍTULO DO CARD */}
              <h2 className="text-2xl font-bold text-primary mb-6">
                Produtos
              </h2>

              {/* DESCRIÇÃO */}
              <p className="text-base-content/70 leading-relaxed mb-10 max-w-md mx-auto">
                Gerencie seu estoque com total controle: cadastre novos produtos,
                edite preços, acompanhe quantidades e remova itens quando necessário.
              </p>

              {/* BOTÃO ROXO */}
              <Link
                href="/dashboard/produtos"
                className="btn btn-primary btn-lg gap-3 px-10 shadow-xl hover:shadow-primary/50 hover:scale-105 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Acessar Produtos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// app/dashboard/page.tsx
'use client'

import { useQuery, gql } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import SearchBar from '@/components/SearchBar'
import DeleteButton from '@/components/DeleteButton'

const GET_PRODUCTS_AND_COUNT = gql`
  query GetProductsAndCount($search: String) {
    products(search: $search) {
      id
      name
      supplier
      salePrice
      costPrice
      quantity
      createdAt
    }
    totalProducts: products {
      id
    }
  }
`

export default function DashboardPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const query = searchParams.q?.trim() || ''

  const { data, loading, error, refetch } = useQuery(GET_PRODUCTS_AND_COUNT, {
    variables: { search: query || undefined },
    fetchPolicy: 'cache-and-network',
  })

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  const user = session?.user
  const products = data?.products || []
  const totalProdutos = data?.totalProducts?.length || 0
  const filteredProducts = query ? products : []

  return (
    <div className="min-h-screen bg-base-200">

      <div className="container mx-auto p-8 pt-20 max-w-7xl">

        {/* TÍTULO + CONTADOR */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-600 mb-6">
            Bem-vindo de volta, {user?.name?.split(' ')[0]}!
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

        {/* RESULTADOS DA BUSCA */}
        {query && (
          <div className="mt-32 max-w-6xl mx-auto mb-20">
            {loading ? (
              <div className="text-center py-20">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            ) : error ? (
              <div className="alert alert-error shadow-lg">
                <span>Erro ao carregar produtos: {error.message}</span>
              </div>
            ) : (
              <div className="bg-base-100 rounded-3xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-pink-600 p-6">
                  <h3 className="text-2xl font-bold text-white">
                    Resultados para: "{query}" ({filteredProducts.length})
                  </h3>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="p-20 text-center">
                    <p className="text-2xl text-base-content/60">Nenhum produto encontrado</p>
                  </div>
                ) : (
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
                        {filteredProducts.map((p: any) => (
                          <tr key={p.id} className="hover:bg-base-200 transition-colors">
                            <td className="font-semibold">{p.name}</td>
                            <td>{p.supplier || '—'}</td>
                            <td className="text-right font-medium text-base-content/70">
                              R$ {Number(p.costPrice).toFixed(2).replace('.', ',')}
                            </td>
                            <td className="text-right font-bold text-success">
                              R$ {Number(p.salePrice).toFixed(2).replace('.', ',')}
                            </td>
                            <td className="text-center">
                              <div className={`badge badge-lg font-bold ${p.quantity === 0 ? 'badge-error' : p.quantity <= 10 ? 'badge-warning' : 'badge-success'}`}>
                                {p.quantity} un
                              </div>
                            </td>
                            <td className="text-center">
                              <div className="flex justify-center gap-3">
                                <Link
                                  href={`/dashboard/produtos/editar/${p.id}`}
                                  className="btn btn-sm btn-outline btn-primary tooltip"
                                  data-tip="Editar"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </Link>

                                <DeleteButton
                                  productId={p.id}
                                  productName={p.name}
                                  onDelete={() => refetch()}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* CARD PRINCIPAL */}
        <div className="max-w-2xl mx-auto">
          <div className="card bg-base-100 shadow-2xl rounded-3xl overflow-hidden">
            <div className="card-body text-center py-16 px-12">
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-primary mb-6">
                Produtos
              </h2>

              <p className="text-base-content/70 leading-relaxed mb-10 max-w-md mx-auto">
                Gerencie seu estoque com total controle: cadastre novos produtos,
                edite preços, acompanhe quantidades e remova itens quando necessário.
              </p>

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
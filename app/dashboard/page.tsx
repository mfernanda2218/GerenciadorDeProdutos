// app/dashboard/page.tsx
'use client'

import { Suspense, useState, useEffect } from 'react'
import { useQuery, gql } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import SearchBar from '@/components/SearchBar'
import DeleteButton from '@/components/DeleteButton'
import EditModal from '@/components/EditModal'
import { atualizarProduto } from './produtos/editar/[id]/actions'

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

function DashboardContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')?.trim() || ''
  const editId = searchParams.get('edit')

  const { data: session, status } = useSession()
  const router = useRouter()

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  const { data, loading, error, refetch } = useQuery(GET_PRODUCTS_AND_COUNT, {
    variables: { search: query || undefined },
    fetchPolicy: 'cache-and-network',
  })

  // Efeito para abrir o modal via query param
  useEffect(() => {
    if (editId && data?.products) {
      const productToEdit = data.products.find((p: any) => p.id === editId)
      if (productToEdit) {
        setSelectedProduct(productToEdit)
        setEditModalOpen(true)
      }
    }
  }, [editId, data?.products])

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
  const totalProdutosAvailable = data?.totalProducts?.length || 0

  const handleClose = () => {
    setEditModalOpen(false)
    setSelectedProduct(null)
    const params = new URLSearchParams(searchParams.toString())
    params.delete('edit')
    router.replace(`/dashboard?${params.toString()}`)
  }

  const handleEdit = (product: any) => {
    setSelectedProduct(product)
    setEditModalOpen(true)
  }

  return (
    <div className="w-full">
      {/* HEADER: Welcome message and Total count */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-600">
            Olá, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-lg text-base-content/70 mt-2">
            Total no estoque: <span className="font-bold text-primary">{totalProdutosAvailable}</span> produto{totalProdutosAvailable !== 1 ? 's' : ''}
          </p>
        </div>

        <Link
          href="/dashboard/produtos/cadastrar"
          className="btn btn-primary btn-md md:btn-lg gap-2 shadow-xl hover:shadow-primary/50 hover:scale-105 transition-all w-full md:w-auto"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Produto
        </Link>
      </div>

      {/* SEARCHBAR */}
      <div className="max-w-4xl mx-auto mb-12">
        <SearchBar />
      </div>

      {/* CONTENT LIST */}
      <div className="mt-8 max-w-full mx-auto mb-20">
        {loading && !data ? (
          <div className="text-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : error ? (
          <div className="alert alert-error shadow-lg max-w-2xl mx-auto">
            <span>Erro ao carregar produtos: {error.message}</span>
          </div>
        ) : (
          <div className="bg-base-100 rounded-2xl shadow-2xl overflow-hidden border border-base-300">
            {query && (
              <div className="bg-gradient-to-r from-primary to-pink-600 p-6 flex justify-between items-center text-white">
                <h3 className="text-xl font-bold">
                  Resultados para: "{query}" ({products.length})
                </h3>
              </div>
            )}

            {products.length === 0 ? (
              <div className="p-20 text-center">
                <svg className="w-20 h-20 mx-auto text-base-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-xl text-base-content/60 font-medium">Nenhum produto encontrado</p>
                {query && (
                  <button 
                    onClick={() => router.replace('/dashboard')}
                    className="btn btn-link btn-secondary mt-2"
                  >
                    Limpar busca
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-compact sm:table-lg w-full">
                  <thead>
                    <tr className="bg-base-200">
                      <th className="font-bold">Produto</th>
                      <th className="font-bold hidden lg:table-cell">Fornecedor</th>
                      <th className="font-bold text-right hidden md:table-cell whitespace-nowrap">Preço Custo</th>
                      <th className="font-bold text-right whitespace-nowrap">Preço Venda</th>
                      <th className="font-bold text-center">Estoque</th>
                      <th className="font-bold text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p: any) => (
                      <tr key={p.id} className="hover:bg-base-100 transition-colors border-b border-base-200 last:border-0">
                        <td className="font-bold text-base md:text-lg min-w-[120px]">{p.name}</td>
                        <td className="hidden lg:table-cell text-base-content/70">{p.supplier || '—'}</td>
                        <td className="text-right font-medium text-base-content/60 hidden md:table-cell whitespace-nowrap">
                          R$ {Number(p.costPrice).toFixed(2).replace('.', ',')}
                        </td>
                        <td className="text-right font-black text-success text-base md:text-xl whitespace-nowrap">
                          R$ {Number(p.salePrice).toFixed(2).replace('.', ',')}
                        </td>
                        <td className="text-center">
                          <div className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full font-bold text-xs md:text-sm whitespace-nowrap min-w-[70px] ${
                            p.quantity === 0 
                              ? 'bg-error/20 text-error border border-error/30' 
                              : p.quantity <= 10 
                              ? 'bg-warning/20 text-warning border border-warning/30' 
                              : 'bg-success/20 text-success border border-success/30'
                          }`}>
                            {p.quantity} un
                          </div>
                        </td>
                        <td className="text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(p)}
                              className="btn btn-xs sm:btn-sm btn-outline btn-primary"
                              aria-label="Editar"
                            >
                              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>

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

      {selectedProduct && (
        <EditModal
          key={selectedProduct.id}
          produto={{
            id: selectedProduct.id,
            name: selectedProduct.name,
            supplier: selectedProduct.supplier,
            salePrice: selectedProduct.salePrice,
            costPrice: selectedProduct.costPrice,
            quantity: selectedProduct.quantity,
          }}
          isOpen={editModalOpen}
          onClose={handleClose}
          onUpdate={atualizarProduto}
          onRefetch={() => refetch()}
        />
      )}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
// app/dashboard/produtos/page.tsx
'use client'

import { useQuery, gql } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import EditModal from '@/components/EditModal'
import DeleteButton from '@/components/DeleteButton'
import { atualizarProduto } from './editar/[id]/actions'

const GET_ALL_PRODUCTS = gql`
  query GetAllProducts {
    products {
      id
      name
      supplier
      salePrice
      costPrice
      quantity
      createdAt
    }
  }
`

export default function ProdutosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  const { data, loading, error, refetch } = useQuery(GET_ALL_PRODUCTS, {
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

  const products = data?.products || []

  const handleEdit = (product: any) => {
    setSelectedProduct(product)
    setEditModalOpen(true)
  }

  const content = (
    <div className="min-h-screen bg-base-200 py-10">
      <div className="container mx-auto px-6 max-w-7xl">

        {/* HEADER */}
        <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-600">
              Todos os Produtos
            </h1>
            <p className="text-lg text-base-content/70 mt-2">
              Total: <span className="font-bold text-primary">{products.length}</span> produto{products.length !== 1 ? 's' : ''}
            </p>
          </div>

          <Link
            href="/dashboard/produtos/cadastrar"
            className="btn btn-primary btn-lg gap-3 shadow-xl hover:shadow-primary/50 hover:scale-105 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo Produto
          </Link>
        </div>

        {/* LOADING */}
        {loading && !data && (
          <div className="text-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}

        {/* ERRO */}
        {error && (
          <div className="alert alert-error shadow-lg mb-10">
            <span>Erro ao carregar produtos: {error.message}</span>
          </div>
        )}

        {/* TABELA */}
        {products.length > 0 ? (
          <div className="bg-base-100 rounded-3xl shadow-2xl overflow-hidden">
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
                  {products.map((p: any) => (
                    <tr key={p.id} className="hover:bg-base-200 transition-colors">
                      <td className="font-semibold text-lg">{p.name}</td>
                      <td>{p.supplier || '—'}</td>
                      <td className="text-right font-medium text-base-content/70">
                        R$ {Number(p.costPrice).toFixed(2).replace('.', ',')}
                      </td>
                      <td className="text-right font-bold text-success text-xl">
                        R$ {Number(p.salePrice).toFixed(2).replace('.', ',')}
                      </td>
                      <td className="text-center">
                        <div className={`badge badge-lg font-bold ${p.quantity === 0 ? 'badge-error' : p.quantity <= 10 ? 'badge-warning' : 'badge-success'}`}>
                          {p.quantity} un
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleEdit(p)}
                            className="btn btn-sm btn-outline btn-primary tooltip"
                            data-tip="Editar"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <svg className="w-24 h-24 mx-auto text-base-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-2xl font-bold text-base-content/60 mb-4">
                Nenhum produto cadastrado
              </h3>
              <p className="text-base-content/50 mb-8">
                Comece agora cadastrando seu primeiro produto!
              </p>
              <Link
                href="/dashboard/produtos/cadastrar"
                className="btn btn-primary btn-lg"
              >
                Cadastrar Primeiro Produto
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  )

  // Modals fora do return principal para não afetar o layout
  return (
    <>
      {content}
      
      {selectedProduct && (
        <>
          {editModalOpen && (
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
              onClose={() => setEditModalOpen(false)}
              onUpdate={atualizarProduto}
              onRefetch={() => refetch()}
            />
          )}
        </>
      )}
    </>
  )
}
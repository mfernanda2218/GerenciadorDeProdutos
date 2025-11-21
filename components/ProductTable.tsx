'use client'

import Link from 'next/link'
import { useMutation } from '@apollo/client'
import { DELETE_PRODUCT } from '@/graphql/mutations'
import { PRODUCTS_QUERY } from '@/graphql/queries'

type Product = {
  id: string
  name: string
  salePrice: number
  costPrice: number
  quantity: number
  supplier: string
}

type Props = {
  products: Product[]
}

export default function ProductTable({ products }: Props) {
  const [deleteProduct, { loading: deleting }] = useMutation(DELETE_PRODUCT, {
    refetchQueries: [{ query: PRODUCTS_QUERY }],
  })

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que quer excluir este produto?')) {
      await deleteProduct({ variables: { id } })
    }
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Nenhum produto cadastrado ainda.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Nome</th>
            <th className="text-right">Preço Venda</th>
            <th className="text-right">Preço Custo</th>
            <th className="text-center">Qtd.</th>
            <th>Fornecedor</th>
            <th className="text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="font-medium">{product.name}</td>
              <td className="text-right">
                R$ {product.salePrice.toFixed(2).replace('.', ',')}
              </td>
              <td className="text-right">
                R$ {product.costPrice.toFixed(2).replace('.', ',')}
              </td>
              <td className="text-center">{product.quantity}</td>
              <td>{product.supplier}</td>
              <td className="text-center">
                <div className="flex justify-center gap-2">
                  <Link
                    href={`/dashboard/edit/${product.id}`}
                    className="btn btn-sm btn-outline btn-info"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={deleting}
                    className="btn btn-sm btn-outline btn-error"
                  >
                    {deleting ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      'Excluir'
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
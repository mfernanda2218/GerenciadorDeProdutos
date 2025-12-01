// components/DeleteButton.tsx
'use client'

import { useMutation } from '@apollo/client'
import { DELETE_PRODUCT } from '@/app/graphql/mutations/deleteProduct'

type Props = {
  productId: string
  productName: string
  onDelete?: () => void
}

export default function DeleteButton({ productId, productName, onDelete }: Props) {
  const [deleteProduct, { loading }] = useMutation(DELETE_PRODUCT)

  const handleDelete = async () => {
    if (!confirm(`Tem certeza que quer excluir permanentemente:\n"${productName}"?`)) return

    try {
      await deleteProduct({ 
        variables: { id: productId } 
      })
      onDelete?.()
    } catch (error: any) {
      alert('Erro ao excluir: ' + error.message)
    }
  }

  return (
    <button 
      onClick={handleDelete} 
      disabled={loading}
      className="btn btn-sm btn-error btn-outline tooltip"
      data-tip="Excluir produto"
    >
      {loading ? 'Excluindo...' : 'Excluir'}
    </button>
  )
}
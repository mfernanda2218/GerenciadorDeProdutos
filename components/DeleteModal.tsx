// components/DeleteModal.tsx
'use client'

import { useMutation } from '@apollo/client'
import { DELETE_PRODUCT } from '@/app/graphql/mutations/deleteProduct'

type DeleteModalProps = {
  productId: string
  productName: string
  isOpen: boolean
  onClose: () => void
  onDelete?: () => void
}

export default function DeleteModal({ productId, productName, isOpen, onClose, onDelete }: DeleteModalProps) {
  const [deleteProduct, { loading }] = useMutation(DELETE_PRODUCT)

  const handleDelete = async () => {
    try {
      await deleteProduct({ 
        variables: { id: productId } 
      })
      onDelete?.()
      onClose()
    } catch (error: any) {
      alert('Erro ao excluir: ' + error.message)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-xl mb-4">Confirmar Exclusão</h3>
        
        <div className="py-4">
          <p className="text-base-content/80">
            Tem certeza que deseja excluir permanentemente o produto:
          </p>
          <p className="font-bold text-lg mt-2 text-error">{productName}</p>
          <p className="text-sm text-base-content/60 mt-4">
            Esta ação não pode ser desfeita.
          </p>
        </div>

        <div className="modal-action">
          <button
            onClick={onClose}
            className="btn btn-ghost"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="btn btn-error"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Excluindo...
              </>
            ) : (
              'Excluir Produto'
            )}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  )
}

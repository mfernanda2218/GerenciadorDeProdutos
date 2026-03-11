// components/EditModal.tsx
'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { useEffect } from 'react'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-primary btn-lg flex-1"
    >
      {pending ? 'Salvando...' : 'Salvar Alterações'}
    </button>
  )
}

type EditModalProps = {
  produto: {
    id: number
    name: string
    supplier: string | null
    salePrice: number
    costPrice: number
    quantity: number
  }
  isOpen: boolean
  onClose: () => void
  onUpdate: (prevState: any, formData: FormData) => Promise<{ error?: string; success?: boolean }>
}

export default function EditModal({ produto, isOpen, onClose, onUpdate }: EditModalProps) {
  const [state, formAction] = useFormState(onUpdate, {})

  useEffect(() => {
    if (state?.success) {
      onClose()
    }
  }, [state?.success, onClose])

  if (!isOpen) return null

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl">
        <h3 className="font-bold text-2xl mb-6">Editar Produto</h3>
        
        {state?.error && (
          <div className="alert alert-error shadow-lg mb-6">
            <span>
              {state.error === 'nome' && 'O nome deve ter pelo menos 2 caracteres.'}
              {state.error === 'venda' && 'Preço de venda deve ser maior que zero.'}
              {state.error === 'custo' && 'Preço de custo não pode ser negativo.'}
              {state.error === 'quantidade' && 'Quantidade não pode ser negativa.'}
              {typeof state.error === 'string' && !['nome', 'venda', 'custo', 'quantidade'].includes(state.error) && state.error}
            </span>
          </div>
        )}

        <form action={formAction}>
          <input type="hidden" name="id" value={produto.id} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              name="name"
              type="text"
              defaultValue={produto.name}
              placeholder="Nome do produto *"
              className="input input-bordered input-lg"
              required
            />
            <input
              name="supplier"
              type="text"
              defaultValue={produto.supplier || ''}
              placeholder="Fornecedor"
              className="input input-bordered input-lg"
            />
            <input
              name="salePrice"
              type="number"
              step="0.01"
              min="0.01"
              defaultValue={produto.salePrice.toFixed(2)}
              placeholder="Preço de venda (R$)"
              className="input input-bordered input-lg"
              required
            />
            <input
              name="costPrice"
              type="number"
              step="0.01"
              min="0"
              defaultValue={produto.costPrice.toFixed(2)}
              placeholder="Preço de custo (R$)"
              className="input input-bordered input-lg"
              required
            />
            <input
              name="quantity"
              type="number"
              min="0"
              defaultValue={produto.quantity}
              placeholder="Quantidade em estoque"
              className="input input-bordered input-lg"
              required
            />
          </div>

          <div className="modal-action">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-lg"
            >
              Cancelar
            </button>
            <SubmitButton />
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  )
}

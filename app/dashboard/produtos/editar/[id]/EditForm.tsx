// app/dashboard/produtos/editar/[id]/EditForm.tsx
'use client'

import { useFormState, useFormStatus } from 'react-dom'  // ← Volta pra isso!
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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

type EditFormProps = {
  produto: {
    id: number
    name: string
    supplier: string | null
    salePrice: number
    costPrice: number
    quantity: number
  }
  initialError?: string
  onUpdate: (prevState: any, formData: FormData) => Promise<{ error?: string; success?: boolean }>
}

export default function EditForm({ produto, initialError, onUpdate }: EditFormProps) {
  // ← useFormState continua funcionando perfeitamente
  const [state, formAction] = useFormState(onUpdate, { error: initialError })

  const router = useRouter()

  useEffect(() => {
    if (state?.success) {
      router.push('/dashboard/produtos?success=1')
      router.refresh() // opcional, mas bom pra atualizar a lista
    }
  }, [state?.success, router])

  return (
    <div className="card bg-base-100 shadow-2xl">
      <div className="card-body">
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

            <div className="md:col-span-2 flex gap-4 mt-8">
              <Link href="/dashboard/produtos" className="btn btn-ghost btn-lg flex-1">
                Cancelar
              </Link>
              <SubmitButton />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
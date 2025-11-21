'use client'
import { useMutation } from '@apollo/client'
import { CREATE_PRODUCT, UPDATE_PRODUCT } from '@/graphql/mutations'
import { PRODUCTS_QUERY } from '@/graphql/queries'

type Props = {
  product?: any
  onSuccess: () => void
}

export default function ProductForm({ product, onSuccess }: Props) {
  const [createProduct] = useMutation(CREATE_PRODUCT, {
    refetchQueries: [{ query: PRODUCTS_QUERY }]
  })
  const [updateProduct] = useMutation(UPDATE_PRODUCT, {
    refetchQueries: [{ query: PRODUCTS_QUERY }]
  })

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const data = {
      name: formData.get('name') as string,
      salePrice: parseFloat(formData.get('salePrice') as string),
      costPrice: parseFloat(formData.get('costPrice') as string),
      quantity: parseInt(formData.get('quantity') as string),
      supplier: formData.get('supplier') as string,
    }

    if (product) {
      await updateProduct({ variables: { id: product.id, ...data } })
    } else {
      await createProduct({ variables: data })
    }
    onSuccess()
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="label">Nome</label>
        <input name="name" defaultValue={product?.name} required className="input input-bordered w-full" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Preço de Venda</label>
          <input name="salePrice" type="number" step="0.01" defaultValue={product?.salePrice} required className="input input-bordered w-full" />
        </div>
        <div>
          <label className="label">Preço de Custo</label>
          <input name="costPrice" type="number" step="0.01" defaultValue={product?.costPrice} required className="input input-bordered w-full" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Quantidade</label>
          <input name="quantity" type="number" defaultValue={product?.quantity || 0} required className="input input-bordered w-full" />
        </div>
        <div>
          <label className="label">Fornecedor</label>
          <input name="supplier" defaultValue={product?.supplier} required className="input input-bordered w-full" />
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" className="btn btn-primary">
          {product ? 'Atualizar' : 'Criar'} Produto
        </button>
        <button type="button" onClick={() => history.back()} className="btn btn-ghost">
          Cancelar
        </button>
      </div>
    </form>
  )
}
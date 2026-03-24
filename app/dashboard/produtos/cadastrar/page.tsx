'use client'

import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CREATE_PRODUCT } from '@/app/graphql/mutations/createProduct'

interface FormData {
  name: string
  supplier: string
  costPrice: string
  salePrice: string
  quantity: string
}

export default function CadastrarProdutoPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    supplier: '',
    costPrice: '',
    salePrice: '',
    quantity: ''
  })

  const [createProduct, { loading, error }] = useMutation(CREATE_PRODUCT, {
    onCompleted: () => {
      router.push('/dashboard')
      router.refresh()
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await createProduct({
        variables: {
          input: {
            name: formData.name,
            supplier: formData.supplier || null,
            costPrice: parseFloat(formData.costPrice.replace(',', '.')),
            salePrice: parseFloat(formData.salePrice.replace(',', '.')),
            quantity: parseInt(formData.quantity, 10)
          }
        }
      })
    } catch (err) {
      console.error("Erro ao criar produto:", err)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* HEADER / BREADCRUMB */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="btn btn-circle btn-ghost">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-base-content">Novo Produto</h1>
          <p className="text-sm md:text-base text-base-content/60">Preencha as informações para cadastrar um item.</p>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Nome do Produto */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold">Nome do Produto <span className="text-error">*</span></span>
              </label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Ex: Camisa de algodão" 
                className="input input-bordered w-full focus:input-primary h-12 md:h-14" 
              />
            </div>

            {/* Fornecedor */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold">Fornecedor</span>
              </label>
              <input 
                type="text" 
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                placeholder="Ex: Fornecedor x" 
                className="input input-bordered w-full focus:input-primary h-12 md:h-14" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {/* Preço de Custo */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-bold">Custo (R$) <span className="text-error">*</span></span>
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  name="costPrice"
                  value={formData.costPrice}
                  onChange={handleChange}
                  required
                  placeholder="0.00" 
                  className="input input-bordered w-full focus:input-primary" 
                />
              </div>

              {/* Preço de Venda */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-bold">Venda (R$) <span className="text-error">*</span></span>
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleChange}
                  required
                  placeholder="0.00" 
                  className="input input-bordered w-full focus:input-primary" 
                />
              </div>

              {/* Quantidade */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-bold">Estoque <span className="text-error">*</span></span>
                </label>
                <input 
                  type="number" 
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  placeholder="0" 
                  className="input input-bordered w-full focus:input-primary" 
                />
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="alert alert-error shadow-lg">
                <svg className="stroke-current flex-shrink-0 w-6 h-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Erro ao cadastrar: {error.message}</span>
              </div>
            )}

            {/* Actions */}
            <div className="card-actions justify-end mt-8 pt-4 border-t border-base-200 gap-3">
              <Link href="/dashboard" className="btn btn-ghost flex-1 md:flex-none">
                Cancelar
              </Link>
              <button 
                type="submit" 
                className={`btn btn-primary px-8 flex-1 md:flex-none ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar Produto'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}
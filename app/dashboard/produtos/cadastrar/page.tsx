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
      router.push('/dashboard/produtos')
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
    <div className="min-h-screen bg-base-200 py-10">
      <div className="container mx-auto px-4 max-w-3xl">
        
        {/* HEADER / BREADCRUMB */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/produtos" className="btn btn-circle btn-ghost">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-base-content">Novo Produto</h1>
            <p className="text-base-content/60">Preencha as informações abaixo para cadastrar um item.</p>
          </div>
        </div>

        {/* FORM CARD */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Nome do Produto */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Nome do Produto <span className="text-error">*</span></span>
                </label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Camisa de algodão" 
                  className="input input-bordered w-full focus:input-primary" 
                />
              </div>

              {/* Fornecedor */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Fornecedor</span>
                </label>
                <input 
                  type="text" 
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  placeholder="Ex: Fornecedor x" 
                  className="input input-bordered w-full focus:input-primary" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Preço de Custo */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Preço de Custo (R$) <span className="text-error">*</span></span>
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
                    <span className="label-text font-medium">Preço de Venda (R$) <span className="text-error">*</span></span>
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
                    <span className="label-text font-medium">Quantidade em Estoque <span className="text-error">*</span></span>
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
              <div className="card-actions justify-end mt-8 pt-4 border-t border-base-200">
                <Link href="/dashboard/produtos" className="btn btn-ghost">
                  Cancelar
                </Link>
                <button 
                  type="submit" 
                  className={`btn btn-primary px-8 ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Salvar Produto'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
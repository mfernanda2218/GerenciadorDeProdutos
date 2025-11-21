// app/dashboard/produtos/novo/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

async function criarProduto(formData: FormData) {
  'use server'

  const session = await auth()
  
  // Proteção dupla
  if (!session?.user?.id) {
    throw new Error('Usuário não autenticado')
  }

  const name = formData.get('name') as string
  const salePrice = Number(formData.get('salePrice'))
  const costPrice = Number(formData.get('costPrice'))
  const quantity = Number(formData.get('quantity'))
  const supplier = formData.get('supplier') as string

  if (!name || !supplier || isNaN(salePrice) || isNaN(costPrice) || isNaN(quantity)) {
    throw new Error('Todos os campos são obrigatórios')
  }

  await prisma.product.create({
    data: {
      name,
      salePrice,
      costPrice,
      quantity,
      supplier,
      userId: session.user.id, // ← agora 100% garantido que existe
    },
  })

  redirect('/dashboard/produtos')
}

export default async function NovoProdutoPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/produtos" className="btn btn-ghost btn-circle">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-3xl font-bold">Novo Produto</h1>
      </div>

      <form action={criarProduto} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Nome do produto *</span>
            </label>
            <input
              name="name"
              type="text"
              className="input input-bordered"
              required
              placeholder="Ex: Camiseta Algodão Preta"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Fornecedor *</span>
            </label>
            <input
              name="supplier"
              type="text"
              className="input input-bordered"
              required
              placeholder="Ex: Fornecedora XYZ"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Preço de venda (R$) *</span>
            </label>
            <input
              name="salePrice"
              type="number"
              step="0.01"
              min="0"
              className="input input-bordered"
              required
              placeholder="89.90"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Preço de custo (R$) *</span>
            </label>
            <input
              name="costPrice"
              type="number"
              step="0.01"
              min="0"
              className="input input-bordered"
              required
              placeholder="45.00"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Quantidade em estoque *</span>
            </label>
            <input
              name="quantity"
              type="number"
              min="0"
              className="input input-bordered"
              required
              placeholder="100"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button type="submit" className="btn btn-primary flex-1">
            Salvar Produto
          </button>
          <Link href="/dashboard/produtos" className="btn btn-ghost flex-1">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
// app/dashboard/produtos/editar/[id]/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

type Props = {
  params: { id: string }
  searchParams: { error?: string }
}

async function atualizarProduto(formData: FormData, productId: number) {
  'use server'

  const session = await auth()
  if (!session?.user?.email) redirect('/login')

  const name = (formData.get('name') as string)?.trim()
  const supplier = (formData.get('supplier') as string)?.trim() || null
  const salePrice = Number(formData.get('salePrice'))
  const costPrice = Number(formData.get('costPrice'))
  const quantity = Number(formData.get('quantity'))

  if (!name || name.length < 2) return redirect(`/dashboard/produtos/editar/${productId}?error=nome`)
  if (isNaN(salePrice) || salePrice <= 0) return redirect(`/dashboard/produtos/editar/${productId}?error=venda`)
  if (isNaN(costPrice) || costPrice < 0) return redirect(`/dashboard/produtos/editar/${productId}?error=custo`)
  if (isNaN(quantity) || quantity < 0) return redirect(`/dashboard/produtos/editar/${productId}?error=quantidade`)

  await prisma.product.update({
    where: { id: productId },
    data: { name, supplier, salePrice, costPrice, quantity },
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/produtos')
  redirect('/dashboard/produtos?success=1')
}

export default async function EditarProdutoPage({ params, searchParams }: Props) {
  const session = await auth()
  if (!session?.user?.email) redirect('/login')

  // CONVERTE STRING → NUMBER
  const productId = parseInt(params.id, 10)
  if (isNaN(productId)) redirect('/dashboard/produtos')

  const produto = await prisma.product.findUnique({
    where: { id: productId }, // ← agora é number!
    select: {
      id: true,
      name: true,
      supplier: true,
      salePrice: true,
      costPrice: true,
      quantity: true,
    },
  })

  if (!produto) redirect('/dashboard/produtos')

  const salePriceStr = produto.salePrice.toString()
  const costPriceStr = produto.costPrice.toString()
  const error = searchParams.error

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-xl sticky top-0 z-50">
        <div className="flex-1">
          <Link href="/dashboard" className="btn btn-ghost text-2xl font-bold text-primary">
            Gerenciador
          </Link>
        </div>
      </div>

      <div className="container mx-auto p-8 pt-20 max-w-4xl">
        <div className="flex items-center gap-4 mb-10">
          <Link href="/dashboard/produtos" className="btn btn-ghost btn-circle">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-4xl font-bold text-primary">Editar Produto</h1>
        </div>

        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body">
            {error && (
              <div className="alert alert-error shadow-lg mb-6">
                <span>Preencha todos os campos corretamente.</span>
              </div>
            )}

            <form action={(fd) => atualizarProduto(fd, productId)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input name="name" type="text" defaultValue={produto.name} placeholder="Nome do produto *" className="input input-bordered input-lg" required />
                <input name="supplier" type="text" defaultValue={produto.supplier || ''} placeholder="Fornecedor" className="input input-bordered input-lg" />
                <input name="salePrice" type="number" step="0.01" defaultValue={salePriceStr} placeholder="Preço de venda (R$)" className="input input-bordered input-lg" required />
                <input name="costPrice" type="number" step="0.01" defaultValue={costPriceStr} placeholder="Preço de custo (R$)" className="input input-bordered input-lg" required />
                <input name="quantity" type="number" defaultValue={produto.quantity} placeholder="Quantidade em estoque" className="input input-bordered input-lg" required />
                <div className="md:col-span-2 flex gap-4 mt-6">
                  <Link href="/dashboard/produtos" className="btn btn-ghost btn-lg flex-1">Cancelar</Link>
                  <button type="submit" className="btn btn-primary btn-lg flex-1">Salvar Alterações</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
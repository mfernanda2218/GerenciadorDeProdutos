// app/dashboard/produtos/editar/[id]/page.tsx

import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import EditForm from './EditForm'
import { atualizarProduto } from './actions'  // ← importe aqui

export default async function EditarProdutoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { id: productId } = await params
  const { error: initialError } = await searchParams

  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const parsedId = Number(productId)
  if (isNaN(parsedId) || parsedId <= 0) {
    redirect('/dashboard/produtos?error=invalid_id')
  }

  const produto = await prisma.product.findUnique({
    where: { id: parsedId },
  })

  if (!produto) {
    redirect('/dashboard/produtos?error=not_found')
  }

  return (
    <div className="min-h-screen bg-base-200">

      <div className="container mx-auto p-8 pt-20 max-w-4xl">
        <div className="flex items-center gap-4 mb-10">
          <Link href="/dashboard/produtos" className="btn btn-ghost btn-circle">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-3xl font-bold">Editar Produto</h1>
        </div>

        <EditForm
          produto={{
            id: produto.id,
            name: produto.name,
            supplier: produto.supplier || '',
            salePrice: Number(produto.salePrice),
            costPrice: Number(produto.costPrice),
            quantity: produto.quantity,
          }}
          initialError={initialError}
          onUpdate={atualizarProduto}
        />
      </div>
    </div>
  )
}
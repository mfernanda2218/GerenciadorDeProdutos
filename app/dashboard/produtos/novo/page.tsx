// app/dashboard/produtos/novo/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { Decimal } from '@prisma/client/runtime/library'

async function criarProduto(formData: FormData) {
  'use server'

  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  // CORRETO: userId é STRING (UUID) — NUNCA MAIS USE Number()!
  const userId = session.user.id as string

  // Dados do formulário
  const name = (formData.get('name') as string)?.trim()
  const supplier = (formData.get('supplier') as string)?.trim() || null
  const salePriceRaw = formData.get('salePrice')
  const costPriceRaw = formData.get('costPrice')
  const quantityRaw = formData.get('quantity')

  // Validação básica
  if (!name || name.length < 2) return redirect('/dashboard/produtos/novo?error=nome')
  if (!supplier || supplier.length < 2) return redirect('/dashboard/produtos/novo?error=fornecedor')

  const salePrice = Number(salePriceRaw)
  const costPrice = Number(costPriceRaw)
  const quantity = Number(quantityRaw)

  if (isNaN(salePrice) || salePrice <= 0) return redirect('/dashboard/produtos/novo?error=venda')
  if (isNaN(costPrice) || costPrice < 0) return redirect('/dashboard/produtos/novo?error=custo')
  if (isNaN(quantity) || quantity < 0) return redirect('/dashboard/produtos/novo?error=quantidade')

  try {
    await prisma.product.create({
      data: {
        name,
        supplier,
        salePrice: new Decimal(salePrice),
        costPrice: new Decimal(costPrice),
        quantity,
        userId, // ← AGORA É STRING (UUID) → FUNCIONA!
      },
    })

    revalidatePath('/dashboard/produtos')
    revalidatePath('/dashboard') // atualiza o contador do dashboard
    redirect('/dashboard/produtos?success=1')
  } catch (error: any) {
    // NEXT_REDIRECT é um erro "falso" — é só o redirecionamento funcionando
    if (error?.digest?.includes('NEXT_REDIRECT')) {
      // Deixa o redirect acontecer normalmente (não faz nada aqui)
      return
    }

    // Só cai aqui se for erro de verdade (banco, validação, etc)
    console.error('Erro REAL ao criar produto:', error)
    return redirect('/dashboard/produtos/novo?error=servidor')
  }
}

export default async function NovoProdutoPage({
  searchParams,
}: {
  searchParams: { error?: string; success?: string }
}) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const error = searchParams.error
  const success = searchParams.success

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/produtos" className="btn btn-ghost btn-circle">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-3xl font-bold">Novo Produto</h1>
      </div>

      {/* Mensagem de sucesso */}
      {success && (
        <div className="alert alert-success shadow-lg mb-8">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Produto criado com sucesso!</span>
        </div>
      )}

      {/* Mensagem de erro */}
      {error && (
        <div className="alert alert-error shadow-lg mb-8">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <div>
            <strong>Erro:</strong>{' '}
            {error === 'nome' && 'Nome do produto inválido (mín. 2 caracteres)'}
            {error === 'fornecedor' && 'Fornecedor inválido (mín. 2 caracteres)'}
            {error === 'venda' && 'Preço de venda deve ser maior que zero'}
            {error === 'custo' && 'Preço de custo inválido'}
            {error === 'quantidade' && 'Quantidade inválida'}
            {error === 'servidor' && 'Erro interno. Tente novamente.'}
          </div>
        </div>
      )}

      <form action={criarProduto} className="space-y-8 bg-base-100 p-10 rounded-2xl shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="form-control">
            <label className="label"><span className="label-text font-bold text-lg">Nome do produto *</span></label>
            <input name="name" type="text" required className="input input-bordered input-lg" placeholder="Camiseta Básica" />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text font-bold text-lg">Fornecedor *</span></label>
            <input name="supplier" type="text" required className="input input-bordered input-lg" placeholder="Fornecedor XYZ" />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text font-bold text-lg">Preço de venda (R$) *</span></label>
            <input name="salePrice" type="number" step="0.01" min="0.01" required className="input input-bordered input-lg" placeholder="89.90" />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text font-bold text-lg">Preço de custo (R$) *</span></label>
            <input name="costPrice" type="number" step="0.01" min="0" required className="input input-bordered input-lg" placeholder="45.00" />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text font-bold text-lg">Quantidade em estoque *</span></label>
            <input name="quantity" type="number" min="0" required className="input input-bordered input-lg" placeholder="100" />
          </div>
        </div>

        <div className="flex justify-end gap-6 pt-8">
          <Link href="/dashboard/produtos" className="btn btn-ghost btn-lg px-10">
            Cancelar
          </Link>
          <button type="submit" className="btn btn-primary btn-lg px-12">
            Salvar Produto
          </button>
        </div>
      </form>
    </div>
  )
}
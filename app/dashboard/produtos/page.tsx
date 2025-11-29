// app/dashboard/produtos/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import DeleteButton from '@/components/DeleteButton'

async function criarProduto(formData: FormData) {
  'use server'

  const session = await auth()
  if (!session?.user?.email) redirect('/login')

  let user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
    user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: {},
      create: {
        email: session.user.email,
        name: session.user.name || 'Usuário',
        image: session.user.image,
      }
    })
  }

  const name = (formData.get('name') as string)?.trim()
  const supplier = (formData.get('supplier') as string)?.trim() || null
  const salePrice = Number(formData.get('salePrice'))
  const costPrice = Number(formData.get('costPrice'))
  const quantity = Number(formData.get('quantity'))

  if (!name || name.length < 2) return redirect('/dashboard/produtos?error=nome')
  if (isNaN(salePrice) || salePrice <= 0) return redirect('/dashboard/produtos?error=venda')
  if (isNaN(costPrice) || costPrice < 0) return redirect('/dashboard/produtos?error=custo')
  if (isNaN(quantity) || quantity < 0) return redirect('/dashboard/produtos?error=quantidade')

  await prisma.product.create({
    data: {
      name,
      supplier,
      salePrice,
      costPrice,
      quantity,
      userId: user.id,
    },
  })

  revalidatePath('/dashboard/produtos')
  revalidatePath('/dashboard')
  redirect('/dashboard/produtos?success=1')
}

// Função de deletar — 100% funcional com ID Int
async function deleteProduct(productId: number) {
  'use server'

  await prisma.product.delete({
    where: { id: productId }
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/produtos')
}

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: { error?: string; success?: string }
}) {
  const session = await auth()
  if (!session?.user?.email) redirect('/login')

  const error = searchParams.error
  const success = searchParams.success

  const produtos = await prisma.product.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-base-200">
      {/* NAVBAR */}
      <div className="navbar bg-base-100 shadow-xl sticky top-0 z-50">
        <div className="flex-1">
          <h1 className="text-2xl font-bold px-6 text-primary">Gerenciador</h1>
        </div>
      </div>

      <div className="container mx-auto p-8 pt-12">
        {/* VOLTAR + TÍTULO */}
        <div className="flex items-center gap-4 mb-10">
          <Link href="/dashboard" className="btn btn-ghost btn-circle">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-4xl font-bold text-primary">Produtos</h1>
        </div>

        {/* FORMULÁRIO DE CADASTRO */}
        <div className="card bg-base-100 shadow-2xl mb-12">
          <div className="card-body">
            {success && (
              <div className="alert alert-success shadow-lg mb-8">
                <span>Produto cadastrado com sucesso!</span>
              </div>
            )}
            {error && (
              <div className="alert alert-error shadow-lg mb-8">
                <span>Preencha todos os campos corretamente.</span>
              </div>
            )}

            <form action={criarProduto} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <input name="name" type="text" required placeholder="Nome do produto *" className="input input-bordered input-lg" />
              <input name="supplier" type="text" placeholder="Fornecedor" className="input input-bordered input-lg" />
              <input name="salePrice" type="number" step="0.01" required placeholder="Preço de venda (R$)" className="input input-bordered input-lg" />
              <input name="costPrice" type="number" step="0.01" required placeholder="Preço de custo (R$)" className="input input-bordered input-lg" />
              <input name="quantity" type="number" required placeholder="Quantidade em estoque" className="input input-bordered input-lg" />
              <div className="md:col-span-2 lg:col-span-3">
                <button type="submit" className="btn btn-primary btn-lg w-full">
                  Cadastrar Produto
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* TABELA COMPLETA COM TODAS AS COLUNAS */}
        <div className="card bg-base-100 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-pink-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">
              Todos os Produtos ({produtos.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-lg">
              <thead>
                <tr className="bg-base-300">
                  <th>Produto</th>
                  <th>Fornecedor</th>
                  <th className="text-right">Preço Custo</th>
                  <th className="text-right">Preço Venda</th>
                  <th className="text-center">Estoque</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtos.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-20 text-xl text-base-content/50">
                      Nenhum produto cadastrado ainda
                    </td>
                  </tr>
                ) : (
                  produtos.map((p) => (
                    <tr key={p.id} className="hover:bg-base-200 transition-colors">
                      <td className="font-semibold">{p.name}</td>
                      <td>{p.supplier || '—'}</td>
                      <td className="text-right font-medium text-base-content/70">
                        R$ {Number(p.costPrice).toFixed(2).replace('.', ',')}
                      </td>
                      <td className="text-right font-bold text-success">
                        R$ {Number(p.salePrice).toFixed(2).replace('.', ',')}
                      </td>
                      <td className="text-center">
                        <div className={`badge badge-lg font-bold ${p.quantity === 0 ? 'badge-error' : p.quantity <= 10 ? 'badge-warning' : 'badge-success'}`}>
                          {p.quantity} un
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="flex justify-center gap-3">
                          {/* EDITAR */}
                          <Link
                            href={`/dashboard/produtos/editar/${p.id}`}
                            className="btn btn-sm btn-outline btn-primary tooltip"
                            data-tip="Editar"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>

                          {/* DELETAR */}
                          <DeleteButton productId={p.id} productName={p.name} />

                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
// app/dashboard/produtos/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function ProdutosPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  // Busca apenas os produtos do usuário logado
  const produtos = await prisma.product.findMany({
    where: { userId: session.user.id as string },
    orderBy: { createdAt: 'desc' },
  })

  const totalProdutos = produtos.length
  const totalValorEstoque = produtos.reduce((acc, p) => acc + Number(p.salePrice) * p.quantity, 0)

  return (
    <div className="container mx-auto p-6">
      {/* Header + Botão Novo */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold">Meus Produtos</h1>
          <p className="text-base-content/70 mt-1">
            {totalProdutos} produto{totalProdutos !== 1 ? 's' : ''} cadastrado{totalProdutos !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/dashboard/produtos/novo"
          className="btn btn-primary gap-2 shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Produto
        </Link>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-title">Total em Estoque</div>
            <div className="stat-value text-primary">{totalProdutos}</div>
          </div>
        </div>
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-title">Valor Total (Venda)</div>
            <div className="stat-value text-success">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValorEstoque)}
            </div>
          </div>
        </div>
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-title">Produtos com Baixo Estoque</div>
            <div className="stat-value text-warning">
              {produtos.filter(p => p.quantity <= 5).length}
            </div>
          </div>
        </div>
      </div>

      {/* Lista de produtos */}
      {produtos.length === 0 ? (
        <div className="text-center py-20">
          <div className="bg-base-200 border-2 border-dashed rounded-xl w-32 h-32 mx-auto mb-6 flex items-center justify-center">
            <svg className="w-16 h-16 text-base-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.01M8 9h8" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold mb-4">Nenhum produto cadastrado</h3>
          <p className="text-base-content/70 mb-8">Comece adicionando seu primeiro produto</p>
          <Link href="/dashboard/produtos/novo" className="btn btn-primary btn-lg">
            Cadastrar Primeiro Produto
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-box shadow-xl">
          <table className="table table-lg">
            <thead>
              <tr className="bg-base-200">
                <th>Nome</th>
                <th>Fornecedor</th>
                <th className="text-right">Preço Venda</th>
                <th className="text-right">Preço Custo</th>
                <th className="text-center">Estoque</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto) => {
                const lucro = Number(produto.salePrice) - Number(produto.costPrice)
                const margem = ((lucro / Number(produto.salePrice)) * 100).toFixed(1)

                return (
                  <tr key={produto.id} className="hover">
                    <td className="font-medium">{produto.name}</td>
                    <td>{produto.supplier}</td>
                    <td className="text-right font-semibold text-success">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(produto.salePrice))}
                    </td>
                    <td className="text-right text-base-content/70">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(produto.costPrice))}
                      <span className="text-xs ml-2 opacity-60">({margem}% margem)</span>
                    </td>
                    <td className="text-center">
                        <span className={`badge badge-lg ${produto.quantity <= 5 ? 'badge-error' : produto.quantity <= 15 ? 'badge-warning' : 'badge-success'}`}>
                          {produto.quantity}
                        </span>
                      </td>
                    <td className="text-center">
                      <div className="flex justify-center gap-2">
                        <Link
                          href={`/dashboard/produtos/${produto.id}`}
                          className="btn btn-ghost btn-sm"
                        >
                          Ver
                        </Link>
                        <Link
                          href={`/dashboard/produtos/${produto.id}/editar`}
                          className="btn btn-ghost btn-sm"
                        >
                          Editar
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
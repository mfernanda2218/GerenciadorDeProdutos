// app/dashboard/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import SearchBar from '@/components/SearchBar'

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const userId = session.user.id as string
  const query = searchParams.q?.trim()

  // Só busca se tiver termo
  const produtos = query
    ? await prisma.product.findMany({
        where: {
          userId,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { supplier: { contains: query, mode: 'insensitive' } },
          ],
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
      })
    : []

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto p-8 pt-16 max-w-7xl">
        {/* Título */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-4">
            Bem-vindo, {session.user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-xl text-base-content/80">
            Pesquise seus produtos abaixo
          </p>
        </div>

        {/* SearchBar centralizado */}
        <div className="mb-16">
          <SearchBar />
        </div>

        {/* Tabela SÓ aparece se tiver pesquisa */}
        {query && (
          <div className="bg-base-100 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 border-b border-base-300">
              <h2 className="text-2xl font-bold text-primary">
                Resultados para: <span className="italic">"{query}"</span>
                {' '}
                <span className="text-base font-normal text-base-content/70">
                  ({produtos.length} {produtos.length === 1 ? 'produto' : 'produtos'})
                </span>
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="table table-lg">
                <thead>
                  <tr className="bg-primary text-primary-content">
                    <th className="rounded-tl-2xl">Produto</th>
                    <th>Fornecedor</th>
                    <th className="text-right">Preço Venda</th>
                    <th className="text-center">Estoque</th>
                    <th className="text-center rounded-tr-2xl">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-16 text-xl text-base-content/60">
                        Nenhum produto encontrado para "<strong>{query}</strong>"
                      </td>
                    </tr>
                  ) : (
                    produtos.map((p) => (
                      <tr key={p.id} className="hover:bg-base-200 transition-colors">
                        <td className="font-semibold text-lg">{p.name}</td>
                        <td className="text-base-content/80">{p.supplier || '—'}</td>
                        <td className="text-right font-bold text-success">
                          {formatCurrency(Number(p.salePrice))}
                        </td>
                        <td className="text-center">
                          <div className={`badge badge-lg font-bold ${p.quantity <= 5 ? 'badge-warning' : 'badge-success'}`}>
                            {p.quantity} un
                          </div>
                        </td>
                        <td className="text-center">
                          <Link href={`/dashboard/produtos/${p.id}`} className="btn btn-primary btn-sm">
                            Ver
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Se não tiver pesquisa → espaço vazio */}
        {!query && (
          <div className="h-64 flex items-center justify-center">
            <p className="text-2xl text-base-content/50 font-medium text-center">
              Digite algo acima para buscar seus produtos
            </p>
          </div>
        )}

        {/* Botão para página completa */}
        <div className="text-center mt-20">
          <Link
            href="/dashboard/produtos"
            className="btn btn-outline btn-lg btn-wide shadow-xl hover:shadow-2xl"
          >
            Ir para Gerenciamento Completo de Produtos
          </Link>
        </div>
      </div>
    </div>
  )
}
// app/dashboard/produtos/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ProdutosPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  // Aqui você vai buscar os produtos depois
  // const produtos = await prisma.produto.findMany()

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Produtos</h1>
        <Link href="/dashboard/produtos/novo" className="btn btn-primary gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Novo produto
        </Link>
      </div>

      {/* Tabela de exemplo – depois você troca pelos dados reais */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Código</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Camiseta Preta</td>
              <td>CAM001</td>
              <td>R$ 79,90</td>
              <td className="text-success font-bold">42</td>
              <td>
                <button className="btn btn-ghost btn-xs">editar</button>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>Caneca Personalizada</td>
              <td>CAN001</td>
              <td>R$ 34,90</td>
              <td className="text-warning font-bold">8</td>
              <td>
                <button className="btn btn-ghost btn-xs">editar</button>
              </td>
            </tr>
          </tbody>
        </table>

        {<div className="text-center py-12">
          <p className="text-xl text-base-300">Nenhum produto cadastrado ainda</p>
        </div>}
      </div>
    </div>
  )
}
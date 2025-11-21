// app/dashboard/produtos/novo/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function NovoProdutoPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Novo Produto</h1>

      <form className="space-y-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Nome do produto</span>
          </label>
          <input type="text" className="input input-bordered" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Código</span>
            </label>
            <input type="text" className="input input-bordered" />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Preço</span>
            </label>
            <input type="text" className="input input-bordered" placeholder="0,00" />
          </div>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Quantidade em estoque</span>
          </label>
          <input type="number" className="input input-bordered" defaultValue="0" />
        </div>

        <div className="flex gap-4 mt-8">
          <button type="submit" className="btn btn-primary flex-1">
            Salvar produto
          </button>
          <Link href="/dashboard/produtos" className="btn btn-ghost flex-1">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
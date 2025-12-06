// app/dashboard/produtos/editar/[id]/actions.ts
'use server'

import { cookies } from 'next/headers'
import { getApolloServerClient } from '@/lib/apollo-server'
import { UPDATE_PRODUCT } from '@/app/graphql/mutations/updateProduct'

export async function atualizarProduto(prevState: any, formData: FormData) {
  // === CORREÇÃO PRINCIPAL: forma correta de pegar todos os cookies como string ===
  const cookieStore = await cookies()
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ')

  const client = getApolloServerClient(cookieHeader)

  try {
    const id = Number(formData.get('id'))
    if (isNaN(id) || id <= 0) {
      return { error: 'Produto inválido' }
    }

    // Valores brutos do formulário
    const rawName = (formData.get('name') as string) ?? ''
    const rawSupplier = (formData.get('supplier') as string) ?? ''
    const rawSalePrice = (formData.get('salePrice') as string) ?? '0'
    const rawCostPrice = (formData.get('costPrice') as string) ?? '0'
    const rawQuantity = (formData.get('quantity') as string) ?? '0'

    // Limpeza e normalização
    const name = rawName.trim()
    const supplier = rawSupplier.trim() || null

    // Aceita vírgula e ponto como separ mentally decimal
    const salePrice = parseFloat(rawSalePrice.replace(',', '.'))
    const costPrice = parseFloat(rawCostPrice.replace(',', '.'))
    const quantity = parseInt(rawQuantity.replace(/\D/g, '') || '0', 10) || 0

    // === VALIDAÇÕES ===
    if (!name || name.length < 2) return { error: 'nome' }
    if (isNaN(salePrice) || salePrice <= 0) return { error: 'venda' }
    if (isNaN(costPrice) || costPrice < 0) return { error: 'custo' }
    if (isNaN(quantity) || quantity < 0) return { error: 'quantidade' }

    // === MUTAÇÃO GRAPHQL ===
    await client.mutate({
      mutation: UPDATE_PRODUCT,
      variables: {
        id: id.toString(),
        input: {
          name,
          supplier,
          salePrice,
          costPrice,
          quantity,
        },
      },
    })

    // Sucesso!
    return { success: true }
  } catch (err: any) {
    console.error('Erro ao atualizar produto:', err)
    return { error: 'Erro ao salvar produto. Tente novamente.' }
  }
}
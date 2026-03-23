// app/dashboard/produtos/editar/[id]/actions.ts
'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getApolloServerClient } from '@/lib/apollo-server'
import { UPDATE_PRODUCT } from '@/app/graphql/mutations/updateProduct'

export async function atualizarProduto(prevState: any, formData: FormData) {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()

  const client = getApolloServerClient(cookieHeader)

  try {
    const id = Number(formData.get('id'))
    if (isNaN(id) || id <= 0) {
      return { error: 'Produto inválido' }
    }

    // Valores brutos do formulário
    const name = (formData.get('name') as string)?.trim() ?? ''
    const supplier = (formData.get('supplier') as string)?.trim() || null
    const rawSalePrice = (formData.get('salePrice') as string) ?? '0'
    const rawCostPrice = (formData.get('costPrice') as string) ?? '0'
    const rawQuantity = (formData.get('quantity') as string) ?? '0'

    // Limpeza de preços: aceita vírgula e ponto como separador decimal
    const salePrice = parseFloat(rawSalePrice.replace(',', '.'))
    const costPrice = parseFloat(rawCostPrice.replace(',', '.'))
    
    // Quantidade: garante que seja um inteiro positivo
    const quantity = parseInt(rawQuantity.replace(/[^\d-]/g, ''), 10) || 0

    // === VALIDAÇÕES ===
    if (!name || name.length < 2) return { error: 'nome' }
    if (isNaN(salePrice) || salePrice <= 0) return { error: 'venda' }
    if (isNaN(costPrice) || costPrice < 0) return { error: 'custo' }
    if (isNaN(quantity) || quantity < 0) return { error: 'quantidade' }

    // === MUTAÇÃO GRAPHQL ===
    const response = await client.mutate({
      mutation: UPDATE_PRODUCT,
      variables: {
        id: id.toString(),
        input: {
          name,
          supplier,
          salePrice: Number(salePrice.toFixed(2)),
          costPrice: Number(costPrice.toFixed(2)),
          quantity: Math.floor(quantity),
        },
      },
    })

    if (response.errors && response.errors.length > 0) {
        return { error: response.errors[0].message }
    }

    // Revalidate paths to clear caches
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/produtos')

    return { success: true }
  } catch (err: any) {
    console.error('ERRO DETALHADO AO ATUALIZAR PRODUTO NO SERVER ACTION:', err)
    
    // Tratamento de erros comuns
    const message = err.message || ''
    if (message.includes('Não autenticado')) return { error: 'Sessão expirada. Faça login novamente.' }
    if (message.includes('NOT_FOUND') || message.includes('encontrado')) return { error: 'Produto não encontrado.' }
    
    return { 
      error: err.message || 'Erro interno ao salvar produto. Verifique sua conexão.' 
    }
  }
}
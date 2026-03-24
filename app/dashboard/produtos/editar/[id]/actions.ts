'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function atualizarProduto(prevState: any, formData: FormData) {
  const session = await auth()
  const user = session?.user

  if (!user || !user.email) {
    return { error: 'Sessão expirada. Faça login novamente.' }
  }

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

    // === ATUALIZAÇÃO DIRETA NO BANCO (SEM GRAPHQL) ===
    // Verifica se o produto pertence ao usuário logado
    const existingProduct = await prisma.product.findFirst({
        where: { id, user: { email: user.email } }
    })

    if (!existingProduct) {
        return { error: 'Produto não encontrado ou sem permissão para editar.' }
    }

    await prisma.product.update({
      where: { id },
      data: {
        name,
        supplier,
        salePrice: Number(salePrice.toFixed(2)),
        costPrice: Number(costPrice.toFixed(2)),
        quantity: Math.floor(quantity),
      },
    })

    // Revalidate paths to clear caches
    revalidatePath('/dashboard')

    return { success: true }
  } catch (err: any) {
    console.error('ERRO AO ATUALIZAR PRODUTO (PRISMA):', err)
    return { 
      error: 'Erro interno ao salvar produto. Verifique sua conexão.' 
    }
  }
}
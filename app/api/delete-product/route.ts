// app/api/delete-product/route.ts
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')

  if (!id || isNaN(Number(id))) {
    return new Response('ID inválido', { status: 400 })
  }

  try {
    await prisma.product.delete({
      where: { id: Number(id) }
    })
    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error('Erro ao excluir produto:', error)
    return new Response('Erro', { status: 500 })
  }
}
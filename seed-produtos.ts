// seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findFirst()
  if (!user) {
    console.log('Cadastre um usuário primeiro!')
    return
  }

  console.log('Adicionando 50 produtos fakes...')

  const nomes = [
    'Camiseta Algodão', 'Calça Jeans', 'Tênis Casual', 'Moletom Canguru', 'Jaqueta Corta-Vento',
    'Bermuda Tactel', 'Regata Dry Fit', 'Boné Aba Curva', 'Camisa Social', 'Shorts Jeans',
    'Vestido Midi', 'Blusa de Frio', 'Calça Legging', 'Meia Cano Alto', 'Chinelo Slide'
  ]

  const fornecedores = ['Zigurat', 'Dondiego', 'Renner', 'C&A', 'Riachuelo', 'Shein', 'Shopee']

  const produtos = Array.from({ length: 50 }, (_, i) => ({
    userId: user.id,
    name: `${nomes[i % nomes.length]} ${String(i + 1).padStart(2, '0')}`,
    supplier: fornecedores[Math.floor(Math.random() * fornecedores.length)],
    costPrice: Number((Math.random() * 80 + 20).toFixed(2)),
    salePrice: Number((Math.random() * 120 + 80).toFixed(2)),
    quantity: Math.floor(Math.random() * 150),
  }))

  await prisma.product.createMany({
    data: produtos,
  })

  console.log('50 PRODUTOS CRIADOS COM SUCESSO!!!')
}

main()
  .catch(e => console.error('Erro:', e))
  .finally(async () => await prisma.$disconnect())
// prisma/seed-produtos.ts
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Iniciando Seed de Produtos ---')

  // 1. Verificar se existe ao menos um usuário no banco
  const user = await prisma.user.findFirst()

  if (!user) {
    console.error('ERRO: Nenhum usuário encontrado no sistema.')
    console.log('Por favor, cadastre um usuário via interface antes de rodar o seed.')
    return
  }

  console.log(`Usuário encontrado: ${user.email} (ID: ${user.id})`)
  console.log('Adicionando 50 produtos fakes...')

  const nomes = [
    'Camiseta Algodão', 'Calça Jeans', 'Tênis Casual', 'Moletom Canguru', 'Jaqueta Corta-Vento',
    'Bermuda Tactel', 'Regata Dry Fit', 'Boné Aba Curva', 'Camisa Social', 'Shorts Jeans',
    'Vestido Midi', 'Blusa de Frio', 'Calça Legging', 'Meia Cano Alto', 'Chinelo Slide'
  ]

  const fornecedores = ['Zigurat', 'Dondiego', 'Renner', 'C&A', 'Riachuelo', 'Shein', 'Shopee']

  const produtos: Prisma.ProductCreateManyInput[] = Array.from({ length: 50 }, (_, i) => ({
    userId: user.id,
    name: `${nomes[i % nomes.length]} ${String(i + 1).padStart(2, '0')}`,
    supplier: fornecedores[Math.floor(Math.random() * fornecedores.length)],
    // Convertendo para string para garantir precisão no tipo Decimal do Prisma
    costPrice: new Prisma.Decimal((Math.random() * 80 + 20).toFixed(2)),
    salePrice: new Prisma.Decimal((Math.random() * 120 + 80).toFixed(2)),
    quantity: Math.floor(Math.random() * 150),
  }))

  // 2. Inserção em massa
  const result = await prisma.product.createMany({
    data: produtos,
    skipDuplicates: true, // Opcional: evita erros se tentar rodar o mesmo seed várias vezes
  })

  console.log(`\n✅ SUCESSO! ${result.count} PRODUTOS FORAM CRIADOS.`)
  console.log('--- Seed Finalizado ---')
}

main()
  .catch((e) => {
    console.error('❌ ERRO NO SEED:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
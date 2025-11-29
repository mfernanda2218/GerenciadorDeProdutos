// seed.ts (na raiz do projeto)
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  const email = 'admin@teste.com'
  const password = '123456'

  const hashed = await bcrypt.hash(password, 10)

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashed,
      name: 'Admin',
    },
    create: {
      email,
      name: 'Admin',
      password: hashed,
      // id será gerado automaticamente com UUID
    },
  })

  console.log('USUÁRIO CRIADO/ATUALIZADO COM SUCESSO!')
  console.log('Email: admin@teste.com')
  console.log('Senha: 123456')
  console.log('ID (UUID):', user.id)
}

main()
  .then(() => {
    console.log('Seed concluído com sucesso!')
    process.exit(0)
  })
  .catch((e) => {
    console.error('Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
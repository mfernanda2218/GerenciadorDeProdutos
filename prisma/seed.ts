// prisma/seed-admin.ts
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  const senhaHash = await bcrypt.hash('123456', 10)

  const user = await prisma.user.upsert({
    where: { email: 'admin@teste.com' },
    update: {
      password: senhaHash, // atualiza a senha caso já exista
    },
    create: {
      email: 'admin@teste.com',
      name: 'Administrador',
      password: senhaHash,
    },
  })

  console.log('Usuário criado/atualizado:')
  console.log('Email: admin@teste.com')
  console.log('Senha: 123456')
  console.log('ID:', user.id)
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
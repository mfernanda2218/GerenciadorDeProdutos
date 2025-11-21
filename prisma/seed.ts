// Exemplo no seed.ts
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'

const hashed = await bcrypt.hash('123456', 10)

await prisma.user.upsert({
  where: { email: 'admin@exemplo.com' },
  update: {},
  create: {
    email: 'admin@exemplo.com',
    name: 'Admin',
    password: hashed,
  },
})
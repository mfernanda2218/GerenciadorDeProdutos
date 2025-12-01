// __mocks__/@prisma/client.ts
import { mockDeep, mockReset } from 'jest-mock-extended'
import { PrismaClient } from '@prisma/client'

import { Decimal } from '@prisma/client/runtime/library'

// Cria o mock profundo (já vem com product.findMany, create, etc)
const prismaMock = mockDeep<PrismaClient>()

// ESSA É A LINHA QUE CONSERTA O Decimal → OBRIGATÓRIO!
;(prismaMock as any).Decimal = Decimal

prismaMock.product.findMany.mockResolvedValue([])
prismaMock.product.findUnique.mockResolvedValue(null)
prismaMock.product.create.mockResolvedValue({ id: 1 } as any)
prismaMock.product.update.mockResolvedValue({ id: 1 } as any)
prismaMock.product.delete.mockResolvedValue({ id: 1 } as any)

// Reset total antes de cada teste
beforeEach(() => {
  mockReset(prismaMock)
})

export default prismaMock

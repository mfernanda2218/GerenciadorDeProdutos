// app/server/graphql/resolvers/__tests__/product.test.ts

import { productResolvers } from '../product'
import prismaMock from '@/__mocks__/@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

const decimal = (value: string | number) => new Decimal(value)

const mockUser = {
  id: 'user-123',
  email: 'joao@test.com',
  name: 'João Silva',
}

describe('Product Resolvers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('lista todos os produtos corretamente', async () => {
    const mockProducts = [
      {
        id: 1,
        name: 'Camiseta Preta',
        salePrice: decimal('89.90'),
        costPrice: decimal('45.00'),
        quantity: 50,
        supplier: 'Fornecedor A',
        userId: mockUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    prismaMock.product.findMany.mockResolvedValue(mockProducts)

    const result = await productResolvers.Query.products(null, {}, {
      user: mockUser,
      prisma: prismaMock,
    })

    expect(prismaMock.product.findMany).toHaveBeenCalledWith({
      where: { user: { email: mockUser.email } },
      orderBy: { createdAt: 'desc' },
    })

    expect(result).toEqual(mockProducts)
  })

  it('cria um produto com sucesso', async () => {
    const input = {
      name: 'Moletom Cinza',
      salePrice: '149.9',
      costPrice: '80',
      quantity: 40,
      supplier: 'Fornecedor Top',
    }

    const createdProduct = {
      id: 99,
      ...input,
      salePrice: decimal('149.90'),
      costPrice: decimal('80.00'),
      userId: mockUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    prismaMock.product.create.mockResolvedValue(createdProduct)

    const result = await productResolvers.Mutation.createProduct(null, { input }, {
      user: mockUser,
      prisma: prismaMock,
    })

    expect(prismaMock.product.create).toHaveBeenCalledWith({
      data: {
        name: input.name,
        salePrice: '149.9',
        costPrice: '80',
        quantity: input.quantity,
        supplier: input.supplier,
        user: { connect: { email: mockUser.email } },
      },
    })

    expect(result.salePrice.toNumber()).toBe(149.9)
  })

  it('atualiza um produto existente', async () => {
    const input = {
      name: 'Camiseta Preta - Edição Especial',
      salePrice: '99.9',
    }

    const updatedProduct = {
      id: 1,
      name: input.name,
      salePrice: decimal('99.90'),
      costPrice: decimal('45.00'),
      quantity: 50,
      supplier: null,
      userId: mockUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    prismaMock.product.update.mockResolvedValue(updatedProduct)

    const result = await productResolvers.Mutation.updateProduct(
      null,
      { id: '1', input },
      { user: mockUser, prisma: prismaMock }
    )

    expect(prismaMock.product.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        name: input.name,
        salePrice: '99.9',
      },
    })

    expect(result.salePrice.toNumber()).toBe(99.9)
  })

  it('deleta um produto e retorna true', async () => {
    prismaMock.product.findUnique.mockResolvedValueOnce({
      id: 1,
      userId: mockUser.id,
    } as any)

    prismaMock.product.delete.mockResolvedValue({ id: 1 } as any)

    const result = await productResolvers.Mutation.deleteProduct(
      null,
      { id: '1' },
      { user: mockUser, prisma: prismaMock }
    )

    expect(prismaMock.product.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    })

    expect(result).toBe(true)
  })
})
/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'

// Mock do módulo de auth
jest.mock('@/lib/auth', () => ({
  auth: jest.fn(() => Promise.resolve({ user: { id: '1', name: 'Test User', email: 'test@example.com' } })),
  getCurrentUser: jest.fn(() => Promise.resolve({ user: { id: '1', name: 'Test User', email: 'test@example.com' } })),
  handlers: { GET: jest.fn(), POST: jest.fn() },
  signIn: jest.fn(),
  signOut: jest.fn()
}))

// Mock do Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

// Mock do Apollo Server
jest.mock('@apollo/server', () => {
  const executeOperation = jest.fn().mockImplementation(({ query, variables }) => {
    if (query.includes('products')) {
      return Promise.resolve({
        body: {
          kind: 'single',
          singleResult: {
            data: {
              products: [
                { id: '1', name: 'Produto 1', price: 10.0 },
                { id: '2', name: 'Produto 2', price: 20.0 }
              ]
            }
          }
        }
      })
    }
    if (query.includes('createProduct')) {
      return Promise.resolve({
        body: {
          kind: 'single',
          singleResult: {
            data: {
              createProduct: { id: '3', name: 'Novo Produto' }
            }
          }
        }
      })
    }
    return Promise.resolve({ body: { kind: 'single', singleResult: { data: {} } } })
  })

  return {
    ApolloServer: jest.fn().mockImplementation(() => ({
      executeOperation,
      startInBackgroundHandlingStartupErrorsByLoggingAndFailingAllRequests: jest.fn().mockResolvedValue(undefined),
      start: jest.fn().mockResolvedValue(undefined),
      stop: jest.fn().mockResolvedValue(undefined)
    }))
  }
})

// Mock do @as-integrations/next
// Update the @as-integrations/next mock to handle GET requests
jest.mock('@as-integrations/next', () => ({
  startServerAndCreateNextHandler: jest.fn().mockImplementation(() => {
    return async (req: any) => {
      // For GET requests, return the Apollo Studio HTML
      if (req.method === 'GET') {
        return new Response(
          '<html><body>Apollo Studio</body></html>',
          {
            status: 200,
            headers: {
              'content-type': 'text/html'
            }
          }
        )
      }

      // For POST requests, handle the GraphQL operations
      if (req.method === 'POST') {
        const body = await req.json()
        if (body.query.includes('products')) {
          return new Response(JSON.stringify({
            data: {
              products: [
                { id: '1', name: 'Produto 1', price: 10.0 },
                { id: '2', name: 'Produto 2', price: 20.0 }
              ]
            }
          }), {
            status: 200,
            headers: {
              'content-type': 'application/json'
            }
          })
        }
        if (body.query.includes('createProduct')) {
          return new Response(JSON.stringify({
            data: {
              createProduct: { id: '3', name: 'Novo Produto' }
            }
          }), {
            status: 200,
            headers: {
              'content-type': 'application/json'
            }
          })
        }
      }

      // Default response
      return new Response(
        JSON.stringify({ data: {} }),
        {
          status: 200,
          headers: {
            'content-type': 'application/json'
          }
        }
      )
    }
  })
}))

import { prisma } from '@/lib/prisma'
const mockPrisma = prisma as any

// Import the handlers after all mocks are set up
import { GET, POST } from '@/app/api/graphql/route'

describe('GraphQL API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('GET /api/graphql retorna 200 e HTML do Playground', async () => {
    const req = new NextRequest('http://localhost:3000/api/graphql', {
      method: 'GET',
    })

    const response = await GET(req)
    expect(response.status).toBe(200)
    const text = await response.text()
    expect(text).toContain('Apollo')
  })

  test('POST /api/graphql deve retornar lista de produtos (Query)', async () => {
    const mockProducts = [
      { id: 1, name: 'Produto 1', price: 10.0, user: { email: 'test@example.com' } },
      { id: 2, name: 'Produto 2', price: 20.0, user: { email: 'test@example.com' } }
    ]

    mockPrisma.product.findMany.mockResolvedValue(mockProducts)

    const query = `
      query {
        products {
          id
          name
          price
        }
      }
    `

    const req = new NextRequest('http://localhost:3000/api/graphql', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })

    const response = await POST(req)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(Array.isArray(json.data.products)).toBe(true)
    expect(json.data.products.length).toBeGreaterThan(0)
  })

  test('POST /api/graphql deve criar um produto (Mutation)', async () => {
    const newProduct = { id: 3, name: 'Novo Produto', price: 99.9, supplier: 'Fornecedor X' }
    mockPrisma.product.create.mockResolvedValue(newProduct)

    const mutation = `
      mutation {
        createProduct(input: {
          name: "Novo Produto"
          price: 99.9
          supplier: "Fornecedor X"
        }) {
          id
          name
        }
      }
    `

    const req = new NextRequest('http://localhost:3000/api/graphql', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ query: mutation }),
    })

    const response = await POST(req)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.data.createProduct).toBeDefined()
    expect(json.data.createProduct.name).toBe('Novo Produto')
  })
})
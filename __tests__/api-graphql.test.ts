// __tests__/api-graphql.test.ts
import { createRequest, createResponse } from 'node-mocks-http'
import { GET } from '@/app/api/graphql/route'
import { NextRequest } from 'next/server'

test('GET /api/graphql retorna 200 e HTML do Playground', async () => {
  const req = createRequest<NextRequest>({ method: 'GET' })
  const res = createResponse()

  const response = await GET(req as any)
  
  expect(response.status).toBe(200)
  const text = await response.text()
  expect(text).toContain('Apollo Studio')
})
// jest.setup.js
import '@testing-library/jest-dom'
import { fetch, Request, Response, Headers } from 'cross-fetch'
import { TextEncoder, TextDecoder } from 'util'

// Polifylls para ambiente Node (importante para testes de API/NextAuth)
if (!global.fetch) global.fetch = fetch
if (!global.Request) global.Request = Request
if (!global.Response) global.Response = Response
if (!global.Headers) global.Headers = Headers
if (!global.TextEncoder) global.TextEncoder = TextEncoder
if (!global.TextDecoder) global.TextDecoder = TextDecoder

// Mock do next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: {
      user: { name: 'João Silva', email: 'joao@test.com', image: null },
      expires: '2025-12-31',
    },
    status: 'authenticated',
  })),
}))

// Mock do next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Only mock HTMLFormElement in jsdom environment (not in node environment)
if (typeof global.HTMLFormElement !== 'undefined') {
  global.HTMLFormElement.prototype.requestSubmit = function () {
    this.submit()
  }
}
// jest.setup.js
import '@testing-library/jest-dom'

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

global.HTMLFormElement.prototype.requestSubmit = function () {
  this.submit()
}
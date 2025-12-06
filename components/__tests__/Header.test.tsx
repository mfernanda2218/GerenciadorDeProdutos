// components/__tests__/Header.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Header from '../Header'

// Mock do next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: { user: { name: 'João Silva', email: 'joao@test.com' } },
    status: 'authenticated',
  })),
}))

// Mock do next/navigation
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza o título do aplicativo', () => {
    render(<Header />)
    expect(screen.getByText('Gerenciador')).toBeInTheDocument()
  })

  it('renderiza header com nome e email do usuário', () => {
    render(<Header />)

    // Clica no avatar para abrir o dropdown
    const avatar = screen.getByAltText('Avatar')
    fireEvent.click(avatar)

    // Verifica se nome e email aparecem no dropdown
    expect(screen.getByText('João Silva')).toBeInTheDocument()
    expect(screen.getByText('joao@test.com')).toBeInTheDocument()
  })

  it('renderiza avatar com imagem gerada pelo dicebear', () => {
    render(<Header />)
    const avatar = screen.getByAltText('Avatar')
    expect(avatar).toHaveAttribute('src', expect.stringContaining('dicebear.com'))
    expect(avatar).toHaveAttribute('src', expect.stringContaining('joao@test.com'))
  })

  it('botão de sair está dentro de um formulário com action correto', () => {
    render(<Header />)
    const avatar = screen.getByAltText('Avatar')
    fireEvent.click(avatar)

    const sairButton = screen.getByText('Sair da conta')
    const form = sairButton.closest('form')

    expect(form).toBeInTheDocument()
    expect(form).toHaveAttribute('action', '/api/auth/signout')
    expect(form).toHaveAttribute('method', 'post')
  })

  it('renderiza estado de loading corretamente', () => {
    const { useSession } = require('next-auth/react')
    useSession.mockReturnValue({
      data: null,
      status: 'loading',
    })

    render(<Header />)

    // Verifica se há um elemento com animação de loading
    const loadingElement = document.querySelector('.animate-pulse')
    expect(loadingElement).toBeInTheDocument()
  })

  it('redireciona para login quando não autenticado', async () => {
    const { useSession } = require('next-auth/react')
    useSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    })

    render(<Header />)

    // Aguarda o setTimeout executar
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login')
    }, { timeout: 100 })
  })
})
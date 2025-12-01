// components/__tests__/Header.test.tsx

import { render, screen, fireEvent } from '@testing-library/react'
import Header from '../Header'
import { signOut } from 'next-auth/react'

jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: { user: { name: 'João Silva', email: 'joao@test.com' } },
    status: 'authenticated',
  }),
  signOut: jest.fn(),
}))

describe('Header', () => {
  it('renderiza header com nome e email do usuário', () => {
    render(<Header />)
    expect(screen.getByText('João Silva')).toBeInTheDocument()
    expect(screen.getByText('joao@test.com')).toBeInTheDocument()
  })

  it('abre dropdown ao clicar no avatar', () => {
    render(<Header />)
    const avatar = screen.getByRole('button', { name: 'Avatar' }) // ← MUDOU AQUI!
    fireEvent.click(avatar)
    expect(screen.getByText('Sair da conta')).toBeInTheDocument()
  })

  it('botão de sair funciona', () => {
    render(<Header />)
    const avatar = screen.getByRole('button', { name: 'Avatar' })
    fireEvent.click(avatar)
    const sairButton = screen.getByText('Sair da conta')
    fireEvent.click(sairButton)
    expect(signOut).toHaveBeenCalled()
  })
})
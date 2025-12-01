// components/__tests__/DeleteButton.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import DeleteButton from '../DeleteButton'
import { DELETE_PRODUCT } from '@/app/graphql/mutations/deleteProduct'

const mocks = [
  {
    request: {
      query: DELETE_PRODUCT,
      variables: { id: '123' },
    },
    result: { data: { deleteProduct: true } },
  },
]

describe('DeleteButton', () => {
  it('exibe confirmação e chama mutation ao confirmar', async () => {
    const onDelete = jest.fn()
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true)

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <DeleteButton productId="123" productName="Camiseta Azul" onDelete={onDelete} />
      </MockedProvider>
    )

    fireEvent.click(screen.getByText('Excluir'))

    await waitFor(() => {
      expect(confirmSpy).toHaveBeenCalledWith(
        expect.stringContaining('Camiseta Azul')
      )
    })

    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledTimes(1)
    })

    confirmSpy.mockRestore()
  })

  it('não chama mutation se cancelar', async () => {
    const onDelete = jest.fn()
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false)

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <DeleteButton productId="123" productName="Camiseta" onDelete={onDelete} />
      </MockedProvider>
    )

    fireEvent.click(screen.getByText('Excluir'))

    await waitFor(() => {
      expect(confirmSpy).toHaveBeenCalled()
    })

    expect(onDelete).not.toHaveBeenCalled()
    confirmSpy.mockRestore()
  })
})
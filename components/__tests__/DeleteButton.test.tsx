// components/__tests__/DeleteButton.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { InMemoryCache } from '@apollo/client';
import DeleteButton from '../DeleteButton';
import { DELETE_PRODUCT } from '@/app/graphql/mutations/deleteProduct';

// MOCKS
const mocks = [
  {
    request: {
      query: DELETE_PRODUCT,
      variables: { id: '123' },
    },
    result: {
      data: {
        deleteProduct: true,
        __typename: 'Mutation',
      },
    },
  },
];

// Create a custom cache without the addTypename option
const createApolloCache = () => {
  return new InMemoryCache();
};

describe('DeleteButton', () => {
  beforeEach(() => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('exibe confirmação e chama onDelete ao confirmar', async () => {
    const onDelete = jest.fn();

    render(
      <MockedProvider 
        mocks={mocks} 
        cache={createApolloCache()} // Use the custom cache
      >
        <DeleteButton productId="123" productName="Camiseta Azul" onDelete={onDelete} />
      </MockedProvider>
    );

    fireEvent.click(screen.getByText('Excluir'));

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith(
        expect.stringContaining('Camiseta Azul')
      );
    });

    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledTimes(1);
    });
  });

  it('não chama onDelete se cancelar', async () => {
    const onDelete = jest.fn();
    jest.spyOn(window, 'confirm').mockReturnValue(false);

    render(
      <MockedProvider 
        mocks={mocks} 
        cache={createApolloCache()} // Use the custom cache
      >
        <DeleteButton productId="123" productName="Camiseta" onDelete={onDelete} />
      </MockedProvider>
    );

    fireEvent.click(screen.getByText('Excluir'));

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
    });

    expect(onDelete).not.toHaveBeenCalled();
  });
});
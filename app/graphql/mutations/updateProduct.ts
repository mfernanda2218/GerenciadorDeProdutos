// graphql/mutations/updateProduct.ts
import { gql } from '@apollo/client'

/**
 * @param {string} $id - ID do produto a ser atualizado
 * @param {UpdateProductInput} $input - Campos do produto a serem atualizados
 * @returns {Product} - O produto atualizado
 */
export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      supplier
      salePrice
      costPrice
      quantity
      updatedAt
    }
  }
`
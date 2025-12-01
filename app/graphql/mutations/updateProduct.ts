// graphql/mutations/updateProduct.ts
import { gql } from '@apollo/client'

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
    }
  }
`
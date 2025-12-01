// graphql/mutations/createProduct.ts
import { gql } from '@apollo/client'

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      salePrice
      costPrice
      quantity
    }
  }
`
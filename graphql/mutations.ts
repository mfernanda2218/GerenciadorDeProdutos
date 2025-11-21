// src/graphql/mutations.ts
import { gql } from '@apollo/client'

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($name: String!, $salePrice: Float!, $costPrice: Float!, $quantity: Int!, $supplier: String!) {
    createProduct(name: $name, salePrice: $salePrice, costPrice: $costPrice, quantity: $quantity, supplier: $supplier) {
      id
    }
  }
`

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $name: String, $salePrice: Float, $costPrice: Float, $quantity: Int, $supplier: String) {
    updateProduct(id: $id, name: $name, salePrice: $salePrice, costPrice: $costPrice, quantity: $quantity, supplier: $supplier) {
      id
    }
  }
`

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`
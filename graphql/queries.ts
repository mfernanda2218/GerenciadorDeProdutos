// src/graphql/queries.ts
import { gql } from '@apollo/client'

export const PRODUCTS_QUERY = gql`
  query Products($search: String) {
    products(search: $search) {
      id
      name
      salePrice
      costPrice
      quantity
      supplier
      createdAt
    }
  }
`

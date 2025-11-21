// graphql/typeDefs.ts
import { gql } from 'graphql-tag'

export const typeDefs = gql`
  type User {
    id: String!
    name: String
    email: String!
  }

  type Product {
    id: Int!
    name: String!
    salePrice: Float!
    costPrice: Float!
    quantity: Int!
    supplier: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    me: User
    products: [Product!]!
    product(id: Int!): Product
  }

  type Mutation {
    createProduct(
      name: String!
      salePrice: Float!
      costPrice: Float!
      quantity: Int!
      supplier: String!
    ): Product!

    updateProduct(
      id: Int!
      name: String
      salePrice: Float
      costPrice: Float
      quantity: Int
      supplier: String
    ): Product

    deleteProduct(id: Int!): Boolean!
  }
`
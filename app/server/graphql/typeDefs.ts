// server/graphql/typeDefs.ts
import { gql } from 'graphql-tag'

export const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    supplier: String
    salePrice: Float!
    costPrice: Float!
    quantity: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    products(search: String): [Product!]!
    product(id: ID!): Product
  }

  input CreateProductInput {
    name: String!
    supplier: String
    salePrice: Float!
    costPrice: Float!
    quantity: Int!
  }

  input UpdateProductInput {
    name: String
    supplier: String
    salePrice: Float
    costPrice: Float
    quantity: Int
  }

  type Mutation {
    createProduct(input: CreateProductInput!): Product!
    updateProduct(id: ID!, input: UpdateProductInput!): Product!
    deleteProduct(id: ID!): Boolean!
  }
`
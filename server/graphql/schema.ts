// src/server/graphql/schema.ts
export const typeDefs = /* GraphQL */ `
  type User {
    id: ID!
    name: String
    email: String!
    provider: String!
    createdAt: DateTime!
  }

  type Product {
    id: ID!
    name: String!
    salePrice: Float!
    costPrice: Float!
    quantity: Int!
    supplier: String!
    user: User!
  }

  type Query {
    me: User
    products(search: String): [Product!]!
    product(id: ID!): Product
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
      id: ID!
      name: String
      salePrice: Float
      costPrice: Float
      quantity: Int
      supplier: String
    ): Product!
    deleteProduct(id: ID!): Boolean!
  }
`
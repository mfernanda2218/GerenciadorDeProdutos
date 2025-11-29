// src/server/graphql/resolvers/index.ts
import { mergeResolvers } from '@graphql-tools/merge'
import { productResolvers } from './product'

export const resolvers = {
  Query: {
    ...productResolvers.Query,
  },
  Mutation: {
    ...productResolvers.Mutation,
  },
}
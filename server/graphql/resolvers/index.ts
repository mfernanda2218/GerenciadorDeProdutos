// server/graphql/resolvers/index.ts
import { productResolvers } from './product.resolver'
import { userResolvers } from './user.resolver'

export const resolvers = {
  Query: {
    ...productResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...productResolvers.Mutation,
    ...userResolvers.Mutation,
  },
}
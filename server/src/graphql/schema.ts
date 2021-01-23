import { makeSchema, queryType, stringArg, } from 'nexus'
import * as path from 'path'

const Query = queryType({
  definition(t) {
    t.string('hello', {
      args: { name: stringArg() },
      resolve: (_, { name }) => `Hello ${name || 'World'}!`,
    })
  },
})

export const schema = makeSchema({
  types: [Query],
  outputs: {
    schema: path.join(__dirname, '../../generated/schema.graphql'),
    typegen: path.join(__dirname, '../../generated/typings.ts'),
  },
})
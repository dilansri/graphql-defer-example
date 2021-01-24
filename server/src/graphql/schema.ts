import { makeSchema, queryType, objectType, list } from 'nexus'
import * as path from 'path'
import { products } from './resolvers'
import { comments } from './resolvers'

const Query = queryType({
  definition(t) {
    t.field('product', {
      type: Product,
      resolve: () => ({id: 'x', name: 'y', images: []})
    })
    t.field('products', {
      type: list(Product),
      resolve: products
    })
  },
})

const Image = objectType({
  name: 'Image',
  definition(t) {
    t.string('url')
  }
})

const Product = objectType({
  name: 'Product',
  description: 'Defines a single product',
  definition(t) {
    t.nonNull.string('id')
    t.string('name')
    t.field('images', {
      type: list(Image)
    })
    t.field('relatedProducts', {
      type: list(Product),
    })
    t.field('comments', {
      type: list('String'),
      resolve: async ({ id }) => new Promise((resolve, reject) => {
        const productComments = comments(id) || null
        setTimeout(() => resolve(productComments), 1000)
      })
    })
  }
})

export const schema = makeSchema({
  types: [Query, Product, Image],
  outputs: {
    schema: path.join(__dirname, '../generated/schema.graphql'),
    typegen: path.join(__dirname, '../generated/typings.ts'),
  },
})
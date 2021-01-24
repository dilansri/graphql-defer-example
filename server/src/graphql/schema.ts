import { makeSchema, queryType, objectType, list } from 'nexus'
import * as path from 'path'
import { products } from './resolvers'

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
    t.string('id')
    t.string('name')
    t.field('images', {
      type: list(Image)
    })
    t.field('relatedProducts', {
      type: list(Product),
    })
    t.field('comments', {
      type: list('String'),
      resolve: async () => new Promise((res, rej) => {
        setTimeout(() => res(['1', '2', '3']), 1000)
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
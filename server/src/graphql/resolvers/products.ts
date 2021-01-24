import productsData from '../../data/products.json'
import {NexusGenObjects} from '../../generated/typings'

export const products = (): NexusGenObjects['Product'][] => {
  return productsData.map((p) => {
    
    const relatedProducts = p.relatedProducts
      .map(id => productsData.find((d) => d.id === id))
      .filter(Boolean).map((p) => ({...p, relatedProducts: undefined}) as NexusGenObjects['Product'])

    return {...p, relatedProducts}
  })
}
const gql = ([query]: TemplateStringsArray): string => query.replace(/\s+/g, ' ').trim()

export const exampleQuery = gql `
  fragment Comments on Product{
    comments
  }

  fragment RelatedProducts on Product {
    relatedProducts {
      id
      name
    }
  }

  query {
    product{
      id
    }
    products{
      id
      ...Comments @defer
      ...RelatedProducts @defer
    }
  }
`
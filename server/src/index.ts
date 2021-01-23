import express from 'express'
import { 
  getGraphQLParameters, 
  processRequest, 
  shouldRenderGraphiQL, 
  renderGraphiQL 
} from 'graphql-helix'
import { schema } from './graphql/schema'

const app = express()
const PORT = 8000

app.use(express.json())

app.use('/graphql', async (req, res) => {

  const {
    query,
    variables,
    operationName
  } = getGraphQLParameters(req)

  const result = await processRequest({
    schema,
    query,
    variables,
    operationName,
    request: req,
  })

  if(shouldRenderGraphiQL(req)) {
    return res.send(renderGraphiQL())
  }

  if (result.type === 'RESPONSE') {
    result.headers.forEach(({ name, value }) => {
      res.setHeader(name, value)
    })
    res.status(result.status)
    return res.json(result.payload)
  }

  return res.sendStatus(500)
  
})

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`)
})
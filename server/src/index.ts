import express from 'express'
import { 
  getGraphQLParameters, 
  processRequest, 
  shouldRenderGraphiQL, 
  renderGraphiQL 
} from 'graphql-helix'
import { schema } from './graphql/schema'
import {exampleQuery} from './exampleQuery'
import {MultipartResponse} from './MultipartResponse'

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
    return res.send(renderGraphiQL({defaultQuery: exampleQuery}))
  }

  if (result.type === 'RESPONSE') {
    result.headers.forEach(({ name, value }) => {
      res.setHeader(name, value)
    })
    res.status(result.status)
    return res.json(result.payload)
  }

  

  if(result.type === 'MULTIPART_RESPONSE') {
    
    req.on('close', () => {
      result.unsubscribe()
    })

    const response = new MultipartResponse(res, 'mixed', 'gcgfr')
  
    await result.subscribe((res) => {
      response.add(res)
    })

    return response.end()
  }

  return res.sendStatus(500)
  
})

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`)
})
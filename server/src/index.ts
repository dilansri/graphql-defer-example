import express from 'express'
import { 
  getGraphQLParameters, 
  processRequest, 
  shouldRenderGraphiQL, 
  renderGraphiQL 
} from 'graphql-helix'
import { schema } from './graphql/schema'
import {exampleQuery} from './exampleQuery'

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
    
    res.writeHead(200, {
      Connection: 'keep-alive',
      'Content-Type': 'multipart/mixed; boundary="-"',
      'Transfer-Encoding': 'chunked',
    })
  
    await result.subscribe((result) => {
      const chunk = Buffer.from(
        JSON.stringify(result),
        'utf8'
      )
      const data = [
        '',
        '---',
        'Content-Type: application/json; charset=utf-8',
        'Content-Length: ' + String(chunk.length),
        '',
        chunk,
        '',
      ].join('\r\n')
      res.write(data)
    })

    return res.end('\r\n-----\r\n')
  }

  return res.sendStatus(500)
  
})

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`)
})
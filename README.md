## graphql-defer-example

### Description
NodeJs graphql server that supports <code>@defer , @stream </code> capabilities. Written with typescript.

<code>exampleQuery.ts</code> demonstrate <code>@defer</code> example with Fragments.

This examples constructs HTTP [Multipart](https://www.w3.org/Protocols/rfc1341/7_2_Multipart.html) Response with express.

Used dependencies
- express
- graphql
- graphql-helix
- nexus


### How to run
- <code>yarn</code> in root and <code>server</code> folders
- <code>yarn start</code> in  <code>server</code>
- http://localhost:8000/graphql will mount the <code>graphiql</code> interface to tryout queries
import { Response } from 'express'

export class MultipartResponse {
  response : Response
  boundary: string

  constructor(res : Response, type: 'mixed' | 'alternative', boundary = '--') {
    this.response = res
    this.boundary = boundary
    res.writeHead(200, {
      'Connection': 'keep-alive',
      'Content-Type': `multipart/${type}; boundary="${this.boundary}"`,
      'Transfer-Encoding': 'chunked',
    })
  }

  public add(result : unknown) : void {
    const chunk = Buffer.from(
      JSON.stringify(result),
      'utf8'
    )
    const data = [
      '',
      `--${this.boundary}`,
      'Content-Type: application/json; charset=utf-8',
      'Content-Length: ' + String(chunk.length),
      '',
      chunk,
      '',
    ].join('\r\n')
    this.response.write(data)
  }

  public end(): void {
    this.response.end()
  }

}
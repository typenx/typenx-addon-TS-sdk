import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import type { TypenxAddon } from './addon.js'

export function serveTypenxAddon(addon: TypenxAddon, options: { port?: number } = {}) {
  const port = options.port ?? Number(process.env.PORT ?? 8787)
  const server = createServer(async (incoming, outgoing) => {
    try {
      const request = await toRequest(incoming)
      const response = await addon.fetch(request)
      await writeResponse(outgoing, response)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Addon request failed'
      await writeResponse(
        outgoing,
        Response.json({ message }, { status: 500 }),
      )
    }
  })

  return server.listen(port, () => {
    console.log(`Typenx addon listening on http://127.0.0.1:${port}`)
  })
}

async function toRequest(incoming: IncomingMessage) {
  const origin = `http://${incoming.headers.host ?? '127.0.0.1'}`
  const body =
    incoming.method === 'GET' || incoming.method === 'HEAD' ? undefined : incoming

  return new Request(new URL(incoming.url ?? '/', origin), {
    method: incoming.method,
    headers: incoming.headers as HeadersInit,
    body,
    duplex: body ? 'half' : undefined,
  } as RequestInit & { duplex?: 'half' })
}

async function writeResponse(outgoing: ServerResponse, response: Response) {
  outgoing.statusCode = response.status
  response.headers.forEach((value, key) => outgoing.setHeader(key, value))
  outgoing.end(Buffer.from(await response.arrayBuffer()))
}

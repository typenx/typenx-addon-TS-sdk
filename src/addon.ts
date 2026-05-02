import type {
  AddonHealth,
  AddonManifest,
  AnimeMetadata,
  CatalogRequest,
  CatalogResponse,
  RecommendationRequest,
  RecommendationResponse,
  SearchRequest,
  VideoSourceRequest,
  VideoSourceResponse,
} from './types.js'

export type TypenxAddonHandlers = {
  health?: () => MaybePromise<AddonHealth>
  catalog: (request: CatalogRequest) => MaybePromise<CatalogResponse>
  search: (request: SearchRequest) => MaybePromise<CatalogResponse>
  anime: (id: string) => MaybePromise<AnimeMetadata>
  recommendations?: (request: RecommendationRequest) => MaybePromise<RecommendationResponse>
  videos?: (request: VideoSourceRequest) => MaybePromise<VideoSourceResponse>
}

export type TypenxAddon = {
  manifest: AddonManifest
  handlers: TypenxAddonHandlers
  fetch: (request: Request) => Promise<Response>
}

type MaybePromise<T> = T | Promise<T>

export function createTypenxAddon(options: {
  manifest: AddonManifest
  handlers: TypenxAddonHandlers
}): TypenxAddon {
  async function handle(request: Request) {
    const url = new URL(request.url)
    const path = stripTrailingSlash(url.pathname)

    try {
      if (request.method === 'GET' && path === '/health') {
        return json(options.handlers.health?.() ?? { ok: true, message: null })
      }

      if (request.method === 'GET' && path === '/manifest') {
        return json(options.manifest)
      }

      if (request.method === 'POST' && path === '/catalog') {
        return json(options.handlers.catalog(await readJson<CatalogRequest>(request)))
      }

      if (request.method === 'POST' && path === '/search') {
        return json(options.handlers.search(await readJson<SearchRequest>(request)))
      }

      if (request.method === 'GET' && path.startsWith('/anime/')) {
        const id = decodeURIComponent(path.slice('/anime/'.length))
        return json(options.handlers.anime(id))
      }

      if (request.method === 'POST' && path === '/recommendations') {
        if (!options.handlers.recommendations) {
          return json({ message: 'Recommendations are not supported' }, 404)
        }
        return json(options.handlers.recommendations(await readJson<RecommendationRequest>(request)))
      }

      if (request.method === 'POST' && path === '/videos') {
        if (!options.handlers.videos) {
          return json({ message: 'Video sources are not supported' }, 404)
        }
        return json(options.handlers.videos(await readJson<VideoSourceRequest>(request)))
      }

      return json({ message: 'Not found' }, 404)
    } catch (error) {
      return json(
        { message: error instanceof Error ? error.message : 'Addon failed' },
        500,
      )
    }
  }

  return {
    manifest: options.manifest,
    handlers: options.handlers,
    fetch: handle,
  }
}

export function json(body: unknown, status = 200) {
  return Promise.resolve(body).then(
    (payload) =>
      new Response(JSON.stringify(payload), {
        status,
        headers: {
          'content-type': 'application/json; charset=utf-8',
        },
      }),
  )
}

async function readJson<T>(request: Request) {
  return (await request.json()) as T
}

function stripTrailingSlash(path: string) {
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1)
  return path
}

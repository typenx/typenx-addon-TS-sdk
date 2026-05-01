export type AddonResource = 'catalog' | 'search' | 'anime_meta' | 'episode_meta'

export type ContentType = 'anime' | 'movie' | 'ova' | 'ona' | 'special'

export type AddonManifest = {
  id: string
  name: string
  version: string
  description: string | null
  icon: string | null
  resources: AddonResource[]
  catalogs: CatalogDefinition[]
}

export type CatalogDefinition = {
  id: string
  name: string
  content_type: ContentType
  filters: CatalogFilter[]
}

export type CatalogFilter = {
  id: string
  name: string
  values: string[]
}

export type CatalogRequest = {
  addon_id?: string
  catalog_id: string
  skip?: number
  limit?: number
  query?: string
}

export type SearchRequest = {
  addon_id?: string
  query: string
  limit?: number
}

export type CatalogResponse = {
  items: AnimePreview[]
}

export type AnimePreview = {
  id: string
  title: string
  poster: string | null
  year: number | null
  content_type: ContentType
}

export type AnimeMetadata = {
  id: string
  title: string
  original_title: string | null
  synopsis: string | null
  poster: string | null
  banner: string | null
  year: number | null
  status: string | null
  genres: string[]
  episodes: EpisodeMetadata[]
  updated_at: string | null
}

export type EpisodeMetadata = {
  id: string
  anime_id: string
  number: number
  title: string | null
  synopsis: string | null
  thumbnail: string | null
  aired_at: string | null
}

export type AddonHealth = {
  ok: boolean
  message: string | null
}

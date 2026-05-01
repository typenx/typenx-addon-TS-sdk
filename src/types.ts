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
  banner?: string | null
  synopsis?: string | null
  score?: number | null
  year: number | null
  content_type: ContentType
}

export type AnimeMetadata = {
  id: string
  title: string
  original_title: string | null
  alternative_titles: string[]
  synopsis: string | null
  description: string | null
  poster: string | null
  banner: string | null
  year: number | null
  season: string | null
  season_year: number | null
  status: string | null
  content_type: ContentType
  source: string | null
  duration_minutes: number | null
  episode_count: number | null
  score: number | null
  rank: number | null
  popularity: number | null
  rating: string | null
  genres: string[]
  tags: string[]
  authors: string[]
  studios: string[]
  staff: StaffCredit[]
  country_of_origin: string | null
  start_date: string | null
  end_date: string | null
  site_url: string | null
  trailer_url: string | null
  external_links: ExternalLink[]
  episodes: EpisodeMetadata[]
  updated_at: string | null
}

export type StaffCredit = {
  name: string
  role: string | null
}

export type ExternalLink = {
  site: string
  url: string
}

export type EpisodeMetadata = {
  id: string
  anime_id: string
  season_number?: number | null
  number: number
  title: string | null
  synopsis: string | null
  thumbnail: string | null
  duration_minutes?: number | null
  source?: string | null
  aired_at: string | null
}

export type AddonHealth = {
  ok: boolean
  message: string | null
}

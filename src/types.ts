export type AddonResource =
  | 'catalog'
  | 'search'
  | 'anime_meta'
  | 'episode_meta'
  | 'video_sources'
  | 'manga_pages'
  | 'recommendations'

export type ContentType =
  | 'anime'
  | 'manga'
  | 'manhwa'
  | 'manhua'
  | 'light_novel'
  | 'movie'
  | 'ova'
  | 'ona'
  | 'special'

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
  content_type?: ContentType
  skip?: number
  limit?: number
  query?: string
}

export type SearchRequest = {
  addon_id?: string
  query: string
  content_type?: ContentType
  limit?: number
}

export type RecommendationSeed = {
  anime_id: string
  score?: number | null
  weight?: number | null
}

export type RecommendationRequest = {
  addon_id?: string
  liked: RecommendationSeed[]
  disliked?: RecommendationSeed[]
  limit?: number
  candidate_limit?: number
  include_reasons?: boolean
}

export type RecommendationPreview = AnimePreview & {
  recommendation_score: number
  reasons?: string[]
}

export type RecommendationResponse = {
  items: RecommendationPreview[]
}

export type VideoSourceRequest = {
  addon_id?: string
  anime_id: string
  anime_title?: string | null
  episode_id?: string | null
  episode_title?: string | null
  episode_number?: number | null
  season_number?: number | null
}

export type VideoSourceResponse = {
  streams: VideoStream[]
  subtitles?: VideoSubtitle[]
}

export type VideoStream = {
  id: string
  title?: string | null
  url: string
  quality?: string | null
  format?: string | null
  audio_language?: string | null
  headers: VideoHeader[]
}

export type VideoHeader = {
  name: string
  value: string
}

export type VideoSubtitle = {
  id: string
  label: string
  language?: string | null
  url: string
  format?: string | null
}

export type MangaPagesRequest = {
  addon_id?: string
  manga_id: string
  manga_title?: string | null
  chapter_id?: string | null
  chapter_number?: number | null
}

export type MangaPagesResponse = {
  manga_id: string
  chapter_id?: string | null
  chapter_number?: number | null
  pages: MangaPageImage[]
}

export type MangaPageImage = {
  index: number
  url: string
  width?: number | null
  height?: number | null
  mime_type?: string | null
  headers: VideoHeader[]
}

export type CatalogResponse = {
  items: AnimePreview[]
}

export type SeasonEntry = {
  id: string
  title: string
  season_number: number | null
  year: number | null
  episode_count: number | null
  source?: string | null
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
  genres?: string[]
  season_entries?: SeasonEntry[]
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

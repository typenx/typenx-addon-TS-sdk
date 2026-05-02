import type { AnimeMetadata, AnimePreview, EpisodeMetadata } from './types.js'

export type SeasonEntry = {
  id: string
  title: string
  season_number: number | null
  year: number | null
  episode_count: number | null
}

export type CentralizedAnimePreview = AnimePreview & {
  season_entries?: SeasonEntry[]
}

const seasonPatterns = [
  /\b(?:the\s+)?final\s+season\b/gi,
  /\bseason\s+\d+\b/gi,
  /\bs\d+\b/gi,
  /\b\d+(?:st|nd|rd|th)\s+season\b/gi,
  /\bpart\s+\d+\b/gi,
  /\bcour\s+\d+\b/gi,
]
const trailingSeasonPattern = /\s*[:-]\s*$/
const whitespacePattern = /\s+/g
const seasonNumberPatterns = [
  /\bseason\s+(\d+)\b/i,
  /\bs(\d+)\b/i,
  /\b(\d+)(?:st|nd|rd|th)\s+season\b/i,
]
const ordinalWords = new Map([
  ['second', 2],
  ['third', 3],
  ['fourth', 4],
  ['fifth', 5],
  ['sixth', 6],
  ['seventh', 7],
  ['eighth', 8],
  ['ninth', 9],
  ['tenth', 10],
])
const ordinalWordPattern = /\b(second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth)\s+season\b/i

export function centralizeSeasons(
  items: AnimePreview[],
  options: { keyTitles?: Record<string, string> } = {},
): CentralizedAnimePreview[] {
  const groups = new Map<string, AnimePreview[]>()
  for (const item of items) {
    const baseTitle = options.keyTitles?.[item.id] ?? baseShowTitle(item.title)
    const key = normalizeTitleKey(baseTitle)
    groups.set(key, [...(groups.get(key) ?? []), item])
  }

  return Array.from(groups.values()).map((group) => {
    const sortedGroup = [...group].sort(
      (a, b) =>
        (seasonNumberOf(a.title) ?? 1) - (seasonNumberOf(b.title) ?? 1) ||
        (a.year ?? 0) - (b.year ?? 0) ||
        a.title.localeCompare(b.title),
    )
    const primary = { ...sortedGroup[0] } as CentralizedAnimePreview
    primary.title = options.keyTitles?.[primary.id] ?? baseShowTitle(primary.title)
    primary.id = centralizedId(sortedGroup.map((item) => item.id))
    primary.season_entries = sortedGroup.map((item) => ({
      id: item.id,
      title: item.title,
      season_number: seasonNumberOf(item.title),
      year: item.year ?? null,
      episode_count: null,
    }))
    return primary
  })
}

export function combineAnimeSeasons(seasons: AnimeMetadata[]): AnimeMetadata {
  if (seasons.length === 0) {
    throw new Error('at least one season is required')
  }

  const ordered = [...seasons].sort(
    (a, b) =>
      (a.season_year ?? a.year ?? 0) - (b.season_year ?? b.year ?? 0) ||
      (a.start_date ?? '').localeCompare(b.start_date ?? '') ||
      (seasonNumberOf(a.title) ?? 1) - (seasonNumberOf(b.title) ?? 1),
  )
  const title = baseShowTitle(ordered[0].title)
  const combined: AnimeMetadata = {
    ...ordered[0],
    id: centralizedId(ordered.map((item) => item.id)),
    title,
    alternative_titles: uniqueStrings(
      ordered.flatMap((item) => [item.title, ...item.alternative_titles]),
    ).filter((value) => value !== title),
    genres: uniqueStrings(ordered.flatMap((item) => item.genres)),
    tags: uniqueStrings(ordered.flatMap((item) => item.tags)),
    studios: uniqueStrings(ordered.flatMap((item) => item.studios)),
    episodes: combinedEpisodes(ordered),
    start_date: ordered.find((item) => item.start_date)?.start_date ?? null,
    end_date: [...ordered].reverse().find((item) => item.end_date)?.end_date ?? null,
    season: null,
    season_year: ordered[0].year,
  }
  combined.episode_count =
    combined.episodes.length || ordered.reduce((total, item) => total + (item.episode_count ?? 0), 0) || null
  return combined
}

export function isCentralizedId(id: string) {
  return id.startsWith('central:')
}

export function centralizedIds(id: string) {
  return isCentralizedId(id)
    ? id.slice('central:'.length).split(',').filter(Boolean)
    : [id]
}

export function centralizedId(ids: string[]) {
  return ids.length > 1 ? `central:${ids.join(',')}` : ids[0]
}

export function baseShowTitle(title: string) {
  let value = title
  for (const pattern of seasonPatterns) {
    value = value.replace(pattern, '')
  }
  value = value.replace(ordinalWordPattern, '')
  return value.replace(trailingSeasonPattern, '').replace(whitespacePattern, ' ').trim()
}

export function normalizeTitleKey(title: string) {
  return baseShowTitle(title).toLowerCase().replace(/[^a-z0-9]+/g, '')
}

export function seasonNumberOf(title: string): number | null {
  for (const pattern of seasonNumberPatterns) {
    const match = title.match(pattern)
    if (match?.[1]) return Number(match[1])
  }
  const ordinal = title.match(ordinalWordPattern)?.[1]?.toLowerCase()
  return ordinal ? (ordinalWords.get(ordinal) ?? null) : null
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)))
}

function combinedEpisodes(seasons: AnimeMetadata[]): EpisodeMetadata[] {
  const animeId = centralizedId(seasons.map((item) => item.id))
  return seasons.flatMap((season, index) => {
    const seasonNumber = seasonNumberOf(season.title) ?? index + 1
    return season.episodes.map((episode) => ({
      ...episode,
      id: `${season.id}:${episode.id}`,
      anime_id: animeId,
      season_number: episode.season_number ?? seasonNumber,
    }))
  })
}

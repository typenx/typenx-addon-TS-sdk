# Typenx Addon TypeScript SDK

TypeScript SDK for building Typenx addons.

Typenx addons are remote HTTP services. Metadata addons provide catalog, search, and anime metadata. Video addons can also opt into `video_sources` and return episode stream URLs.

Use this SDK when you want to plug a new provider, catalog, recommendation source, or user-controlled video library into Typenx. If you like addon-first self-hosted anime tools, star [typenx-core](https://github.com/typenx/typenx-core).

```ts
import { createTypenxAddon, serveTypenxAddon } from '@typenx/addon-ts-sdk'

const shows = [
  {
    id: 'frieren-beyond-journeys-end',
    title: "Frieren: Beyond Journey's End",
    poster: 'https://cdn.myanimelist.net/images/anime/1015/138006.jpg',
    year: 2023,
    content_type: 'anime' as const,
  },
]

const addon = createTypenxAddon({
  manifest: {
    id: 'my-anime-source',
    name: 'My Anime Source',
    version: '0.1.0',
    description: 'Metadata addon backed by my anime catalog service.',
    icon: 'https://typenx.dev/addon-icon.png',
    resources: ['catalog', 'search', 'anime_meta', 'video_sources'],
    catalogs: [{ id: 'popular', name: 'Popular', content_type: 'anime', filters: [] }],
  },
  handlers: {
    catalog: async () => ({ items: shows }),
    search: async (query) => ({
      items: shows.filter((show) =>
        show.title.toLowerCase().includes(query.query.toLowerCase()),
      ),
    }),
    anime: async (id) => ({
      id,
      title: "Frieren: Beyond Journey's End",
      original_title: 'Sousou no Frieren',
      alternative_titles: ['Frieren: Beyond Journey's End'],
      synopsis: 'An elf mage retraces a former journey and learns what time leaves behind.',
      description: 'An elf mage retraces a former journey and learns what time leaves behind.',
      poster: shows[0].poster,
      banner: null,
      year: 2023,
      season: 'fall',
      season_year: 2023,
      status: 'finished',
      content_type: 'anime',
      source: 'manga',
      duration_minutes: 24,
      episode_count: 28,
      score: 9.2,
      rank: 1,
      popularity: null,
      rating: 'pg_13',
      genres: ['Adventure', 'Drama', 'Fantasy'],
      tags: ['Magic', 'Elf', 'Travel'],
      authors: ['Kanehito Yamada'],
      studios: ['Madhouse'],
      staff: [{ name: 'Kanehito Yamada', role: 'Original Creator' }],
      country_of_origin: 'JP',
      start_date: '2023-09-29',
      end_date: '2024-03-22',
      site_url: 'https://myanimelist.net/anime/52991',
      trailer_url: null,
      external_links: [{ site: 'MyAnimeList', url: 'https://myanimelist.net/anime/52991' }],
      episodes: [],
      updated_at: new Date().toISOString(),
    }),
    videos: async (request) => ({
      streams: [
        {
          id: `${request.anime_id}-${request.episode_number ?? request.episode_id}-720p`,
          title: '720p',
          url: 'https://cdn.example/anime/episode-1.mp4',
          quality: '720p',
          format: 'mp4',
          audio_language: 'ja',
          headers: [],
        },
      ],
      subtitles: [],
    }),
  },
})

serveTypenxAddon(addon)
```

Routes exposed by the SDK:

- `GET /health`
- `GET /manifest`
- `POST /catalog`
- `POST /search`
- `GET /anime/:id`
- `POST /videos`

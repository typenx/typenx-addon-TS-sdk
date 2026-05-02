# Typenx Addon TypeScript SDK

The TypeScript SDK for building Typenx addons.

Typenx addons are remote HTTP services with a typed schema. Metadata addons return catalogs, search results, and anime metadata. Video addons can additionally opt into the `video_sources` resource and return episode stream URLs they control. Once the service is running and registered, Typenx Core treats it as a first-class source — no rebuild, no plugin folder, no special deploy.

This SDK gives you the manifest types, request/response types, an HTTP server, and a couple of helpers so you can stand up a working addon in one file.

## Install

```bash
npm install @typenx/addon-ts-sdk
```

## A minimal addon

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
      alternative_titles: ["Frieren: Beyond Journey's End"],
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

That's a complete addon. Run it, register the URL in [Typenx Core](https://github.com/typenx/typenx-core) via `TYPENX_DEFAULT_ADDONS` or the addon panel, and it shows up in catalogs and search.

## Routes the SDK exposes

- `GET /health`
- `GET /manifest`
- `POST /catalog`
- `POST /search`
- `GET /anime/:id`
- `POST /videos`

## What kinds of things to build

- A bridge to a metadata source the official addons don't cover.
- A private catalog backed by a personal collection.
- A recommendation experiment that consumes signals from your AniList list.
- A video source that resolves episode URLs from your own infrastructure.

The SDKs in [Python](https://github.com/typenx/typenx-addon-python-sdk) and [Rust](https://github.com/typenx/typenx-addon-rust-sdk) speak the same protocol and interop cleanly with the TypeScript one.

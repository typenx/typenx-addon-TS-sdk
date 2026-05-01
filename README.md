# Typenx Addon SDK

TypeScript SDK for building Typenx metadata addons.

Typenx addons are remote HTTP services. They provide catalog, search, and anime metadata only. They do not return stream URLs or host media.

```ts
import { createTypenxAddon, serveTypenxAddon } from '@typenx/addon-sdk'

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
    resources: ['catalog', 'search', 'anime_meta'],
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
      synopsis: 'An elf mage retraces a former journey and learns what time leaves behind.',
      poster: shows[0].poster,
      banner: null,
      year: 2023,
      status: 'finished',
      genres: ['Adventure', 'Drama', 'Fantasy'],
      episodes: [],
      updated_at: new Date().toISOString(),
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

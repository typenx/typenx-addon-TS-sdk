# Typenx Addon SDK

TypeScript SDK for building Typenx metadata addons.

Typenx addons are remote HTTP services. They provide catalog, search, and anime metadata only. They do not return stream URLs or host media.

```ts
import { createTypenxAddon, serveTypenxAddon } from '@typenx/addon-sdk'

const addon = createTypenxAddon({
  manifest: {
    id: 'example',
    name: 'Example',
    version: '0.1.0',
    description: 'Example metadata addon',
    icon: 'https://example.com/icon.png',
    resources: ['catalog', 'search', 'anime_meta'],
    catalogs: [{ id: 'popular', name: 'Popular', content_type: 'anime', filters: [] }],
  },
  handlers: {
    catalog: async () => ({ items: [] }),
    search: async () => ({ items: [] }),
    anime: async (id) => ({
      id,
      title: id,
      original_title: null,
      synopsis: null,
      poster: null,
      banner: null,
      year: null,
      status: null,
      genres: [],
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

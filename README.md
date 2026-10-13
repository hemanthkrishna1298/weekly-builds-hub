# Weekly Builds hub

The public site that lists every app the weekly pipeline ships. It is a fully
static Next.js export (no server code) served from Cloudflare Workers static
assets.

Stack: Next.js 16 (App Router, `output: "export"`), Tailwind 4, TypeScript,
Wrangler. Fonts (Fraunces + Instrument Sans) are vendored in `src/fonts` and
loaded with `next/font/local`, so builds need no network access.

## Data flow

```
pipeline/apps.json  ──(npm run sync-data, runs as prebuild)──▶  hub/data/apps.json  ──▶  pages
```

- `pipeline/apps.json` is the single source of truth (schema in
  `pipeline/apps.schema.json`). The skills and scheduled tasks write to it.
- `scripts/sync-data.mjs` copies it into `data/apps.json` when the pipeline
  file exists. It runs automatically before every `npm run build` via the
  `prebuild` script.
- `data/apps.json` is committed, so a build that only checks out `hub/`
  (no `../pipeline`) still works with the last synced copy.
- Page code imports the data through `@/data/apps.json` (alias in
  `tsconfig.json`) and the typed helpers in `src/lib/apps.ts`.

What the site renders from the registry:

| Status                          | Front page | `/apps/<slug>/` page          | Feed / sitemap |
| ------------------------------- | ---------- | ----------------------------- | -------------- |
| `shipped`                       | yes        | yes, indexed                  | yes            |
| `preview`                       | no         | yes, `noindex` + banner       | no             |
| `candidate` / `picked` / `building` / `retired` | no | no                     | no             |

When no app is shipped or in preview, the front page shows an empty state and
the dynamic route emits a single placeholder page (`/apps/coming-soon/`,
`noindex`) so the static export still succeeds.

## Routes

- `/` front page: tagline, shipped apps newest week first, how it works.
- `/apps/<slug>/` one page per app. `<title>` is `{name} — {problem}` because
  the complaint in the users' own words is the SEO headline. Includes JSON-LD
  `SoftwareApplication`.
- `/about/` author, why weekly, how to request a tool.
- `/feed.xml` RSS of shipped apps. `/sitemap.xml`, `/robots.txt`.
- `/opengraph-image`, `/about/opengraph-image`, `/apps/<slug>/opengraph-image`
  typographic Open Graph cards generated at build time with `next/og`.

`public/_headers` sets `Content-Type` for the extensionless OG image files and
long cache headers for `/_next/static/*`. Cloudflare reads it from `out/`.

## Commands

```bash
npm install
npm run dev        # local dev server
npm run check      # lint + typecheck + build (what CI should run)
npm run build      # sync data, then static export to ./out
npm run preview    # serve ./out on http://localhost:3222
npm run deploy     # build, then wrangler deploy
```

## Deploy to Cloudflare Workers

`wrangler.jsonc` defines a static-assets-only Worker named `weekly-builds`
(no `main`; `assets.directory` is `./out`, unknown paths get the exported
`404.html`).

Authenticate once, either way:

- interactive: `npx wrangler login`
- CI / headless: set `CLOUDFLARE_API_TOKEN` (a token with the *Workers
  Scripts: Edit* permission) and `CLOUDFLARE_ACCOUNT_ID`.

Then:

```bash
npm run deploy
```

The first deploy makes the site available at
`https://weekly-builds.<your-subdomain>.workers.dev`. `npx wrangler deploy
--dry-run` validates the config and asset upload without touching Cloudflare.

### Custom domain

1. Add the domain to Cloudflare (DNS on Cloudflare is required).
2. Either add it in the dashboard (Workers & Pages → weekly-builds → Settings
   → Domains & Routes → Add → Custom domain), or declare it in
   `wrangler.jsonc` and redeploy:

   ```jsonc
   "routes": [{ "pattern": "builds.example.com", "custom_domain": true }]
   ```

3. Update `hub.url` in `pipeline/apps.json` to the new origin. It drives
   `metadataBase`, canonical URLs, the sitemap, robots and the RSS links, so
   rebuild and redeploy after changing it.

## Layout

```
hub/
  data/apps.json          synced copy of the registry (committed)
  scripts/sync-data.mjs   pipeline/apps.json -> data/apps.json
  public/_headers         Cloudflare header rules
  src/app/                routes (App Router)
  src/components/         header, footer, app entry, sources, tags
  src/lib/apps.ts         typed access to the registry + formatting helpers
  src/lib/og.tsx          shared Open Graph card renderer
  src/fonts/              vendored font files + licences
  wrangler.jsonc          Cloudflare Workers config
```

# Development

## Run it

```sh
npm ci
npm run dev
```

Open `http://localhost:3111/lowband/` for the landing page, `/lowband/play/` for the player (the phone app on phones, the web player everywhere else) and `/lowband/app/` for the phone app on any screen. Every route sits under `/lowband/`, as on GitHub Pages.

No API keys or environment variables are needed: the iTunes Search API and the Deezer API are both public.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the dev server on port 3111 |
| `npm run lint` | Runs ESLint |
| `npm run typecheck` | Type-checks with TypeScript |
| `npm run build` | Builds the static site into `out/` |
| `node scripts/refresh-catalog.mjs` | Refreshes `src/data/tracks.ts` from this week's Apple Music charts |

There are no automated tests; lint and the type check are the checks. To preview a build, serve `out/` from a folder named `lowband` so the paths match.

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`, and it runs again every Monday. It refreshes the catalogue from Apple Music's charts (keeping the committed copy if Apple can't be reached), builds, and publishes `out/` to GitHub Pages at `https://<username>.github.io/lowband/`. In the repository's Pages settings, the source must be GitHub Actions.

The `/lowband` base path is set in `next.config.mjs`. Change it there if the site moves.

# RepoShelf

A hand-picked shelf of GitHub repositories, curated by [Luca Daniel Ionescu](https://github.com/lucadani7).

**Live:** https://reposhelf.getastrobyte.com

Repos are added, edited and removed from the site itself, at `/admin`. Only the owner can sign in.

## Features

- **Shelves, App Store style:** a featured repo (the newest one), a "Recently added" row, and one horizontally scrolling shelf per tag.
- **Browse all:** search across names, descriptions, notes, languages and topics; filter by tag or framework; sort by date added, stars or last update.
- **Tag pages:** `/tags` lists every tag; `/tags/<tag>` shows its repos and related tags.
- **About page** with live stats (repos, tags, languages).
- **Admin** (`/admin`): sign in with GitHub, paste a repo URL to add it, edit its note, framework and tags, remove it, or refresh everything from GitHub.
- **Data from GitHub:** description, stars, forks, language, topics and last push are fetched automatically and refreshed once a day.
- **Light and dark mode:** follows the device by default, with a toggle in the navigation bar (automatic → light → dark).
- **Responsive:** designed for phones, tablets and desktop.
- **Shareable:** favicon, home-screen icon, a generated link-preview image, `sitemap.xml` and `robots.txt`.

## Tech stack

| Area | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Cache Components) + TypeScript |
| Styling | Tailwind CSS 4 |
| Database | Neon Postgres, via Drizzle ORM |
| Auth | Better Auth (Sign in with GitHub) |
| Hosting | Vercel (functions in Frankfurt, `fra1`), with a daily Vercel Cron job |
| Package manager | pnpm |

## How it works

- **Visitors get cached pages.** The repo list is read from the database once and cached (`lib/repos.ts`), so visits don't hit the database. Pages refresh at least daily.
- **Changes show up instantly.** Adding, editing or removing a repo in `/admin` clears the cache right away.
- **Only the owner can sign in.** Anyone whose GitHub username isn't `ADMIN_GITHUB_USERNAME` is turned away and nothing about them is stored. Every admin action re-checks this on the server.
- **Daily refresh.** Vercel Cron calls `/api/cron/refresh` (see `vercel.json`), which re-fetches every repo from GitHub. It's protected by `CRON_SECRET`.

## Run locally

Requirements: Node.js 22+, pnpm.

```bash
pnpm install
cp .env.example .env.local   # fill in the values (see below)
pnpm db:push                 # creates the tables in the database
pnpm dev                     # http://localhost:3000
```

Then open http://localhost:3000/admin and sign in with GitHub.

### Environment variables

| Variable | What it is |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string |
| `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | GitHub OAuth app used for sign-in |
| `BETTER_AUTH_SECRET` | Random secret, e.g. `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | The site's address: `http://localhost:3000` locally |
| `ADMIN_GITHUB_USERNAME` | The only GitHub account allowed into `/admin` |
| `GITHUB_TOKEN` | Optional but recommended: raises GitHub's API limit from 60 to 5,000 requests/hour |
| `CRON_SECRET` | Production only: protects the daily refresh endpoint |

Locally, the GitHub OAuth app's callback URL is `http://localhost:3000/api/auth/callback/github`.

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Start the dev server |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build locally |
| `pnpm db:push` | Apply `db/schema.ts` to the database |
| `pnpm db:studio` | Browse the database in the browser |
| `pnpm typecheck` | Check TypeScript |
| `pnpm lint` | Run ESLint |

## Deployment (Vercel)

1. **Database:** in Vercel → Storage, connect the Neon database to the project for all environments, with the variable prefix `DATABASE` (so it's named `DATABASE_URL`). Leave "Create Database Branch" unchecked so every deployment uses the same data.
2. **Sign-in:** create a separate GitHub OAuth app for production, with the callback URL
   `https://reposhelf.getastrobyte.com/api/auth/callback/github`.
3. **Environment variables (Production):** `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (from the production OAuth app), `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL=https://reposhelf.getastrobyte.com`, `ADMIN_GITHUB_USERNAME`, `GITHUB_TOKEN`, `CRON_SECRET`. Use different secrets than locally.
4. **Domain:** add `reposhelf.getastrobyte.com` in Vercel → Domains, and the `CNAME` record Vercel shows at the domain registrar.

### Branches

- `main` is what's live. Every push to `main` deploys to production.
- `dev` is for work in progress. Pushes get a private preview deployment.
- To publish: `git checkout main && git merge dev && git push`.

## Customizing

- **Your name, bio and GitHub link:** `lib/site.ts`
- **Site address:** `SITE_URL` in `lib/site.ts`
- **Colors (light and dark):** the variables at the top of `app/globals.css`
- **Shelves (how many, minimum repos per tag shelf):** constants at the top of `components/shelf/ShelfPage.tsx`

## Project structure

```
app/
  page.tsx                     home page (shelves + browse all)
  tags/page.tsx                all tags
  tags/[tag]/page.tsx          one tag's repos
  about/page.tsx               about page
  admin/page.tsx               admin: sign in, add, edit, remove, refresh
  actions.ts                   server actions (add / edit / remove / refresh), admin-only
  api/auth/[...all]/route.ts   Better Auth endpoints
  api/cron/refresh/route.ts    daily GitHub refresh (Vercel Cron)
  layout.tsx                   HTML shell, metadata, theme script
  globals.css                  Tailwind + light/dark color variables
  icon.svg, apple-icon.tsx     favicon and home-screen icon
  opengraph-image.tsx          link-preview image
  sitemap.ts, robots.ts        for search engines
  not-found.tsx                404 page
components/
  shelf/                       home page: featured card, shelves
  admin/                       admin-only UI
  RepoGrid.tsx, RepoCard.tsx   searchable grid of repo cards
  SiteNav.tsx, SiteFooter.tsx  navigation bar and footer
  ThemeToggle.tsx              light / dark / automatic
  TagRepos.tsx                 grid on tag pages
db/
  schema.ts                    tables: repos + sign-in
  index.ts                     database connection
lib/
  repos.ts                     cached list of repos
  github.ts                    GitHub API, URL parsing, daily sync
  auth.ts, session.ts          Better Auth config, who's signed in
  site.ts                      owner info and site URL
  tags.ts, languages.ts        helpers
  theme.ts                     theme preference + no-flash script
  types.ts                     shared types
drizzle.config.ts              drizzle-kit config
vercel.json                    region (Frankfurt) and daily cron
```

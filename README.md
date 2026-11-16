# RepoShelf

A hand-picked shelf of GitHub repositories, at **reposhelf.getastrobyte.com**.

Repos are added and removed from the site itself, at `/admin`, by the owner only.

**Stack:** Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS · Neon Postgres · Drizzle ORM · Better Auth (Sign in with GitHub) · Vercel

## How it works

- **Visitors** get a cached page. The repo list is read from the database once and cached (`lib/repos.ts`), so visits don't touch the database.
- **You** sign in at `/admin` with GitHub. Only the account in `ADMIN_GITHUB_USERNAME` can sign in — anyone else is turned away and nothing is stored.
- **Adding a repo:** paste a GitHub URL. The server fetches description, stars, language and topics from the GitHub API, saves them, and refreshes the cache instantly.
- **Daily refresh:** a Vercel Cron job (`vercel.json`) calls `/api/cron/refresh` once a day to update stars and descriptions.

## Run locally

```bash
pnpm install
cp .env.example .env.local   # fill in the values
pnpm db:push                 # creates the tables in Neon
pnpm dev                     # http://localhost:3000
```

Then open http://localhost:3000/admin and sign in.

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Start the dev server |
| `pnpm build` | Production build |
| `pnpm db:push` | Apply `db/schema.ts` to the database |
| `pnpm db:studio` | Browse the database in your browser |
| `pnpm typecheck` | Check TypeScript |
| `pnpm lint` | Run ESLint |

## Deploy (Vercel)

1. The Neon database is already connected to the Vercel project, so `DATABASE_URL` is set.
2. Create a **second** GitHub OAuth app for production, with callback URL
   `https://reposhelf.getastrobyte.com/api/auth/callback/github`.
3. In Vercel → Settings → Environment Variables (Production), add:
   `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (from the production OAuth app),
   `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL=https://reposhelf.getastrobyte.com`,
   `ADMIN_GITHUB_USERNAME`, `GITHUB_TOKEN`, `CRON_SECRET`.
4. In Vercel → Settings → Domains, add `reposhelf.getastrobyte.com`, then add the
   `CNAME` record Vercel shows you at your domain registrar.

## Project structure

```
app/
  page.tsx                   public page
  admin/page.tsx             admin: sign in, add, remove, refresh
  actions.ts                 server actions (add / remove / refresh), admin-only
  api/auth/[...all]/route.ts Better Auth endpoints
  api/cron/refresh/route.ts  daily GitHub refresh (Vercel Cron)
components/
  RepoGrid.tsx               search, filters, sorting
  RepoCard.tsx               one repo card
  admin/                     admin-only UI pieces
db/
  schema.ts                  database tables (repos + login)
  index.ts                   database connection
lib/
  repos.ts                   cached list of repos
  github.ts                  GitHub API + URL parsing + sync
  auth.ts                    Better Auth config (who's admin)
  session.ts                 read the signed-in user
  types.ts                   shared types
drizzle.config.ts            drizzle-kit config
vercel.json                  daily cron
```

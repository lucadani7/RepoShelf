import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import { MAX_HIGHLIGHTS, OWNER, TAGLINE } from "@/lib/site";
import { tagHref, tagLabel } from "@/lib/tags";
import type { Repo } from "@/lib/types";
import HighlightCard from "./HighlightCard";
import Shelf from "./Shelf";

/** How many tag shelves to show at most, and how many repos per shelf */
const MAX_TAG_SHELVES = 4;
const MAX_PER_SHELF = 12;
/** Tags with fewer repos than this don't get their own shelf (they're still on /projects) */
const MIN_PER_SHELF = 2;

/** The home page: a short showcase. The full, searchable list lives on /projects. */
export default function ShelfPage({ repos }: { repos: Repo[] }) {
  // The ones you ticked in /admin; otherwise the newest projects that have a description
  // (repos already come newest-first from the database)
  const picked = repos.filter((r) => r.featured).slice(0, MAX_HIGHLIGHTS);
  const highlights = picked.length > 0 ? picked : repos.filter((r) => r.description).slice(0, 3);
  const highlightIds = new Set(highlights.map((r) => r.id));

  const recent = repos.filter((r) => !highlightIds.has(r.id)).slice(0, MAX_PER_SHELF);

  // One shelf per tag, most-used tags first
  const byTag = new Map<string, Repo[]>();
  for (const repo of repos) {
    for (const tag of repo.tags) byTag.set(tag, [...(byTag.get(tag) ?? []), repo]);
  }
  const tagShelves = [...byTag.entries()]
    .filter(([, tagRepos]) => tagRepos.length >= MIN_PER_SHELF)
    .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
    .slice(0, MAX_TAG_SHELVES);

  // Layout for 1–6 highlights: one big card, two side by side, or a grid of three
  const gridCols =
    highlights.length === 1 ? "" : highlights.length === 2 || highlights.length === 4 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3";

  return (
    <>
      <SiteNav />

      <main className="mx-auto max-w-6xl px-5 pb-16">
        <header className="pt-14 pb-10 sm:pt-20">
          <p className="text-sm font-medium text-muted">by {OWNER.name}</p>
          <h1 className="mt-2 font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl">RepoShelf</h1>
          <p className="mt-3 max-w-2xl text-xl text-muted">{TAGLINE}</p>
        </header>

        {repos.length === 0 ? (
          <p className="rounded-3xl bg-surface py-20 text-center text-lg text-muted shadow-soft">No projects here yet.</p>
        ) : (
          <>
            <section aria-labelledby="highlights">
              <h2 id="highlights" className="mb-5 font-display text-2xl font-semibold tracking-tight text-ink">
                Highlights
              </h2>
              <div className={`grid gap-5 ${gridCols}`}>
                {highlights.map((repo) => (
                  <HighlightCard key={repo.id} repo={repo} large={highlights.length === 1} />
                ))}
              </div>
            </section>

            {recent.length > 0 && <Shelf title="Recently added" repos={recent} seeAllHref="/projects" />}

            {tagShelves.map(([tag, tagRepos]) => (
              <Shelf
                key={tag}
                title={tagLabel(tag)}
                repos={tagRepos.slice(0, MAX_PER_SHELF)}
                seeAllHref={tagHref(tag)}
              />
            ))}

            <div className="mt-16 flex flex-col items-center gap-4 rounded-[2rem] bg-surface px-6 py-12 text-center shadow-soft">
              <p className="font-display text-3xl font-semibold tracking-tight text-ink">
                {repos.length} {repos.length === 1 ? "project" : "projects"} in total
              </p>
              <p className="max-w-md text-muted">Search all of them, or filter by topic, framework or language.</p>
              <Link
                href="/projects"
                className="mt-2 inline-flex h-11 items-center rounded-full bg-accent px-6 text-[15px] font-medium text-white shadow-soft transition hover:bg-accent-hover"
              >
                See all projects
              </Link>
            </div>
          </>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

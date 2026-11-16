"use client";

import { useMemo, useRef, useState } from "react";
import RepoGrid from "@/components/RepoGrid";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import { OWNER } from "@/lib/site";
import { tagHref, tagLabel } from "@/lib/tags";
import type { Repo } from "@/lib/types";
import FeaturedCard from "./FeaturedCard";
import Shelf from "./Shelf";

/** How many tag shelves to show at most, and how many repos per shelf */
const MAX_TAG_SHELVES = 6;
const MAX_PER_SHELF = 12;
/** Tags with fewer repos than this don't get their own shelf (they're still in "Browse all") */
const MIN_PER_SHELF = 2;

export default function ShelfPage({ repos }: { repos: Repo[] }) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const browseRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Newest first (repos already come sorted that way from the database)
  const [featured, ...rest] = repos;

  // One shelf per tag, most-used tags first
  const tagShelves = useMemo(() => {
    const byTag = new Map<string, Repo[]>();
    for (const repo of repos) {
      for (const tag of repo.tags) byTag.set(tag, [...(byTag.get(tag) ?? []), repo]);
    }
    return [...byTag.entries()]
      .filter(([, tagRepos]) => tagRepos.length >= MIN_PER_SHELF)
      .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
      .slice(0, MAX_TAG_SHELVES);
  }, [repos]);

  const goToBrowse = (options: { tag?: string | null; focusSearch?: boolean } = {}) => {
    if (options.tag !== undefined) setActiveTag(options.tag);
    browseRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (options.focusSearch) searchRef.current?.focus({ preventScroll: true });
  };

  return (
    <>
      <SiteNav onBrowse={() => goToBrowse()} onSearch={() => goToBrowse({ focusSearch: true })} />

      <main className="mx-auto max-w-6xl px-5 pb-16">
        <header className="pt-14 pb-10 sm:pt-20">
          <p className="text-sm font-medium text-muted">by {OWNER.name}</p>
          <h1 className="mt-2 font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl">Discover</h1>
          <p className="mt-3 max-w-2xl text-xl text-muted">Hand-picked GitHub repositories, worth a look.</p>
        </header>

        {repos.length === 0 ? (
          <p className="rounded-3xl bg-white py-20 text-center text-lg text-muted shadow-soft">
            The shelf is empty for now. Check back soon.
          </p>
        ) : (
          <>
            <FeaturedCard repo={featured} />

            {rest.length > 0 && <Shelf title="Recently added" repos={rest.slice(0, MAX_PER_SHELF)} />}

            {tagShelves.map(([tag, tagRepos]) => (
              <Shelf
                key={tag}
                title={tagLabel(tag)}
                repos={tagRepos.slice(0, MAX_PER_SHELF)}
                seeAllHref={tagHref(tag)}
              />
            ))}

            <section ref={browseRef} id="browse" className="mt-16 scroll-mt-20 border-t border-black/10 pt-4">
              <h2 className="mb-6 font-display text-2xl font-semibold tracking-tight text-ink">Browse all</h2>
              <RepoGrid
                repos={repos}
                query={query}
                onQueryChange={setQuery}
                activeTag={activeTag}
                onTagChange={setActiveTag}
                searchRef={searchRef}
              />
            </section>
          </>
        )}

      </main>
      <SiteFooter />
    </>
  );
}

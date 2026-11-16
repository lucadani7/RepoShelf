"use client";

import { useMemo, useState, type ReactNode, type RefObject } from "react";
import type { Repo } from "@/lib/types";
import RepoCard from "./RepoCard";

type SortKey = "added" | "stars" | "updated";

const SORT_LABELS: Record<SortKey, string> = {
  added: "Recently added",
  stars: "Most stars",
  updated: "Recently updated",
};

const pillSelect =
  "h-10 cursor-pointer appearance-none rounded-full bg-surface bg-[length:10px] bg-[right_1rem_center] bg-no-repeat pr-9 pl-4 text-sm text-ink shadow-soft ring-1 ring-ink/5 transition hover:ring-ink/10 focus:ring-2 focus:ring-accent/40 focus:outline-none";

// Small chevron for the selects (inline SVG, no extra file)
const chevron = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='%236e6e73' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
};

type Props = {
  repos: Repo[];
  query: string;
  onQueryChange: (query: string) => void;
  activeTag: string | null;
  onTagChange: (tag: string | null) => void;
  searchRef?: RefObject<HTMLInputElement | null>;
  /** Hide the row of tag pills (e.g. on a tag's own page) */
  showTagFilter?: boolean;
};

/** "Browse all" section: search, filters, sorting and the full grid. */
export default function RepoGrid({
  repos,
  query,
  onQueryChange,
  activeTag,
  onTagChange,
  searchRef,
  showTagFilter = true,
}: Props) {
  const [framework, setFramework] = useState("");
  const [sort, setSort] = useState<SortKey>("added");

  const allTags = useMemo(() => [...new Set(repos.flatMap((r) => r.tags))].sort(), [repos]);

  const allFrameworks = useMemo(
    () =>
      [...new Set(repos.map((r) => r.framework).filter((f): f is string => Boolean(f)))].sort((a, b) =>
        a.localeCompare(b),
      ),
    [repos],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtered = repos.filter((r) => {
      if (activeTag && !r.tags.includes(activeTag)) return false;
      if (framework && r.framework !== framework) return false;
      if (!q) return true;
      return [r.fullName, r.description, r.note, r.language, r.framework, ...r.tags, ...r.topics]
        .filter((field): field is string => Boolean(field))
        .some((field) => field.toLowerCase().includes(q));
    });

    return filtered.sort((a, b) => {
      if (sort === "stars") return b.stars - a.stars;
      if (sort === "updated") return (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "");
      return b.addedAt.localeCompare(a.addedAt);
    });
  }, [repos, query, activeTag, framework, sort]);

  const toggleTag = (tag: string) => onTagChange(activeTag === tag ? null : tag);

  return (
    <section>
      {/* Search */}
      <div className="relative w-full max-w-xl">
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="pointer-events-none absolute top-1/2 left-5 h-4 w-4 -translate-y-1/2 text-faint"
        >
          <circle cx="8.5" cy="8.5" r="6" className="fill-none stroke-current" strokeWidth="1.8" />
          <path d="M13 13l4.5 4.5" className="stroke-current" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          ref={searchRef}
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search projects, languages, topics"
          aria-label="Search projects"
          className="h-12 w-full rounded-full bg-surface pr-5 pl-12 text-base text-ink shadow-soft ring-1 ring-ink/5 transition placeholder:text-faint focus:ring-2 focus:ring-accent/40 focus:outline-none"
        />
      </div>

      {/* Filters: tags scroll sideways on phones, wrap on larger screens */}
      {showTagFilter && allTags.length > 0 && (
        <div className="no-scrollbar -mx-5 mt-5 flex gap-2 overflow-x-auto px-5 py-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          <TagPill active={activeTag === null} onClick={() => onTagChange(null)}>
            All
          </TagPill>
          {allTags.map((tag) => (
            <TagPill key={tag} active={activeTag === tag} onClick={() => toggleTag(tag)}>
              {tag}
            </TagPill>
          ))}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {allFrameworks.length > 0 && (
          <select
            value={framework}
            onChange={(e) => setFramework(e.target.value)}
            aria-label="Filter by framework"
            className={pillSelect}
            style={chevron}
          >
            <option value="">All frameworks</option>
            {allFrameworks.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        )}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          aria-label="Sort projects"
          className={pillSelect}
          style={chevron}
        >
          {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
            <option key={key} value={key}>
              {SORT_LABELS[key]}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-8 mb-4 text-sm text-faint">
        {visible.length} {visible.length === 1 ? "project" : "projects"}
      </p>

      {visible.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((repo) => (
            <RepoCard key={repo.id} repo={repo} activeTag={activeTag} onTagClick={toggleTag} />
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-lg text-muted">No project matches that.</p>
      )}
    </section>
  );
}

function TagPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`h-10 shrink-0 rounded-full px-4 text-sm whitespace-nowrap transition ${
        active ? "bg-ink text-canvas shadow-soft" : "bg-surface text-ink shadow-soft ring-1 ring-ink/5 hover:ring-ink/10"
      }`}
    >
      {children}
    </button>
  );
}

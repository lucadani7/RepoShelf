"use client";

import { useEffect, useRef, useState } from "react";
import RepoGrid from "@/components/RepoGrid";
import type { Repo } from "@/lib/types";

/** The full list on /projects: search, tag and framework filters, sorting. */
export default function ProjectsView({ repos }: { repos: Repo[] }) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // The search icon in the nav links to /projects#search: put the cursor in the box
  useEffect(() => {
    const focusIfSearch = () => {
      if (window.location.hash === "#search") searchRef.current?.focus();
    };
    focusIfSearch();
    window.addEventListener("hashchange", focusIfSearch);
    return () => window.removeEventListener("hashchange", focusIfSearch);
  }, []);

  return (
    <div id="search" className="scroll-mt-20">
      <RepoGrid
        repos={repos}
        query={query}
        onQueryChange={setQuery}
        activeTag={activeTag}
        onTagChange={setActiveTag}
        searchRef={searchRef}
      />
    </div>
  );
}

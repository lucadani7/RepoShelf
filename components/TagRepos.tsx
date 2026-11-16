"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import RepoGrid from "@/components/RepoGrid";
import { tagHref } from "@/lib/tags";
import type { Repo } from "@/lib/types";

/** The grid on a tag page: search and sort work here, tag clicks go to that tag's page. */
export default function TagRepos({ repos, tag }: { repos: Repo[]; tag: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <RepoGrid
      repos={repos}
      query={query}
      onQueryChange={setQuery}
      activeTag={tag}
      onTagChange={(next) => {
        if (next && next !== tag) router.push(tagHref(next));
      }}
      showTagFilter={false}
    />
  );
}

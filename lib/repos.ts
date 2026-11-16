import { desc } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { repo } from "@/db/schema";
import type { Repo } from "./types";

/** Cache tag for everything that shows the list of repos. */
export const REPOS_TAG = "repos";

/**
 * All repos on the shelf, newest first.
 *
 * Cached: visitors don't hit the database. Adding/removing a repo calls
 * updateTag(REPOS_TAG), so changes show up immediately.
 */
export async function getRepos(): Promise<Repo[]> {
  "use cache";
  cacheTag(REPOS_TAG);
  cacheLife("days");

  const rows = await db.select().from(repo).orderBy(desc(repo.createdAt));

  return rows.map((r) => ({
    id: r.id,
    fullName: r.fullName,
    owner: r.owner,
    name: r.name,
    url: `https://github.com/${r.fullName}`,
    note: r.note,
    framework: r.framework,
    tags: r.tags,
    featured: r.featured,
    description: r.description,
    homepage: r.homepage,
    stars: r.stars,
    forks: r.forks,
    language: r.language,
    // Don't repeat topics that are already one of your tags
    topics: r.topics.filter((t) => !r.tags.includes(t)),
    avatarUrl: r.avatarUrl,
    archived: r.archived,
    updatedAt: r.pushedAt?.toISOString() ?? null,
    addedAt: r.createdAt.toISOString(),
  }));
}

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { repo } from "@/db/schema";

const NAME = "[A-Za-z0-9_.-]+";
const FULL_NAME = new RegExp(`^(${NAME})/(${NAME})$`);

/**
 * Accepts "owner/name", "github.com/owner/name" or any github.com URL
 * (with .git, /tree/main, ?tab=… etc.) and returns "owner/name".
 */
export function parseRepoInput(input: string): string | null {
  let value = input.trim();
  if (!value) return null;

  const url = value.match(/^(?:https?:\/\/)?(?:www\.)?github\.com\/([^/?#]+)\/([^/?#]+)/i);
  if (url) value = `${url[1]}/${url[2]}`;

  value = value.replace(/\.git$/i, "");
  return FULL_NAME.test(value) ? value : null;
}

export type GitHubRepoData = {
  fullName: string;
  owner: string;
  name: string;
  description: string | null;
  homepage: string | null;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  avatarUrl: string;
  archived: boolean;
  pushedAt: Date | null;
};

export type GitHubResult =
  | { ok: true; data: GitHubRepoData }
  | { ok: false; reason: "not_found" | "rate_limited" | "failed"; status?: number };

type GitHubApiRepo = {
  full_name: string;
  name: string;
  owner: { login: string; avatar_url: string };
  description: string | null;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics?: string[];
  archived: boolean;
  pushed_at: string | null;
};

export async function fetchGitHubRepo(fullName: string): Promise<GitHubResult> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${fullName}`, {
      headers,
      cache: "no-store",
    });

    if (res.status === 404) return { ok: false, reason: "not_found", status: 404 };
    if (res.status === 403 || res.status === 429) {
      return { ok: false, reason: "rate_limited", status: res.status };
    }
    if (!res.ok) return { ok: false, reason: "failed", status: res.status };

    const d = (await res.json()) as GitHubApiRepo;
    return {
      ok: true,
      data: {
        fullName: d.full_name,
        owner: d.owner.login,
        name: d.name,
        description: d.description,
        homepage: d.homepage || null,
        stars: d.stargazers_count,
        forks: d.forks_count,
        language: d.language,
        topics: d.topics ?? [],
        avatarUrl: d.owner.avatar_url,
        archived: d.archived,
        pushedAt: d.pushed_at ? new Date(d.pushed_at) : null,
      },
    };
  } catch (error) {
    console.warn(`[reposhelf] Could not reach GitHub for ${fullName}:`, error);
    return { ok: false, reason: "failed" };
  }
}

/**
 * Re-fetches every repo from GitHub and updates the database.
 * Used by the daily cron job and the "Refresh from GitHub" button.
 */
export async function syncAllFromGitHub() {
  const rows = await db.select({ id: repo.id, fullName: repo.fullName }).from(repo);
  let updated = 0;
  const failed: string[] = [];

  // One at a time keeps us well clear of GitHub's secondary rate limits.
  for (const row of rows) {
    const result = await fetchGitHubRepo(row.fullName);
    if (!result.ok) {
      failed.push(`${row.fullName} (${result.reason})`);
      continue;
    }
    const { fullName, owner, name, ...details } = result.data;
    await db
      .update(repo)
      .set({ fullName, owner, name, ...details, syncedAt: new Date() })
      .where(eq(repo.id, row.id));
    updated++;
  }

  return { total: rows.length, updated, failed };
}

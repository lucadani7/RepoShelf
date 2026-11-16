"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { db } from "@/db";
import { repo } from "@/db/schema";
import { fetchGitHubRepo, parseRepoInput, syncAllFromGitHub } from "@/lib/github";
import { REPOS_TAG } from "@/lib/repos";
import { getAdmin } from "@/lib/session";

export type ActionResult = { ok: boolean; message: string } | null;

const NOT_ALLOWED: ActionResult = { ok: false, message: "Only the admin can do that." };

function text(formData: FormData, key: string): string | null {
  const value = String(formData.get(key) ?? "").trim();
  return value || null;
}

function parseTags(raw: string | null): string[] {
  if (!raw) return [];
  const tags = raw
    .split(/[,\s]+/)
    .map((t) => t.replace(/^#/, "").trim().toLowerCase())
    .filter(Boolean);
  return [...new Set(tags)];
}

export async function addRepo(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  // Always re-check on the server — never trust the browser.
  if (!(await getAdmin())) return NOT_ALLOWED;

  const input = text(formData, "repo") ?? "";
  const fullName = parseRepoInput(input);
  if (!fullName) {
    return { ok: false, message: "Paste a GitHub URL or owner/name, e.g. vercel/next.js." };
  }

  const result = await fetchGitHubRepo(fullName);
  if (!result.ok) {
    const messages = {
      not_found: `GitHub can't find ${fullName}. Is it public and spelled right?`,
      rate_limited: "GitHub's rate limit was hit. Add a GITHUB_TOKEN or try again later.",
      failed: "Couldn't reach GitHub. Try again in a moment.",
    } as const;
    return { ok: false, message: messages[result.reason] };
  }

  const inserted = await db
    .insert(repo)
    .values({
      ...result.data,
      note: text(formData, "note"),
      framework: text(formData, "framework"),
      tags: parseTags(text(formData, "tags")),
    })
    .onConflictDoNothing({ target: repo.fullName })
    .returning({ id: repo.id });

  if (inserted.length === 0) {
    return { ok: false, message: `${result.data.fullName} is already on the shelf.` };
  }

  updateTag(REPOS_TAG);
  return { ok: true, message: `Added ${result.data.fullName}.` };
}

export async function removeRepo(id: string): Promise<ActionResult> {
  if (!(await getAdmin())) return NOT_ALLOWED;

  const deleted = await db.delete(repo).where(eq(repo.id, id)).returning({ fullName: repo.fullName });
  if (deleted.length === 0) return { ok: false, message: "That repo was already removed." };

  updateTag(REPOS_TAG);
  return { ok: true, message: `Removed ${deleted[0].fullName}.` };
}

export async function refreshFromGitHub(): Promise<ActionResult> {
  if (!(await getAdmin())) return NOT_ALLOWED;

  const { total, updated, failed } = await syncAllFromGitHub();
  updateTag(REPOS_TAG);

  if (failed.length > 0) {
    return { ok: false, message: `Updated ${updated} of ${total}. Failed: ${failed.join(", ")}` };
  }
  return { ok: true, message: `Updated all ${total} repos from GitHub.` };
}

export async function updateRepo(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  if (!(await getAdmin())) return NOT_ALLOWED;

  const id = text(formData, "id");
  if (!id) return { ok: false, message: "Missing repo." };

  const featured = formData.get("featured") === "on";

  // Only one repo can be featured: un-feature the others first
  if (featured) await db.update(repo).set({ featured: false }).where(eq(repo.featured, true));

  const updated = await db
    .update(repo)
    .set({
      note: text(formData, "note"),
      framework: text(formData, "framework"),
      tags: parseTags(text(formData, "tags")),
      featured,
    })
    .where(eq(repo.id, id))
    .returning({ fullName: repo.fullName });

  if (updated.length === 0) return { ok: false, message: "That repo no longer exists." };

  updateTag(REPOS_TAG);
  return { ok: true, message: `Saved ${updated[0].fullName}.` };
}

"use client";

import { useActionState, useState, useTransition } from "react";
import { refreshRepo, updateRepo, type ActionResult } from "@/app/actions";
import type { Repo } from "@/lib/types";
import RepoAvatar from "@/components/RepoAvatar";
import RemoveButton from "./RemoveButton";

const inputClass =
  "w-full rounded-xl bg-canvas px-3.5 py-2.5 text-[15px] text-ink placeholder:text-faint transition focus:bg-surface focus:ring-2 focus:ring-accent/40 focus:outline-none";

/** One row in the admin list: shows the repo, with Refresh, Edit and Remove. */
export default function AdminRepoItem({ repo }: { repo: Repo }) {
  const [editing, setEditing] = useState(false);
  const [refreshResult, setRefreshResult] = useState<ActionResult>(null);
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(async (prev, formData) => {
    setRefreshResult(null);
    const result = await updateRepo(prev, formData);
    if (result?.ok) setEditing(false); // close the form once a save succeeds
    return result;
  }, null);

  // ↻ — refresh just this repo from GitHub
  const [refreshing, startRefresh] = useTransition();
  const refresh = () =>
    startRefresh(async () => {
      setRefreshResult(await refreshRepo(repo.id));
    });

  // Show whichever happened last: a save or a refresh
  const status = refreshResult ?? (state?.ok && !editing ? state : null);

  return (
    <li className="rounded-2xl px-2 py-3 transition hover:bg-canvas">
      <div className="flex items-center gap-3">
        <RepoAvatar repo={repo} size={32} />
        <div className="min-w-0 flex-1">
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block truncate font-medium text-ink hover:text-link"
          >
            {repo.fullName}
          </a>
          <p className="truncate text-xs text-faint">
            {repo.featured && <span className="mr-1.5 font-medium text-accent">★ Featured</span>}
            {[repo.framework, ...repo.tags].filter(Boolean).join(" · ") || "No tags"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing((open) => !open)}
          aria-expanded={editing}
          className="h-8 shrink-0 rounded-full px-3.5 text-sm text-link transition hover:bg-accent/10"
        >
          {editing ? "Cancel" : "Edit"}
        </button>
        <button
          type="button"
          onClick={refresh}
          disabled={refreshing}
          aria-label={`Refresh ${repo.fullName} from GitHub`}
          title="Refresh from GitHub"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-ink/[0.06] hover:text-ink disabled:opacity-60"
        >
          <svg viewBox="0 0 20 20" className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} aria-hidden="true">
            <path
              d="M16.5 10a6.5 6.5 0 1 1-1.9-4.6M16.5 3.5v3.5H13"
              className="fill-none stroke-current"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <RemoveButton id={repo.id} fullName={repo.fullName} />
      </div>

      {status && (
        <p className={`mt-2 ml-11 text-xs ${status.ok ? "text-success" : "text-danger"}`}>{status.message}</p>
      )}

      {editing && (
        <form action={formAction} className="mt-3 space-y-3 sm:ml-11">
          <input type="hidden" name="id" value={repo.id} />
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted">Framework</span>
              <input
                name="framework"
                defaultValue={repo.framework ?? ""}
                placeholder="Next.js"
                className={inputClass}
                autoComplete="off"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted">Tags (comma-separated)</span>
              <input
                name="tags"
                defaultValue={repo.tags.join(", ")}
                placeholder="web, react"
                className={inputClass}
                autoComplete="off"
              />
            </label>
          </div>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted">Note</span>
            <textarea
              name="note"
              rows={2}
              defaultValue={repo.note ?? ""}
              placeholder="Why it's on the shelf"
              className={inputClass}
            />
          </label>
          <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm text-ink">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={repo.featured}
              className="h-4 w-4 rounded accent-accent"
            />
            Featured on the home page
            <span className="text-faint">(replaces the current one)</span>
          </label>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={pending}
              className="h-9 rounded-full bg-accent px-5 text-sm font-medium text-white transition hover:bg-accent-hover disabled:opacity-60"
            >
              {pending ? "Saving…" : "Save"}
            </button>
            {state && !state.ok && <p className="text-sm text-danger">{state.message}</p>}
          </div>
        </form>
      )}
    </li>
  );
}

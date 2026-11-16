import type { Metadata } from "next";
import { Suspense } from "react";
import AddRepoForm from "@/components/admin/AddRepoForm";
import { SignInButton, SignOutButton } from "@/components/admin/AuthButtons";
import RefreshButton from "@/components/admin/RefreshButton";
import RemoveButton from "@/components/admin/RemoveButton";
import SiteNav from "@/components/SiteNav";
import { getRepos } from "@/lib/repos";
import { getSessionUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Admin — RepoShelf",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ error?: string | string[] }>;

const panel = "rounded-3xl bg-surface p-5 shadow-soft sm:p-8";

export default function AdminPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-3xl px-5 pt-12 pb-24 sm:pt-16">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Admin</h1>

        {/* Reading the session happens per request, so it streams in here */}
        <Suspense fallback={<p className="mt-10 text-muted">Checking your session…</p>}>
          <AdminPanel searchParams={searchParams} />
        </Suspense>
      </main>
    </>
  );
}

async function AdminPanel({ searchParams }: { searchParams: SearchParams }) {
  const [user, params] = await Promise.all([getSessionUser(), searchParams]);

  if (!user) {
    return (
      <section className={`mt-10 space-y-5 text-center ${panel}`}>
        {params.error && (
          <p className="rounded-2xl bg-danger/10 px-4 py-3 text-sm text-danger">
            Sign-in failed. Only the RepoShelf owner can sign in here.
          </p>
        )}
        <p className="text-lg text-muted">Sign in with the owner&apos;s GitHub account to manage the shelf.</p>
        <SignInButton />
      </section>
    );
  }

  if (!user.isAdmin) {
    return (
      <section className={`mt-10 space-y-5 ${panel}`}>
        <p className="text-ink-2">
          You&apos;re signed in as <strong className="text-ink">{user.githubLogin ?? user.name}</strong>, but only
          the owner can manage the shelf.
        </p>
        <SignOutButton />
      </section>
    );
  }

  const repos = await getRepos();

  return (
    <div className="mt-10 space-y-6">
      <div className="flex items-center justify-between gap-4 rounded-full bg-surface py-2 pr-2 pl-3 shadow-soft">
        <div className="flex min-w-0 items-center gap-3">
          {user.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt="" width={32} height={32} className="h-8 w-8 rounded-full" />
          )}
          <span className="truncate text-sm text-muted">
            Signed in as <strong className="font-medium text-ink">{user.githubLogin}</strong>
          </span>
        </div>
        <SignOutButton />
      </div>

      <section className={panel}>
        <h2 className="mb-5 text-xl font-semibold tracking-tight text-ink">Add a repo</h2>
        <AddRepoForm />
      </section>

      <section className={panel}>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold tracking-tight text-ink">
            On the shelf <span className="font-normal text-faint">{repos.length}</span>
          </h2>
          {repos.length > 0 && <RefreshButton />}
        </div>

        {repos.length === 0 ? (
          <p className="text-muted">Nothing here yet. Add your first repo above.</p>
        ) : (
          <ul className="-mx-2 divide-y divide-ink/5">
            {repos.map((repo) => (
              <li key={repo.id} className="flex items-center gap-3 rounded-2xl px-2 py-3 transition hover:bg-canvas">
                {repo.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={repo.avatarUrl}
                    alt=""
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-lg ring-1 ring-ink/5"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-lg bg-canvas" />
                )}
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
                    {[repo.framework, ...repo.tags].filter(Boolean).join(" · ") || "No tags"}
                  </p>
                </div>
                <RemoveButton id={repo.id} fullName={repo.fullName} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

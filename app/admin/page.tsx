import type { Metadata } from "next";
import { Suspense } from "react";
import AddRepoForm from "@/components/admin/AddRepoForm";
import { SignInButton, SignOutButton } from "@/components/admin/AuthButtons";
import RefreshButton from "@/components/admin/RefreshButton";
import AdminRepoItem from "@/components/admin/AdminRepoItem";
import SiteNav from "@/components/SiteNav";
import { getRepos } from "@/lib/repos";
import { getSessionUser } from "@/lib/session";
import { MAX_HIGHLIGHTS } from "@/lib/site";

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

/**
 * Shown after a failed "Sign in with GitHub". Anyone other than the owner is
 * refused by lib/auth.ts, which Better Auth reports as "unable_to_create_user".
 */
function SignInError({ code }: { code: string | string[] }) {
  const denied = (Array.isArray(code) ? code[0] : code) === "unable_to_create_user";

  return (
    <div role="alert" className="rounded-2xl bg-danger/10 px-5 py-4 text-left text-danger">
      <p className="font-semibold">{denied ? "403 · Access denied" : "Sign-in failed"}</p>
      <p className="mt-1 text-sm">
        {denied
          ? "This admin area belongs to the owner of RepoShelf. Your GitHub account isn't allowed to sign in here, and nothing about it was saved."
          : "Something went wrong while signing in with GitHub. Please try again."}
      </p>
    </div>
  );
}

/** Tells you how many projects are ticked for "Highlights" and what the home page does with them */
function HighlightsSummary({ count }: { count: number }) {
  const text =
    count === 0
      ? "No highlights picked: the home page shows your 3 newest projects that have a description. Use Edit → Highlight to choose."
      : count > MAX_HIGHLIGHTS
        ? `${count} highlights picked, but the home page only shows ${MAX_HIGHLIGHTS}: the newest ones.`
        : `${count} of ${MAX_HIGHLIGHTS} highlights picked.`;
  return <p className={`-mt-2 mb-4 text-sm ${count > MAX_HIGHLIGHTS ? "text-danger" : "text-muted"}`}>{text}</p>;
}

async function AdminPanel({ searchParams }: { searchParams: SearchParams }) {
  const [user, params] = await Promise.all([getSessionUser(), searchParams]);

  if (!user) {
    return (
      <section className={`mt-10 space-y-5 text-center ${panel}`}>
        {params.error && <SignInError code={params.error} />}
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

        {repos.length > 0 && <HighlightsSummary count={repos.filter((r) => r.featured).length} />}

        {repos.length === 0 ? (
          <p className="text-muted">Nothing here yet. Add your first repo above.</p>
        ) : (
          <ul className="-mx-2 divide-y divide-ink/5">
            {repos.map((repo) => (
              <AdminRepoItem key={repo.id} repo={repo} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

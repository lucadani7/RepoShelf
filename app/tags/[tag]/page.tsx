import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import TagRepos from "@/components/TagRepos";
import { getRepos } from "@/lib/repos";
import { OWNER } from "@/lib/site";
import { countTags, tagHref, tagLabel } from "@/lib/tags";

type Params = Promise<{ tag: string }>;

/** Placeholder used when the shelf has no tags yet (Cache Components needs at least one param) */
const PLACEHOLDER = "__none__";

export async function generateStaticParams() {
  const tags = countTags(await getRepos()).map(({ tag }) => ({ tag }));
  return tags.length > 0 ? tags : [{ tag: PLACEHOLDER }];
}

function decodeTag(raw: string): string {
  try {
    return decodeURIComponent(raw).toLowerCase();
  } catch {
    return raw.toLowerCase();
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const tag = decodeTag((await params).tag);
  return {
    title: `${tagLabel(tag)} projects — RepoShelf`,
    description: `${OWNER.name}'s open-source projects tagged “${tag}”.`,
  };
}

export default function TagPage({ params }: { params: Params }) {
  // The nav, footer and "All tags" link don't depend on the URL, so they show instantly.
  // Everything that reads the tag from the URL streams in behind <Suspense>.
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-6xl px-5">
        <header className="pt-14 sm:pt-20">
          <Link href="/tags" className="text-sm text-link hover:underline">
            ‹ All tags
          </Link>
        </header>
        <Suspense fallback={<TagSkeleton />}>
          <TagContent params={params} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}

async function TagContent({ params }: { params: Params }) {
  const tag = decodeTag((await params).tag);
  const all = await getRepos();
  const repos = all.filter((repo) => repo.tags.includes(tag));
  if (tag === PLACEHOLDER || repos.length === 0) notFound();

  // Other tags that show up alongside this one, for "Related"
  const related = countTags(repos)
    .filter((t) => t.tag !== tag)
    .slice(0, 8);

  return (
    <>
      <div className="pb-10">
        <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
          {tagLabel(tag)}
        </h1>
        <p className="mt-3 text-xl text-muted">
          {repos.length} {repos.length === 1 ? "project" : "projects"} tagged “{tag}”.
        </p>

        {related.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm text-faint">Related</span>
            {related.map(({ tag: other, count }) => (
              <Link
                key={other}
                href={tagHref(other)}
                className="h-8 rounded-full bg-surface px-3.5 text-sm leading-8 text-ink shadow-soft ring-1 ring-ink/5 transition hover:ring-ink/10"
              >
                {tagLabel(other)} <span className="text-faint">{count}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <TagRepos repos={repos} tag={tag} />
    </>
  );
}

/** Placeholder shown for a split second while the tag's projects load */
function TagSkeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse">
      <div className="mt-4 h-14 w-56 rounded-2xl bg-ink/[0.06]" />
      <div className="mt-4 h-6 w-72 rounded-full bg-ink/[0.06]" />
      <div className="mt-12 h-12 w-full max-w-xl rounded-full bg-ink/[0.06]" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-56 rounded-3xl bg-ink/[0.06]" />
        ))}
      </div>
    </div>
  );
}

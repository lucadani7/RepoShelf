import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import TagRepos from "@/components/TagRepos";
import { getRepos } from "@/lib/repos";
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
    title: `${tagLabel(tag)} repos — RepoShelf`,
    description: `Hand-picked GitHub repositories tagged “${tag}”.`,
  };
}

export default async function TagPage({ params }: { params: Params }) {
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
      <SiteNav />
      <main className="mx-auto max-w-6xl px-5">
        <header className="pt-14 pb-10 sm:pt-20">
          <Link href="/tags" className="text-sm text-link hover:underline">
            ‹ All tags
          </Link>
          <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
            {tagLabel(tag)}
          </h1>
          <p className="mt-3 text-xl text-muted">
            {repos.length} {repos.length === 1 ? "repository" : "repositories"} tagged “{tag}”.
          </p>

          {related.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-sm text-faint">Related</span>
              {related.map(({ tag: other, count }) => (
                <Link
                  key={other}
                  href={tagHref(other)}
                  className="h-8 rounded-full bg-white px-3.5 text-sm leading-8 text-ink shadow-soft ring-1 ring-black/5 transition hover:ring-black/10"
                >
                  {tagLabel(other)} <span className="text-faint">{count}</span>
                </Link>
              ))}
            </div>
          )}
        </header>

        <TagRepos repos={repos} tag={tag} />
      </main>
      <SiteFooter />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import { languageColor } from "@/lib/languages";
import { getRepos } from "@/lib/repos";
import { countTags, tagHref, tagLabel } from "@/lib/tags";

export const metadata: Metadata = {
  title: "Tags — RepoShelf",
  description: "Browse my open-source projects by topic.",
};

export default async function TagsPage() {
  const repos = await getRepos();
  const tags = countTags(repos);

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-6xl px-5">
        <header className="pt-14 pb-10 sm:pt-20">
          <h1 className="font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl">Tags</h1>
          <p className="mt-3 text-xl text-muted">Browse my projects by topic.</p>
        </header>

        {tags.length === 0 ? (
          <p className="rounded-3xl bg-surface py-20 text-center text-lg text-muted shadow-soft">No tags yet.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tags.map(({ tag, count }) => {
              // The languages used in this tag, most common first
              const languages = countTags(
                repos.filter((r) => r.tags.includes(tag) && r.language).map((r) => ({ tags: [r.language as string] })),
              ).slice(0, 4);
              return (
                <li key={tag}>
                  <Link
                    href={tagHref(tag)}
                    className="flex items-center justify-between gap-4 rounded-3xl bg-surface p-6 shadow-soft transition duration-300 ease-out hover:-translate-y-1 hover:shadow-lifted"
                  >
                    <div>
                      <p className="font-display text-2xl font-semibold tracking-tight text-ink">{tagLabel(tag)}</p>
                      <p className="mt-1 text-sm text-muted">
                        {count} {count === 1 ? "project" : "projects"}
                      </p>
                    </div>
                    <ul className="flex shrink-0 flex-col items-end gap-1 text-xs text-muted">
                      {languages.map(({ tag: language }) => (
                        <li key={language} className="flex items-center gap-1.5">
                          {language}
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: languageColor(language) }}
                          />
                        </li>
                      ))}
                    </ul>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

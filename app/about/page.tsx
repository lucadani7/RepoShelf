import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import { getRepos } from "@/lib/repos";
import { OWNER } from "@/lib/site";
import { countTags } from "@/lib/tags";


export const metadata: Metadata = {
  title: "About — RepoShelf",
  description: "What RepoShelf is, and who's behind it.",
};

export default async function AboutPage() {
  const repos = await getRepos();
  const tags = countTags(repos);
  const languages = new Set(repos.map((r) => r.language).filter(Boolean));

  const stats = [
    { value: repos.length, label: repos.length === 1 ? "repository" : "repositories" },
    { value: tags.length, label: tags.length === 1 ? "tag" : "tags" },
    { value: languages.size, label: languages.size === 1 ? "language" : "languages" },
  ];

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-3xl px-5">
        <header className="pt-14 pb-12 sm:pt-20">
          <h1 className="font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl">About</h1>
          <p className="mt-5 text-2xl leading-snug text-ink-2">
            RepoShelf is a small, hand-picked collection of GitHub repositories worth knowing about.
          </p>
        </header>

        <dl className="grid grid-cols-3 gap-4">
          {stats.map(({ value, label }) => (
            <div key={label} className="rounded-3xl bg-white p-6 text-center shadow-soft">
              <dt className="sr-only">{label}</dt>
              <dd>
                <span className="block font-display text-4xl font-semibold tracking-tight text-ink">{value}</span>
                <span className="mt-1 block text-sm text-muted">{label}</span>
              </dd>
            </div>
          ))}
        </dl>

        <section className="mt-12 space-y-5 text-lg leading-relaxed text-ink-2">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">Why it exists</h2>
          <p>
            Stars and bookmarks pile up and get lost. RepoShelf is the opposite: a short list, chosen by hand, where
            every repo is here for a reason. Many come with a note on why they&apos;re worth a look.
          </p>
          <p>
            Details like stars, descriptions and languages come straight from GitHub and are refreshed every day, so
            what you see stays current.
          </p>
        </section>

        <section className="mt-12 rounded-3xl bg-white p-8 shadow-soft">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">Who&apos;s behind it</h2>
          <p className="mt-1 text-muted">{OWNER.name}</p>
          <p className="mt-4 text-lg leading-relaxed text-ink-2">{OWNER.bio}</p>
          {OWNER.githubUrl && (
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={OWNER.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center rounded-full bg-accent px-6 text-[15px] font-medium text-white shadow-soft transition hover:bg-accent-hover"
              >
                {OWNER.name} on GitHub
              </a>
            </div>
          )}
        </section>

        <p className="mt-12 text-center">
          <Link href="/" className="text-lg text-link hover:underline">
            Browse the shelf ›
          </Link>
        </p>
      </main>
      <SiteFooter />
    </>
  );
}

import { compactNumber, languageColor } from "@/lib/languages";
import type { Repo } from "@/lib/types";

/** The big highlight card at the top of the page. */
export default function FeaturedCard({ repo }: { repo: Repo }) {
  const color = languageColor(repo.language);

  return (
    <article
      className="relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-soft sm:p-12"
      // Soft tint taken from the repo's language color
      style={{ backgroundImage: `radial-gradient(120% 120% at 100% 0%, ${color}2e 0%, transparent 55%)` }}
    >
      <p className="text-xs font-semibold tracking-[0.12em] text-accent uppercase">Featured · Newest on the shelf</p>

      <div className="mt-6 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <div className="flex items-center gap-4">
            {repo.avatarUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`${repo.avatarUrl}${repo.avatarUrl.includes("?") ? "&" : "?"}s=160`}
                alt=""
                width={64}
                height={64}
                className="h-16 w-16 rounded-2xl shadow-soft ring-1 ring-black/5"
              />
            )}
            <div className="min-w-0">
              <h2 className="truncate font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                {repo.name}
              </h2>
              <p className="mt-1 text-muted">{repo.owner}</p>
            </div>
          </div>

          {repo.description && <p className="mt-6 text-xl leading-relaxed text-ink-2">{repo.description}</p>}
          {repo.note && <p className="mt-4 text-[15px] leading-relaxed text-muted">“{repo.note}”</p>}

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
            {repo.framework && (
              <span className="rounded-full bg-accent/10 px-3 py-1 font-medium text-accent">{repo.framework}</span>
            )}
            {repo.language && (
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                {repo.language}
              </span>
            )}
            <span>★ {compactNumber.format(repo.stars)} stars</span>
            <span>⑂ {compactNumber.format(repo.forks)} forks</span>
          </div>
        </div>

        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 shrink-0 items-center self-start rounded-full bg-accent px-6 text-[15px] font-medium text-white shadow-soft transition hover:bg-accent-hover sm:self-auto"
        >
          View on GitHub
        </a>
      </div>
    </article>
  );
}

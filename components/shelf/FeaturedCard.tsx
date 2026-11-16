import RepoAvatar from "@/components/RepoAvatar";
import { compactNumber, languageColor } from "@/lib/languages";
import type { Repo } from "@/lib/types";

const monthYear = new Intl.DateTimeFormat("en", { month: "short", year: "numeric", timeZone: "UTC" });

/** The big highlight card at the top of the page. */
export default function FeaturedCard({ repo }: { repo: Repo }) {
  const color = languageColor(repo.language);

  return (
    <article
      className="relative overflow-hidden rounded-[2rem] bg-surface p-6 shadow-soft sm:p-12"
      // Soft tint taken from the repo's language color
      style={{ backgroundImage: `radial-gradient(120% 120% at 100% 0%, ${color}2e 0%, transparent 55%)` }}
    >
      <p className="text-xs font-semibold tracking-[0.12em] text-accent uppercase">Featured project</p>

      <div className="mt-6 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <div className="flex items-center gap-4">
            <RepoAvatar repo={repo} size={64} className="shadow-soft" />
            <div className="min-w-0">
              <h2 className="font-display text-3xl leading-tight font-semibold tracking-tight [overflow-wrap:anywhere] text-ink sm:text-5xl">
                {repo.name}
              </h2>
              <p className="mt-1 text-muted">{repo.owner}</p>
            </div>
          </div>

          {repo.description && <p className="mt-6 text-lg leading-relaxed text-ink-2 sm:text-xl">{repo.description}</p>}
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
            {repo.stars > 0 && <span>★ {compactNumber.format(repo.stars)} stars</span>}
            {repo.forks > 0 && <span>⑂ {compactNumber.format(repo.forks)} forks</span>}
            {repo.updatedAt && <span>Updated {monthYear.format(new Date(repo.updatedAt))}</span>}
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

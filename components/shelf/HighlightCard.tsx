import RepoAvatar from "@/components/RepoAvatar";
import { compactNumber, languageColor } from "@/lib/languages";
import type { Repo } from "@/lib/types";

/** A larger card for the "Highlights" row at the top of the home page. */
export default function HighlightCard({ repo, large = false }: { repo: Repo; large?: boolean }) {
  const color = languageColor(repo.language);

  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-surface shadow-soft transition duration-300 ease-out hover:-translate-y-1 hover:shadow-lifted ${
        large ? "p-7 sm:p-10" : "p-6 sm:p-7"
      }`}
      // Soft tint taken from the project's language color
      style={{ backgroundImage: `radial-gradient(120% 120% at 100% 0%, ${color}2e 0%, transparent 55%)` }}
    >
      <div className="flex items-center gap-4">
        <RepoAvatar repo={repo} size={large ? 64 : 52} className="shadow-soft" />
        <div className="min-w-0">
          <h3
            className={`font-display leading-tight font-semibold tracking-tight [overflow-wrap:anywhere] text-ink ${
              large ? "text-3xl sm:text-4xl" : "text-2xl"
            }`}
          >
            {repo.name}
          </h3>
          <p className="mt-0.5 text-sm text-muted">{repo.owner}</p>
        </div>
      </div>

      {repo.description && (
        <p
          className={`mt-5 leading-relaxed text-ink-2 ${large ? "line-clamp-4 text-lg" : "line-clamp-3 text-[15px]"}`}
        >
          {repo.description}
        </p>
      )}
      {repo.note && <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">“{repo.note}”</p>}

      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-6 text-sm text-muted">
        {repo.frameworks.map((name) => (
          <span key={name} className="rounded-full bg-accent/10 px-3 py-1 font-medium text-accent">
            {name}
          </span>
        ))}
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            {repo.language}
          </span>
        )}
        {repo.stars > 0 && <span>★ {compactNumber.format(repo.stars)}</span>}
        <span className="ml-auto text-link transition group-hover:translate-x-0.5" aria-hidden="true">
          View on GitHub ›
        </span>
      </div>
    </a>
  );
}

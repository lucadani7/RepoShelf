import { compactNumber as compact, languageColor } from "@/lib/languages";
import type { Repo } from "@/lib/types";

/** How many GitHub topics to show before collapsing into "+N" */
const MAX_TOPICS = 4;

const monthYear = new Intl.DateTimeFormat("en", { month: "short", year: "numeric", timeZone: "UTC" });

type Props = {
  repo: Repo;
  activeTag: string | null;
  onTagClick: (tag: string) => void;
};

export default function RepoCard({ repo, activeTag, onTagClick }: Props) {
  return (
    <article className="group relative flex flex-col rounded-3xl bg-surface p-6 shadow-soft transition duration-300 ease-out hover:-translate-y-1 hover:shadow-lifted">
      <header className="flex items-start gap-3.5">
        {repo.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`${repo.avatarUrl}${repo.avatarUrl.includes("?") ? "&" : "?"}s=96`}
            alt=""
            width={44}
            height={44}
            loading="lazy"
            className="h-11 w-11 shrink-0 rounded-xl ring-1 ring-ink/5"
          />
        ) : (
          <div className="h-11 w-11 shrink-0 rounded-xl bg-canvas" />
        )}
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg leading-tight font-semibold text-ink">
            {/* The ::after makes the whole card clickable */}
            <a href={repo.url} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0">
              {repo.name}
            </a>
          </h2>
          <p className="mt-0.5 truncate text-sm text-muted">{repo.owner}</p>
        </div>
        {repo.archived && (
          <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-400/15 dark:text-amber-300">
            Archived
          </span>
        )}
      </header>

      <p className="mt-4 line-clamp-3 text-[15px] leading-relaxed text-ink-2">
        {repo.description ?? <span className="text-faint">No description</span>}
      </p>

      {repo.note && (
        <p className="mt-4 rounded-2xl bg-canvas px-4 py-3 text-sm leading-relaxed text-muted">{repo.note}</p>
      )}

      {(repo.tags.length > 0 || repo.topics.length > 0) && (
        <div className="relative z-10 mt-4 flex flex-wrap items-center gap-1.5">
          {repo.tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onTagClick(tag)}
              className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                activeTag === tag ? "bg-ink text-canvas" : "bg-canvas text-ink-2 hover:bg-ink/[0.07]"
              }`}
            >
              {tag}
            </button>
          ))}
          {repo.topics.slice(0, MAX_TOPICS).map((topic) => (
            <a
              key={topic}
              href={`https://github.com/topics/${topic}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-1 text-xs text-link hover:underline"
            >
              {topic}
            </a>
          ))}
          {repo.topics.length > MAX_TOPICS && (
            <span className="px-1 text-xs text-faint">+{repo.topics.length - MAX_TOPICS}</span>
          )}
        </div>
      )}

      <footer className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-6 text-xs text-muted">
        {repo.framework && (
          <span className="rounded-full bg-accent/10 px-2.5 py-1 font-medium text-accent">{repo.framework}</span>
        )}
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: languageColor(repo.language) }}
            />
            {repo.language}
          </span>
        )}
        <span title={`${repo.stars.toLocaleString("en")} stars`}>★ {compact.format(repo.stars)}</span>
        <span title={`${repo.forks.toLocaleString("en")} forks`}>⑂ {compact.format(repo.forks)}</span>
        {repo.updatedAt && (
          <span className="ml-auto text-faint">Updated {monthYear.format(new Date(repo.updatedAt))}</span>
        )}
      </footer>
    </article>
  );
}

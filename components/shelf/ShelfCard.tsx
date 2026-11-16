import { compactNumber, languageColor } from "@/lib/languages";
import type { Repo } from "@/lib/types";

/** Compact card used inside a horizontal shelf. */
export default function ShelfCard({ repo }: { repo: Repo }) {
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full w-[17.5rem] shrink-0 snap-start flex-col rounded-3xl bg-white p-5 shadow-soft transition duration-300 ease-out hover:-translate-y-1 hover:shadow-lifted sm:w-[19rem]"
    >
      <div className="flex items-center gap-3">
        {repo.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`${repo.avatarUrl}${repo.avatarUrl.includes("?") ? "&" : "?"}s=96`}
            alt=""
            width={48}
            height={48}
            loading="lazy"
            className="h-12 w-12 shrink-0 rounded-2xl ring-1 ring-black/5"
          />
        ) : (
          <div className="h-12 w-12 shrink-0 rounded-2xl bg-canvas" />
        )}
        <div className="min-w-0">
          <p className="truncate font-semibold text-ink">{repo.name}</p>
          <p className="truncate text-sm text-muted">{repo.owner}</p>
        </div>
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-ink-2">
        {repo.description ?? <span className="text-faint">No description</span>}
      </p>

      <div className="mt-auto flex items-center gap-3 pt-4 text-xs text-muted">
        {repo.framework && (
          <span className="rounded-full bg-accent/10 px-2 py-0.5 font-medium text-accent">{repo.framework}</span>
        )}
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: languageColor(repo.language) }} />
            {repo.language}
          </span>
        )}
        <span className="ml-auto">★ {compactNumber.format(repo.stars)}</span>
      </div>
    </a>
  );
}

import { languageColor } from "@/lib/languages";
import { OWNER_LOGIN } from "@/lib/site";
import type { Repo } from "@/lib/types";

/** "ChuckNorrisReact" → "CN", "word-counter" → "WC", "pnpm" → "PN" */
function initials(name: string): string {
  const words = name
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[\s_.-]+/)
    .filter(Boolean);
  const letters = words.length > 1 ? words[0][0] + words[1][0] : name.slice(0, 2);
  return letters.toUpperCase();
}

type Props = {
  repo: Pick<Repo, "name" | "owner" | "avatarUrl" | "language">;
  /** Rendered size in px */
  size: number;
  className?: string;
};

/**
 * Your own repos get a monogram tinted with the language color (the same photo
 * on every card says nothing). Other people's repos show their owner's avatar.
 */
export default function RepoAvatar({ repo, size, className = "" }: Props) {
  const own = OWNER_LOGIN !== "" && repo.owner.toLowerCase() === OWNER_LOGIN;
  const radius = size >= 48 ? "rounded-2xl" : size >= 36 ? "rounded-xl" : "rounded-lg";
  const base = `shrink-0 ring-1 ring-ink/5 ${radius} ${className}`;

  if (!own && repo.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`${repo.avatarUrl}${repo.avatarUrl.includes("?") ? "&" : "?"}s=${size * 2}`}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        className={base}
        style={{ width: size, height: size }}
      />
    );
  }

  const color = languageColor(repo.language);
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center font-display font-semibold tracking-tight text-ink ${base}`}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.38),
        // Tint from the language color, readable in light and dark mode
        background: `linear-gradient(135deg, ${color}40, ${color}1a)`,
      }}
    >
      {initials(repo.name)}
    </div>
  );
}

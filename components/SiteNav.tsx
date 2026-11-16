"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

type Props = {
  /** On the home page these scroll instead of navigating */
  onBrowse?: () => void;
  onSearch?: () => void;
};

const SEARCH_ICON = (
  <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
    <circle cx="8.5" cy="8.5" r="6" className="fill-none stroke-current" strokeWidth="1.8" />
    <path d="M13 13l4.5 4.5" className="stroke-current" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export default function SiteNav({ onBrowse, onSearch }: Props) {
  const pathname = usePathname();
  const linkClass = (href: string) =>
    `transition hover:text-ink ${pathname === href || pathname.startsWith(`${href}/`) ? "text-ink" : ""}`;

  return (
    <nav className="sticky top-0 z-50 border-b border-ink/5 bg-canvas/75 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-5 text-sm">
        <Link href="/" className="font-semibold tracking-tight text-ink">
          RepoShelf
        </Link>
        <div className="flex items-center gap-4 text-ink-2 sm:gap-6">
          {onBrowse ? (
            <button type="button" onClick={onBrowse} className="hidden transition hover:text-ink sm:inline">
              Browse
            </button>
          ) : (
            <Link href="/#browse" className="hidden transition hover:text-ink sm:inline">
              Browse
            </Link>
          )}
          <Link href="/tags" className={linkClass("/tags")}>
            Tags
          </Link>
          <Link href="/about" className={linkClass("/about")}>
            About
          </Link>
          <Link href="/admin" className={linkClass("/admin")}>
            Admin
          </Link>
          {onSearch ? (
            <button type="button" onClick={onSearch} aria-label="Search" className="transition hover:text-ink">
              {SEARCH_ICON}
            </button>
          ) : (
            <Link href="/#browse" aria-label="Search" className="transition hover:text-ink">
              {SEARCH_ICON}
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

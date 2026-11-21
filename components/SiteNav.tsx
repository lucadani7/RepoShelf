"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/tags", label: "Tags" },
  { href: "/about", label: "About" },
  { href: "/admin", label: "Admin" },
];

/** Same three books on a shelf as app/icon.svg */
function Logo() {
  return (
    <svg viewBox="0 0 64 64" className="h-8 w-8 shrink-0" aria-hidden="true">
      <rect width="64" height="64" rx="15" className="fill-accent" />
      <rect x="15" y="17" width="8" height="26" rx="2" fill="#fff" />
      <rect x="26" y="13" width="8" height="30" rx="2" fill="#fff" fillOpacity="0.85" />
      <rect x="37.5" y="18.5" width="8" height="25" rx="2" fill="#fff" fillOpacity="0.7" transform="rotate(12 41.5 31)" />
      <rect x="12" y="45" width="40" height="5" rx="2.5" fill="#fff" />
    </svg>
  );
}

export default function SiteNav() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    // A floating "glass" bar that stays at the top while you scroll
    <div className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
      <nav
        aria-label="Main"
        className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 rounded-full bg-surface/75 pr-2 pl-2.5 shadow-soft ring-1 ring-ink/10 backdrop-blur-xl backdrop-saturate-150 sm:pl-3"
      >
        <Link href="/" className="flex shrink-0 items-center gap-2.5 rounded-full pr-2 text-ink" aria-label="RepoShelf home">
          <Logo />
          {/* Name hidden on the smallest phones so all links fit */}
          <span className="hidden font-display text-[17px] font-semibold tracking-tight min-[400px]:inline">
            RepoShelf
          </span>
        </Link>

        <div className="flex items-center gap-0.5 sm:gap-1">
          {LINKS.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex h-9 items-center rounded-full px-2.5 text-sm font-medium transition sm:px-4 sm:text-[15px] ${
                  active ? "bg-ink text-canvas" : "text-ink-2 hover:bg-ink/[0.07] hover:text-ink"
                }`}
              >
                {label}
              </Link>
            );
          })}

          <span className="mx-1 hidden h-5 w-px bg-ink/10 sm:block" aria-hidden="true" />

          {/* On phones the search lives on /projects itself, so the icon is hidden to save space */}
          <Link
            href="/projects#search"
            aria-label="Search projects"
            title="Search projects"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-ink-2 transition hover:bg-ink/[0.07] hover:text-ink sm:flex"
          >
            <svg viewBox="0 0 20 20" className="h-[18px] w-[18px]" aria-hidden="true">
              <circle cx="8.5" cy="8.5" r="6" className="fill-none stroke-current" strokeWidth="1.8" />
              <path d="M13 13l4.5 4.5" className="stroke-current" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}

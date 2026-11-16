"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Repo } from "@/lib/types";
import ShelfCard from "./ShelfCard";

type Props = {
  title: string;
  repos: Repo[];
  seeAllHref?: string;
};

/** A titled, horizontally scrolling row of repos (App Store style). */
export default function Shelf({ title, repos, seeAllHref }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });

  // Show the arrows only when there's something to scroll to
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const update = () =>
      setCanScroll({
        left: row.scrollLeft > 4,
        right: row.scrollLeft + row.clientWidth < row.scrollWidth - 4,
      });
    update();
    row.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(row);
    return () => {
      row.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [repos]);

  const scroll = (direction: 1 | -1) => {
    const row = rowRef.current;
    if (row) row.scrollBy({ left: direction * row.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section className="mt-12">
      <div className="mb-4 flex items-end justify-between gap-4 border-t border-ink/10 pt-4">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">{title}</h2>
        <div className="flex items-center gap-2">
          {seeAllHref && (
            <Link href={seeAllHref} className="mr-2 text-[15px] text-link hover:underline">
              See all
            </Link>
          )}
          {(canScroll.left || canScroll.right) && (
            <>
              <ArrowButton
                label={`Scroll ${title} left`}
                onClick={() => scroll(-1)}
                direction="left"
                disabled={!canScroll.left}
              />
              <ArrowButton
                label={`Scroll ${title} right`}
                onClick={() => scroll(1)}
                direction="right"
                disabled={!canScroll.right}
              />
            </>
          )}
        </div>
      </div>

      {/* Negative margin + padding lets shadows breathe without being clipped */}
      <div
        ref={rowRef}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pt-2 pb-8"
      >
        {repos.map((repo) => (
          <ShelfCard key={repo.id} repo={repo} />
        ))}
      </div>
    </section>
  );
}

function ArrowButton({
  label,
  onClick,
  direction,
  disabled,
}: {
  label: string;
  onClick: () => void;
  direction: "left" | "right";
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="hidden h-8 w-8 items-center justify-center rounded-full bg-surface text-ink shadow-soft ring-1 ring-ink/5 transition hover:ring-ink/15 disabled:opacity-35 disabled:hover:ring-ink/5 sm:flex"
    >
      <svg viewBox="0 0 8 12" className="h-3 w-3" aria-hidden="true">
        <path
          d={direction === "left" ? "M6.5 1L1.5 6l5 5" : "M1.5 1l5 5-5 5"}
          className="fill-none stroke-current"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY, type ThemePreference } from "@/lib/theme";

const ORDER: ThemePreference[] = ["system", "light", "dark"];
const LABELS: Record<ThemePreference, string> = {
  system: "Theme: automatic (follows your device)",
  light: "Theme: light",
  dark: "Theme: dark",
};

function readPreference(): ThemePreference {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === "light" || saved === "dark" ? saved : "system";
  } catch {
    return "system";
  }
}

function applyTheme(preference: ThemePreference) {
  const dark =
    preference === "dark" ||
    (preference === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}

// True only after hydration, so the server and first client render agree
const subscribeNoop = () => () => {};
function useHydrated() {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}

/** Cycles automatic → light → dark. Remembered in this browser. */
export default function ThemeToggle() {
  const hydrated = useHydrated();
  const [preference, setPreference] = useState<ThemePreference>(() =>
    typeof window === "undefined" ? "system" : readPreference(),
  );

  // While on "automatic", follow the device when it switches (e.g. at sunset)
  useEffect(() => {
    if (preference !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [preference]);

  const cycle = () => {
    const next = ORDER[(ORDER.indexOf(preference) + 1) % ORDER.length];
    setPreference(next);
    try {
      if (next === "system") localStorage.removeItem(THEME_STORAGE_KEY);
      else localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // storage unavailable (private mode) — the choice still applies to this visit
    }
    applyTheme(next);
  };

  const shown = hydrated ? preference : "system";

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={LABELS[shown]}
      title={LABELS[shown]}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-2 transition hover:bg-ink/[0.07] hover:text-ink"
    >
      <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
        {shown === "light" && (
          <>
            <circle cx="10" cy="10" r="3.5" className="fill-none stroke-current" strokeWidth="1.6" />
            <path
              d="M10 1.5v2M10 16.5v2M18.5 10h-2M3.5 10h-2M16 4l-1.4 1.4M5.4 14.6L4 16M16 16l-1.4-1.4M5.4 5.4L4 4"
              className="stroke-current"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </>
        )}
        {shown === "dark" && (
          <path
            d="M16.5 12.2A7 7 0 0 1 7.8 3.5a7 7 0 1 0 8.7 8.7z"
            className="fill-none stroke-current"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        )}
        {shown === "system" && (
          <>
            <circle cx="10" cy="10" r="7" className="fill-none stroke-current" strokeWidth="1.6" />
            <path d="M10 3a7 7 0 0 1 0 14z" className="fill-current" />
          </>
        )}
      </svg>
    </button>
  );
}

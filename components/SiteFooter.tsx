import { OWNER } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="mx-auto mt-24 max-w-6xl border-t border-ink/10 px-5 pt-6 pb-12 text-xs text-faint">
      {/* All links (About, Admin…) live in the navigation bar at the top */}
      <p>© {OWNER.name} · Repo data from GitHub</p>
    </footer>
  );
}

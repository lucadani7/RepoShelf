import Link from "next/link";
import { OWNER } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="mx-auto mt-24 flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-ink/10 px-5 pt-6 pb-12 text-xs text-faint">
      <p>
        © {OWNER.name} · Repo data from GitHub
      </p>
      <div className="flex gap-4">
        <Link href="/about" className="hover:text-ink">
          About
        </Link>
        <Link href="/admin" className="hover:text-ink">
          Admin
        </Link>
      </div>
    </footer>
  );
}

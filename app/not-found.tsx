import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";

export default function NotFound() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-3xl px-5 py-32 text-center">
        <p className="text-sm font-medium text-muted">404</p>
        <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight text-ink">Not on the shelf.</h1>
        <p className="mt-4 text-xl text-muted">The page you&apos;re looking for doesn&apos;t exist, or was removed.</p>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center rounded-full bg-accent px-6 text-[15px] font-medium text-white shadow-soft transition hover:bg-accent-hover"
        >
          Back to RepoShelf
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}

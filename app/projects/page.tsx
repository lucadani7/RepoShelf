import type { Metadata } from "next";
import ProjectsView from "@/components/ProjectsView";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import { getRepos } from "@/lib/repos";
import { OWNER } from "@/lib/site";

export const metadata: Metadata = {
  title: "All projects — RepoShelf",
  description: `Every open-source project by ${OWNER.name}: search and filter by topic, framework or language.`,
};

export default async function ProjectsPage() {
  const repos = await getRepos();

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-6xl px-5">
        <header className="pt-14 pb-10 sm:pt-20">
          <h1 className="font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl">All projects</h1>
          <p className="mt-3 text-xl text-muted">
            {repos.length} {repos.length === 1 ? "project" : "projects"}. Search, or filter by topic and framework.
          </p>
        </header>

        {repos.length === 0 ? (
          <p className="rounded-3xl bg-surface py-20 text-center text-lg text-muted shadow-soft">No projects here yet.</p>
        ) : (
          <ProjectsView repos={repos} />
        )}
      </main>
      <SiteFooter />
    </>
  );
}

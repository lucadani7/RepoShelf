import ShelfPage from "@/components/shelf/ShelfPage";
import { getRepos } from "@/lib/repos";

export default async function HomePage() {
  // Cached (see lib/repos.ts), so this page is served from the static shell
  const repos = await getRepos();
  return <ShelfPage repos={repos} />;
}

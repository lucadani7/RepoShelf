/** Tags written in capitals in titles */
const ACRONYMS = new Set(["ai", "api", "cli", "cms", "css", "db", "html", "js", "ml", "orm", "sdk", "sql", "ts", "ui", "ux"]);

/** "cli" → "CLI", "web" → "Web" */
export function tagLabel(tag: string): string {
  return ACRONYMS.has(tag) ? tag.toUpperCase() : tag.charAt(0).toUpperCase() + tag.slice(1);
}

export function tagHref(tag: string): string {
  return `/tags/${encodeURIComponent(tag)}`;
}

/** Tags with how many repos use each, most used first */
export function countTags(repos: { tags: string[] }[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const repo of repos) for (const tag of repo.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

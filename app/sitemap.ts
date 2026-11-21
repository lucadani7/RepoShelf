import type { MetadataRoute } from "next";
import { getRepos } from "@/lib/repos";
import { SITE_URL } from "@/lib/site";
import { countTags, tagHref } from "@/lib/tags";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const repos = await getRepos();
  // Newest addition = when the shelf last changed
  const lastModified = repos[0] ? new Date(repos[0].addedAt) : undefined;

  return [
    { url: SITE_URL, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/projects`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/tags`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    ...countTags(repos).map(({ tag }) => ({
      url: `${SITE_URL}${tagHref(tag)}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}

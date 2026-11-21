/**
 * The frameworks you can pick in /admin, grouped for the picker.
 * To offer a new one, add it here (it appears in the admin form right away).
 */
export const FRAMEWORK_GROUPS = [
  {
    label: "Frontend",
    items: ["React", "Next.js", "Vue", "Nuxt", "Angular", "Svelte", "SvelteKit", "Astro", "Remix", "Solid", "Vite", "Tailwind CSS"],
  },
  {
    label: "Backend",
    items: ["Node.js", "Express", "NestJS", "Fastify", "Hono", "Django", "Flask", "FastAPI", "Spring Boot", "Laravel", "Ruby on Rails", "ASP.NET Core", "Gin", "Fiber", "Phoenix"],
  },
  { label: "Mobile", items: ["React Native", "Expo", "Flutter", "SwiftUI", "Jetpack Compose"] },
  { label: "Desktop", items: ["Electron", "Tauri"] },
  { label: "Data & ML", items: ["pandas", "scikit-learn", "PyTorch", "TensorFlow", "Jupyter"] },
] as const;

export const ALL_FRAMEWORKS: readonly string[] = FRAMEWORK_GROUPS.flatMap((g) => g.items);

/** Spellings people actually type, mapped to the names above */
const ALIASES: Record<string, string> = {
  nextjs: "Next.js",
  next: "Next.js",
  reactjs: "React",
  vuejs: "Vue",
  nuxtjs: "Nuxt",
  angularjs: "Angular",
  node: "Node.js",
  nodejs: "Node.js",
  expressjs: "Express",
  nestjs: "NestJS",
  springboot: "Spring Boot",
  spring: "Spring Boot",
  rails: "Ruby on Rails",
  rubyonrails: "Ruby on Rails",
  aspnet: "ASP.NET Core",
  aspnetcore: "ASP.NET Core",
  tailwind: "Tailwind CSS",
  tailwindcss: "Tailwind CSS",
  sklearn: "scikit-learn",
  scikitlearn: "scikit-learn",
  torch: "PyTorch",
  reactnative: "React Native",
};

const BY_KEY = new Map(ALL_FRAMEWORKS.map((name) => [key(name), name]));

function key(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** "NextJS" → "Next.js"; unknown names are kept as written */
export function normalizeFramework(name: string): string {
  const k = key(name);
  return BY_KEY.get(k) ?? ALIASES[k] ?? name.trim();
}

/** Turns an old free-text value like "FastAPI + NextJS" into ["FastAPI", "Next.js"] */
export function parseLegacyFrameworks(value: string | null): string[] {
  if (!value) return [];
  const names = value
    .split(/\s*(?:\+|,|\/|&|\band\b)\s*/i)
    .map((part) => part.trim())
    .filter(Boolean)
    .map(normalizeFramework);
  return [...new Set(names)];
}

/** Keeps only names from the list (in the list's order), dropping duplicates */
export function cleanFrameworks(values: string[]): string[] {
  const picked = new Set(values.map(normalizeFramework));
  return ALL_FRAMEWORKS.filter((name) => picked.has(name));
}

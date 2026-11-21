/** Who's behind RepoShelf. Edit here; it's used across the site. */
export const OWNER = {
  name: "Luca Daniel Ionescu",
  /** Your GitHub profile, e.g. "https://github.com/your-username". Leave empty to hide the button. */
  githubUrl: "https://github.com/lucadani7",
  bio: "I'm Luca, a developer who enjoys building across languages and stacks — web apps with Next.js and React, command-line tools in Go, Java, Python and Haskell, and the occasional machine-learning project.",
};

/** One-line description used on the home page, in link previews and search results */
export const TAGLINE = "Open-source projects I've built, from web apps to command-line tools.";

/** How many projects "Highlights" shows on the home page */
export const MAX_HIGHLIGHTS = 6;

/** Public address of the site (used for sitemap, robots and link previews) */
export const SITE_URL = "https://reposhelf.getastrobyte.com";

/** Your GitHub username, taken from githubUrl ("lucadani7") */
export const OWNER_LOGIN = OWNER.githubUrl.replace(/\/+$/, "").split("/").pop()?.toLowerCase() ?? "";

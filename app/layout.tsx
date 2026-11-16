import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SITE_URL } from "@/lib/site";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "RepoShelf — curated GitHub repositories",
  description: "A hand-picked shelf of GitHub repositories worth knowing about.",
  openGraph: {
    title: "RepoShelf",
    description: "A hand-picked shelf of GitHub repositories worth knowing about.",
    url: "/",
    siteName: "RepoShelf",
    type: "website",
  },
  // The site has its own light and dark designs; tells the Dark Reader extension not to restyle it
  other: { "darkreader-lock": "true" },
};

export const viewport: Viewport = {
  // Browser UI (e.g. Safari's address bar) matches the page background
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f7" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // suppressHydrationWarning: the theme script and browser extensions (e.g. Scribe)
    // set attributes on <html>/<body> before React loads
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

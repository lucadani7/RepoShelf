import type { Metadata } from "next";
import "./globals.css";
import React from "react";

export const metadata: Metadata = {
  metadataBase: new URL("https://reposhelf.getastrobyte.com"),
  title: "RepoShelf — curated GitHub repositories",
  description: "A hand-picked shelf of GitHub repositories worth knowing about.",
  openGraph: {
    title: "RepoShelf",
    description: "A hand-picked shelf of GitHub repositories worth knowing about.",
    url: "/",
    siteName: "RepoShelf",
    type: "website",
  },
  // The site has its own color design; tells the Dark Reader extension not to restyle it
  other: { "darkreader-lock": "true" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      // suppressHydrationWarning: browser extensions (e.g. Scribe) add attributes here
      <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
      </html>
  );
}

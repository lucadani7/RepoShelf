/** A repo as shown on the site (safe to send to the browser). */
export type Repo = {
  id: string;
  fullName: string;
  owner: string;
  name: string;
  url: string;
  note: string | null;
  framework: string | null;
  tags: string[];
  /** Picked by the owner for the big card on the home page */
  featured: boolean;
  description: string | null;
  homepage: string | null;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  avatarUrl: string | null;
  archived: boolean;
  /** ISO date of the last push on GitHub */
  updatedAt: string | null;
  /** ISO date it was added to the shelf */
  addedAt: string;
};

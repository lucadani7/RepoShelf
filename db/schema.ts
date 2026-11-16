import { boolean, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/* ─── RepoShelf ───────────────────────────────────────────── */

export const repo = pgTable("repo", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** "owner/name", exactly as GitHub spells it */
  fullName: text("full_name").notNull().unique(),
  owner: text("owner").notNull(),
  name: text("name").notNull(),

  // Your own fields
  note: text("note"),
  framework: text("framework"),
  tags: text("tags").array().notNull().default([]),

  // Copied from GitHub, refreshed periodically
  description: text("description"),
  homepage: text("homepage"),
  stars: integer("stars").notNull().default(0),
  forks: integer("forks").notNull().default(0),
  language: text("language"),
  topics: text("topics").array().notNull().default([]),
  avatarUrl: text("avatar_url"),
  archived: boolean("archived").notNull().default(false),
  pushedAt: timestamp("pushed_at"),
  syncedAt: timestamp("synced_at").notNull().defaultNow(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ─── Better Auth (login) ─────────────────────────────────── */

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  /** GitHub username, used to decide who is the admin */
  githubLogin: text("github_login"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

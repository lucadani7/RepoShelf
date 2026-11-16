import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import * as schema from "@/db/schema";

/** True only for the GitHub account in ADMIN_GITHUB_USERNAME. */
export function isAdminLogin(login: string | null | undefined): boolean {
  const admin = process.env.ADMIN_GITHUB_USERNAME?.trim().toLowerCase();
  return Boolean(admin && login && login.toLowerCase() === admin);
}

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      // Store the GitHub username so we can tell who the admin is
      mapProfileToUser: (profile) => ({ githubLogin: profile.login }),
    },
  },

  user: {
    additionalFields: {
      // input: true is needed so the value from GitHub (mapProfileToUser above)
      // is kept on sign-up. Updates to it are blocked in databaseHooks below.
      githubLogin: { type: "string", required: false, input: true },
    },
  },

  databaseHooks: {
    user: {
      create: {
        // Only the admin can ever get an account. Anyone else who tries
        // "Sign in with GitHub" is turned away and nothing is stored.
        before: async (newUser) => {
          const login = (newUser as { githubLogin?: string | null }).githubLogin;
          if (!isAdminLogin(login)) return false;
          return { data: newUser };
        },
      },
      update: {
        // The GitHub username is set once at sign-up and never changed
        // afterwards (e.g. through Better Auth's update-user endpoint).
        before: async (data) => ({ data: { ...data, githubLogin: undefined } }),
      },
    },
  },

  // Lets server actions set auth cookies
  plugins: [nextCookies()],
});

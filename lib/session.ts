import { headers } from "next/headers";
import { auth, isAdminLogin } from "./auth";

export type SessionUser = {
  name: string;
  image: string | null;
  githubLogin: string | null;
  isAdmin: boolean;
};

/** The signed-in user, or null. Reads cookies, so call it inside <Suspense>. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const githubLogin = session.user.githubLogin ?? null;
  return {
    name: session.user.name,
    image: session.user.image ?? null,
    githubLogin,
    isAdmin: isAdminLogin(githubLogin),
  };
}

/** For server actions: returns the admin, or null if the caller isn't one. */
export async function getAdmin(): Promise<SessionUser | null> {
  const user = await getSessionUser();
  return user?.isAdmin ? user : null;
}

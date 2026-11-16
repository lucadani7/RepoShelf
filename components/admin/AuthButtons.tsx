"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function SignInButton() {
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await authClient.signIn.social({
          provider: "github",
          callbackURL: "/admin",
          errorCallbackURL: "/admin",
        });
      }}
      className="h-11 rounded-full bg-accent px-6 text-[15px] font-medium text-white shadow-soft transition hover:bg-accent-hover disabled:opacity-60"
    >
      {pending ? "Redirecting to GitHub…" : "Sign in with GitHub"}
    </button>
  );
}

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await authClient.signOut();
        router.refresh();
      }}
      className="h-9 rounded-full bg-white px-4 text-sm text-ink ring-1 ring-black/10 transition hover:bg-canvas disabled:opacity-60"
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}

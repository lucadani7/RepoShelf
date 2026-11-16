"use client";

import { useActionState, useEffect, useRef } from "react";
import { addRepo, type ActionResult } from "@/app/actions";

const inputClass =
  "w-full rounded-xl bg-canvas px-4 py-3 text-[15px] text-ink placeholder:text-faint transition focus:bg-surface focus:ring-2 focus:ring-accent/40 focus:outline-none";

export default function AddRepoForm() {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(addRepo, null);
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the form after a successful add
  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-ink">GitHub repo</span>
        <input
          name="repo"
          required
          placeholder="https://github.com/vercel/next.js  or  vercel/next.js"
          className={inputClass}
          autoComplete="off"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">
            Framework <span className="font-normal text-faint">(optional)</span>
          </span>
          <input name="framework" placeholder="Next.js" className={inputClass} autoComplete="off" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">
            Tags <span className="font-normal text-faint">(optional, comma-separated)</span>
          </span>
          <input name="tags" placeholder="web, react" className={inputClass} autoComplete="off" />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-ink">
          Note <span className="font-normal text-faint">(optional)</span>
        </span>
        <textarea name="note" rows={2} placeholder="Why it's on the shelf" className={inputClass} />
      </label>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="h-11 rounded-full bg-accent px-6 text-[15px] font-medium text-white shadow-soft transition hover:bg-accent-hover disabled:opacity-60"
        >
          {pending ? "Adding…" : "Add to shelf"}
        </button>
        {state && (
          <p role="status" className={`text-sm ${state.ok ? "text-success" : "text-danger"}`}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}

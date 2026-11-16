"use client";

import { useState, useTransition } from "react";
import { removeRepo } from "@/app/actions";

export default function RemoveButton({ id, fullName }: { id: string; fullName: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-xs text-danger">{error}</span>}
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!window.confirm(`Remove ${fullName} from the shelf?`)) return;
          setError(null);
          startTransition(async () => {
            const result = await removeRepo(id);
            if (result && !result.ok) setError(result.message);
          });
        }}
        className="h-8 rounded-full px-3.5 text-sm text-danger transition hover:bg-danger/10 disabled:opacity-60"
      >
        {pending ? "Removing…" : "Remove"}
      </button>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { refreshFromGitHub, type ActionResult } from "@/app/actions";

export default function RefreshButton() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult>(null);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(async () => setResult(await refreshFromGitHub()))}
        className="h-9 rounded-full bg-white px-4 text-sm text-ink ring-1 ring-black/10 transition hover:bg-canvas disabled:opacity-60"
      >
        {pending ? "Refreshing…" : "Refresh from GitHub"}
      </button>
      {result && (
        <span className={`text-sm ${result.ok ? "text-success" : "text-danger"}`}>{result.message}</span>
      )}
    </div>
  );
}

import { revalidateTag } from "next/cache";
import { syncAllFromGitHub } from "@/lib/github";
import { REPOS_TAG } from "@/lib/repos";

/**
 * Called once a day by Vercel Cron (see vercel.json) to refresh stars,
 * descriptions and topics. Vercel sends "Authorization: Bearer <CRON_SECRET>".
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await syncAllFromGitHub();
  // Serve the old list until the fresh one is ready
  revalidateTag(REPOS_TAG, "max");

  return Response.json(result);
}

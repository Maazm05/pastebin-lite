import { kv } from "@/lib/kv";
import { getNow } from "@/lib/time";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const key = `paste:${params.id}`;
  const paste = await kv.get<any>(key);

  if (!paste) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const now = getNow(req);

  if (paste.expiresAt && now >= paste.expiresAt) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  let newViewsUsed = paste.viewsUsed;

  if (paste.maxViews !== null) {
    newViewsUsed += 1;
    if (newViewsUsed > paste.maxViews) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    await kv.set(key, {
      ...paste,
      viewsUsed: newViewsUsed,
    });
  }

  return Response.json({
    content: paste.content,
    remaining_views:
      paste.maxViews === null
        ? null
        : Math.max(paste.maxViews - newViewsUsed, 0),
    expires_at: paste.expiresAt
      ? new Date(paste.expiresAt).toISOString()
      : null,
  });
}

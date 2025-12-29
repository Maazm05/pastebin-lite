import { kv } from "@/lib/kv";
import { getNow } from "@/lib/time";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const key = `paste:${params.id}`;

  // 1 Fetch paste
  const paste = await kv.get(key);
  if (!paste) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const now = getNow(_req);

  // 2️ Check TTL expiry
  if (paste.expiresAt && now >= paste.expiresAt) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  // 3️ Handle view limit (atomic)
  if (paste.maxViews !== null) {
    const newViewsUsed = paste.viewsUsed + 1;

    // Exceeded?
    if (newViewsUsed > paste.maxViews) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    // Update atomically
    await kv.set(key, {
      ...paste,
      viewsUsed: newViewsUsed,
    });
  }

  const remainingViews =
    paste.maxViews === null
      ? null
      : Math.max(paste.maxViews - (paste.viewsUsed + 1), 0);

  return Response.json({
    content: paste.content,
    remaining_views: remainingViews,
    expires_at: paste.expiresAt
      ? new Date(paste.expiresAt).toISOString()
      : null,
  });
}

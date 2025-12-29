import { kv } from "@/lib/kv";
import { nanoid } from "nanoid";
import { validatePasteInput } from "@/lib/validation";

export async function POST(req: Request) {
  const body = await req.json();
  const error = validatePasteInput(body);

  if (error) {
    return Response.json({ error }, { status: 400 });
  }

  const id = nanoid(10);
  const now = Date.now();

  const expiresAt = body.ttl_seconds ? now + body.ttl_seconds * 1000 : null;

  const paste = {
    id,
    content: body.content,
    createdAt: now,
    expiresAt,
    maxViews: body.max_views ?? null,
    viewsUsed: 0,
  };

  await kv.set(`paste:${id}`, paste);

  return Response.json({
    id,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}`,
  });
}

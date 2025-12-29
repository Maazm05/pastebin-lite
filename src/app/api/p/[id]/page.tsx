import { notFound } from "next/navigation";
import { kv } from "@/lib/kv";

type PageProps = {
  params: { id: string };
};

export default async function PastePage({ params }: PageProps) {
  const paste = await kv.get<any>(`paste:${params.id}`);

  // Not found / expired / exceeded → 404
  if (!paste) {
    return notFound();
  }

  // TTL check (HTML view should respect expiry)
  if (paste.expiresAt && Date.now() >= paste.expiresAt) {
    return notFound();
  }

  // View limit check (do NOT increment)
  if (paste.maxViews !== null && paste.viewsUsed >= paste.maxViews) {
    return notFound();
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>Paste</h1>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          background: "#f5f5f5",
          padding: "1rem",
          borderRadius: "6px",
        }}
      >
        {paste.content}
      </pre>
    </main>
  );
}

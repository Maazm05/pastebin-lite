"use client";

import { useState } from "react";

export default function HomePage() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [remainingViews, setRemainingViews] = useState<number | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResultUrl(null);
    setRemainingViews(null);
    setExpiresAt(null);
    setLoading(true);

    const payload: any = { content };
    if (ttl) payload.ttl_seconds = Number(ttl);
    if (maxViews) payload.max_views = Number(maxViews);

    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setResultUrl(data.url);
        setRemainingViews(data.remaining_views);
        setExpiresAt(data.expires_at);
        setContent("");
        setTtl("");
        setMaxViews("");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard() {
    if (resultUrl) {
      navigator.clipboard.writeText(resultUrl);
      alert("URL copied to clipboard!");
    }
  }

  return (
    <main style={{ maxWidth: 700, margin: "2rem auto", padding: "1rem" }}>
      <h1>Pastebin Lite</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Paste Content</label>
          <textarea
            required
            rows={8}
            style={{ width: "100%", marginTop: 4 }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>TTL (seconds, optional)</label>
          <input
            type="number"
            min="1"
            style={{ width: "100%", marginTop: 4 }}
            value={ttl}
            onChange={(e) => setTtl(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Max Views (optional)</label>
          <input
            type="number"
            min="1"
            style={{ width: "100%", marginTop: 4 }}
            value={maxViews}
            onChange={(e) => setMaxViews(e.target.value)}
          />
        </div>

        <button disabled={loading}>
          {loading ? "Creating..." : "Create Paste"}
        </button>
      </form>

      {resultUrl && (
        <div style={{ marginTop: "1rem" }}>
          <p>Paste created:</p>
          <a href={resultUrl} target="_blank" rel="noreferrer">
            {resultUrl}
          </a>
          <button onClick={copyToClipboard} style={{ marginLeft: 8 }}>
            Copy URL
          </button>
          {remainingViews !== null && (
            <p>Remaining views: {remainingViews}</p>
          )}
          {expiresAt && <p>Expires at: {new Date(expiresAt).toLocaleString()}</p>}
        </div>
      )}

      {error && (
        <div style={{ marginTop: "1rem", color: "red" }}>
          {error}
        </div>
      )}
    </main>
  );
}

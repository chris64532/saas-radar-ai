import { createServerFn } from "@tanstack/react-start";
import { SAAS } from "./mock-saas";

export const fetchFeed = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const base = process.env["VERCEL_URL"]
      ? `https://${process.env["VERCEL_URL"]}`
      : "http://localhost:3000";

    const res = await fetch(`${base}/api/feed`);
    if (!res.ok) throw new Error(`Feed fetch failed: ${res.status}`);

    const data = await res.json() as Record<string, unknown>[];

    if (!data || data.length === 0) {
      console.warn("[fetchFeed] /api/feed returned 0 rows — using mock fallback");
      return fallback();
    }

    console.log(`[fetchFeed] Loaded ${data.length} items from /api/feed`);
    return data.map(toFeedItem);
  } catch (err) {
    console.error("[fetchFeed] Exception:", err);
    return fallback();
  }
});

function fallback() {
  return SAAS.map((s) => ({
    id: s.id,
    name: s.name,
    tagline: s.tagline,
    category: s.category,
    source: s.source,
    score: s.score,
    growth: s.growth,
    url: s.url,
    spark: s.spark,
    ai_summary: "",
    detected_at: s.detectedAt,
  }));
}

function toFeedItem(row: Record<string, unknown>) {
  return {
    id: String(row["id"] ?? ""),
    name: String(row["name"] ?? ""),
    tagline: String(row["tagline"] ?? ""),
    category: String(row["category"] ?? ""),
    source: String(row["source"] ?? "GitHub") as "GitHub" | "ProductHunt" | "Reddit" | "IndieHackers",
    score: Number(row["score"] ?? 0),
    growth: Number(row["growth"] ?? 0),
    url: String(row["url"] ?? ""),
    spark: (row["spark"] as number[]) ?? [],
    ai_summary: String(row["ai_summary"] ?? ""),
    detected_at: String(row["detected_at"] ?? ""),
  };
}

export type FeedItem = Awaited<ReturnType<typeof fetchFeed>>[number];

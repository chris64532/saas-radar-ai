import { getSaas } from "./mock-saas";
import type { FeedItem } from "./fetch-feed";

export async function fetchSaasById(id: string): Promise<FeedItem> {
  try {
    const res = await fetch("/api/feed");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const all = await res.json() as Record<string, unknown>[];
    const row = all.find((r) => r["id"] === id);
    if (row) {
      return {
        id: String(row["id"] ?? ""),
        name: String(row["name"] ?? ""),
        tagline: String(row["tagline"] ?? ""),
        category: String(row["category"] ?? ""),
        source: String(row["source"] ?? "GitHub") as FeedItem["source"],
        score: Number(row["score"] ?? 0),
        growth: Number(row["growth"] ?? 0),
        url: String(row["url"] ?? ""),
        spark: (row["spark"] as number[]) ?? [],
        ai_summary: String(row["ai_summary"] ?? ""),
        detected_at: String(row["detected_at"] ?? ""),
      };
    }
  } catch {}

  // Fallback to mock
  const mock = getSaas(id);
  return {
    id: mock.id, name: mock.name, tagline: mock.tagline,
    category: mock.category, source: mock.source, score: mock.score,
    growth: mock.growth, url: mock.url, spark: mock.spark,
    ai_summary: "", detected_at: mock.detectedAt,
  };
}

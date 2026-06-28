import { SAAS } from "./mock-saas";

export type FeedItem = {
  id: string;
  name: string;
  tagline: string;
  category: string;
  source: "GitHub" | "ProductHunt" | "Reddit" | "IndieHackers";
  score: number;
  growth: number;
  url: string;
  spark: number[];
  ai_summary: string;
  detected_at: string;
};

export async function fetchFeed(): Promise<FeedItem[]> {
  try {
    const res = await fetch("/api/feed");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json() as Record<string, unknown>[];
    if (!data || data.length === 0) return fallback();
    return data.map(toFeedItem);
  } catch {
    return fallback();
  }
}

function fallback(): FeedItem[] {
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

function toFeedItem(row: Record<string, unknown>): FeedItem {
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

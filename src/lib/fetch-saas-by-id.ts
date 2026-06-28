import { createServerFn } from "@tanstack/react-start";
import { getSaas } from "./mock-saas";

export const fetchSaasById = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      const base = process.env["VERCEL_URL"]
        ? `https://${process.env["VERCEL_URL"]}`
        : "http://localhost:3000";

      const res = await fetch(`${base}/api/feed`);
      if (!res.ok) throw new Error(`Feed fetch failed: ${res.status}`);

      const all = await res.json() as Record<string, unknown>[];
      const row = all.find((r) => r["id"] === id);

      if (!row) {
        const mock = getSaas(id);
        return {
          id: mock.id, name: mock.name, tagline: mock.tagline,
          category: mock.category, source: mock.source, score: mock.score,
          growth: mock.growth, url: mock.url, spark: mock.spark,
          ai_summary: "", detected_at: mock.detectedAt,
        };
      }

      return {
        id: String(row["id"] ?? ""),
        name: String(row["name"] ?? ""),
        tagline: String(row["tagline"] ?? ""),
        category: String(row["category"] ?? ""),
        source: String(row["source"] ?? "GitHub"),
        score: Number(row["score"] ?? 0),
        growth: Number(row["growth"] ?? 0),
        url: String(row["url"] ?? ""),
        spark: (row["spark"] as number[]) ?? [],
        ai_summary: String(row["ai_summary"] ?? ""),
        detected_at: String(row["detected_at"] ?? ""),
      };
    } catch {
      const mock = getSaas(id);
      return {
        id: mock.id, name: mock.name, tagline: mock.tagline,
        category: mock.category, source: mock.source, score: mock.score,
        growth: mock.growth, url: mock.url, spark: mock.spark,
        ai_summary: "", detected_at: mock.detectedAt,
      };
    }
  });

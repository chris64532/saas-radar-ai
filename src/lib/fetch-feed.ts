import { createServerFn } from "@tanstack/react-start";
import { supabase, type SaasRow } from "./supabase";
import { SAAS } from "./mock-saas";

export const fetchFeed = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { data, error } = await supabase
      .from("saas_items")
      .select("*")
      .order("score", { ascending: false })
      .limit(50);

    if (error) {
      console.error("[fetchFeed] Supabase error:", error.message);
      return fallback();
    }

    if (!data || data.length === 0) {
      console.warn("[fetchFeed] Supabase returned 0 rows — using mock fallback");
      return fallback();
    }

    console.log(`[fetchFeed] Loaded ${data.length} items from Supabase`);
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

function toFeedItem(row: SaasRow) {
  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline,
    category: row.category,
    source: row.source,
    score: row.score,
    growth: row.growth,
    url: row.url,
    spark: row.spark ?? [],
    ai_summary: row.ai_summary,
    detected_at: row.detected_at,
  };
}

export type FeedItem = Awaited<ReturnType<typeof fetchFeed>>[number];

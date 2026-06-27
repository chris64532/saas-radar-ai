import { createServerFn } from "@tanstack/react-start";
import { supabase } from "./supabase";
import { getSaas } from "./mock-saas";

export const fetchSaasById = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      const { data, error } = await supabase
        .from("saas_items")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        // fallback to mock
        const mock = getSaas(id);
        return {
          id: mock.id,
          name: mock.name,
          tagline: mock.tagline,
          category: mock.category,
          source: mock.source,
          score: mock.score,
          growth: mock.growth,
          url: mock.url,
          spark: mock.spark,
          ai_summary: "",
          detected_at: mock.detectedAt,
        };
      }

      return {
        id: data.id,
        name: data.name,
        tagline: data.tagline,
        category: data.category,
        source: data.source,
        score: data.score,
        growth: data.growth,
        url: data.url,
        spark: data.spark ?? [],
        ai_summary: data.ai_summary ?? "",
        detected_at: data.detected_at,
      };
    } catch {
      const mock = getSaas(id);
      return {
        id: mock.id,
        name: mock.name,
        tagline: mock.tagline,
        category: mock.category,
        source: mock.source,
        score: mock.score,
        growth: mock.growth,
        url: mock.url,
        spark: mock.spark,
        ai_summary: "",
        detected_at: mock.detectedAt,
      };
    }
  });

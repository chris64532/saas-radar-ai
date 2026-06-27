import { createClient } from "@supabase/supabase-js";

let _client: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!_client) {
    const url = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_SERVICE_KEY"];
    if (!url || !key) throw new Error("SUPABASE_URL or SUPABASE_SERVICE_KEY is not set");
    _client = createClient(url, key);
  }
  return _client;
}

// Keep named export for pipeline.ts compatibility
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    return (getSupabase() as never)[prop as never];
  },
});

export type SaasRow = {
  id: string;
  name: string;
  tagline: string;
  category: string;
  source: "ProductHunt" | "GitHub" | "Reddit" | "IndieHackers";
  score: number;
  growth: number;
  url: string;
  spark: number[];
  ai_summary: string;
  detected_at: string;
  updated_at: string;
};

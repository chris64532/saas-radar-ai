import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env["SUPABASE_URL"]!;
const supabaseKey = process.env["SUPABASE_SERVICE_KEY"]!;

export const supabase = createClient(supabaseUrl, supabaseKey);

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

export type SaasItem = {
  id: string;
  name: string;
  tagline: string;
  category: string;
  source: "ProductHunt" | "GitHub" | "Reddit" | "IndieHackers";
  score: number;
  growth: number;
  detectedAt: string;
  spark: number[];
  url: string;
};

const rand = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

export const SAAS: SaasItem[] = [
  ["Lumen AI", "AI copilot for Postgres", "Dev Tools", "GitHub", 92, 184],
  ["Foldr", "Notion alternative for ops", "Productivity", "ProductHunt", 87, 142],
  ["Pulseboard", "Realtime KPI broadcast", "Analytics", "ProductHunt", 84, 120],
  ["Synthwave", "Synthetic test data for QA", "Dev Tools", "GitHub", 81, 98],
  ["Routely", "Edge routing for AI apps", "Infra", "GitHub", 79, 92],
  ["Inkwell", "AI ghostwriter for founders", "Marketing", "Reddit", 76, 88],
  ["Mercato", "No-code marketplace builder", "No-code", "IndieHackers", 74, 71],
  ["Vaultkit", "Encrypted secrets for teams", "Security", "ProductHunt", 72, 64],
  ["Trailmix", "Async standups for remote teams", "Productivity", "ProductHunt", 68, 52],
  ["Cohortly", "Retention analytics for B2C", "Analytics", "IndieHackers", 66, 47],
  ["Fielder", "Form intelligence + AI routing", "AI", "ProductHunt", 64, 41],
  ["Strato", "Cron jobs for serverless", "Infra", "GitHub", 61, 38],
  ["Hatchwise", "Idea validation engine", "AI", "Reddit", 59, 33],
  ["Quillscope", "AI for sales call analysis", "AI", "ProductHunt", 57, 29],
  ["Plotter", "Charts API for SaaS dashboards", "Dev Tools", "GitHub", 54, 24],
  ["Brevity", "AI inbox triage for execs", "Productivity", "ProductHunt", 52, 21],
].map(([name, tagline, category, source, score, growth], i) => {
  const r = rand(i + 1);
  return {
    id: (name as string).toLowerCase().replace(/\s+/g, "-"),
    name: name as string,
    tagline: tagline as string,
    category: category as string,
    source: source as SaasItem["source"],
    score: score as number,
    growth: growth as number,
    detectedAt: `${(i % 14) + 1}d ago`,
    spark: Array.from({ length: 16 }, () => 30 + Math.floor(r() * 70)),
    url: `https://www.google.com/search?q=${encodeURIComponent(name as string)}`,
  };
});

export const CATEGORIES = ["AI", "Dev Tools", "Marketing", "Productivity", "Analytics", "Infra", "Security", "No-code"];
export const SOURCES = ["ProductHunt", "GitHub", "Reddit", "IndieHackers"] as const;

export const SOURCE_COLOR: Record<SaasItem["source"], string> = {
  GitHub: "var(--source-gh)",
  ProductHunt: "var(--source-ph)",
  Reddit: "var(--source-reddit)",
  IndieHackers: "var(--source-ih)",
};

export function getSaas(id: string) {
  return SAAS.find((s) => s.id === id) ?? SAAS[0];
}

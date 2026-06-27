import type { SaasRow } from "../supabase";

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function randomSpark(): number[] {
  return Array.from({ length: 16 }, () => 30 + Math.floor(Math.random() * 70));
}

export async function scrapeGitHub(): Promise<Partial<SaasRow>[]> {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (process.env["GITHUB_TOKEN"]) {
    headers["Authorization"] = `Bearer ${process.env["GITHUB_TOKEN"]}`;
  }

  const res = await fetch(
    `https://api.github.com/search/repositories?q=created:>${since}&sort=stars&order=desc&per_page=30`,
    { headers },
  );

  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

  const json = await res.json() as { items: Array<{
    name: string;
    description: string | null;
    html_url: string;
    stargazers_count: number;
    topics: string[];
  }> };

  return json.items
    .filter((r) => r.description && r.description.length > 20)
    .slice(0, 15)
    .map((r) => ({
      id: slugify(r.name),
      name: r.name,
      tagline: r.description ?? "",
      category: r.topics[0] ? capitalize(r.topics[0]) : "Dev Tools",
      source: "GitHub" as const,
      url: r.html_url,
      growth: Math.round(r.stargazers_count / 10),
      spark: randomSpark(),
    }));
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

import type { SaasRow } from "../supabase";

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function randomSpark(): number[] {
  return Array.from({ length: 16 }, () => 30 + Math.floor(Math.random() * 70));
}

const SUBREDDITS = ["SaaS", "startups", "entrepreneur"];

export async function scrapeReddit(): Promise<Partial<SaasRow>[]> {
  const results: Partial<SaasRow>[] = [];

  for (const sub of SUBREDDITS) {
    const res = await fetch(
      `https://www.reddit.com/r/${sub}/new.json?limit=25`,
      { headers: { "User-Agent": "saas-radar-bot/1.0" } },
    );

    if (!res.ok) continue;

    const json = await res.json() as {
      data: {
        children: Array<{
          data: {
            title: string;
            selftext: string;
            url: string;
            score: number;
            is_self: boolean;
          };
        }>;
      };
    };

    const launchPosts = json.data.children.filter(({ data }) => {
      const title = data.title.toLowerCase();
      return (
        !data.is_self &&
        (title.includes("launch") ||
          title.includes("show") ||
          title.includes("built") ||
          title.includes("i made") ||
          title.includes("i created"))
      );
    });

    for (const { data: post } of launchPosts.slice(0, 5)) {
      results.push({
        id: slugify(post.title.slice(0, 40)),
        name: post.title.slice(0, 60),
        tagline: post.selftext.slice(0, 120) || post.title,
        category: capitalize(sub),
        source: "Reddit" as const,
        url: post.url,
        growth: post.score,
        spark: randomSpark(),
      });
    }
  }

  return results;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

import type { SaasRow } from "../supabase";

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function randomSpark(): number[] {
  return Array.from({ length: 16 }, () => 30 + Math.floor(Math.random() * 70));
}

export async function scrapeIndieHackers(): Promise<Partial<SaasRow>[]> {
  const res = await fetch("https://www.indiehackers.com/products?sorting=newest", {
    headers: { "User-Agent": "saas-radar-bot/1.0" },
  });

  if (!res.ok) throw new Error(`IndieHackers fetch error: ${res.status}`);

  const html = await res.text();
  const results: Partial<SaasRow>[] = [];

  // Extract product cards via regex on the rendered HTML
  const namePattern = /"name":"([^"]{3,60})"/g;
  const taglinePattern = /"tagline":"([^"]{10,150})"/g;
  const urlPattern = /"url":"(https?:\/\/[^"]+)"/g;

  const names: string[] = [];
  const taglines: string[] = [];
  const urls: string[] = [];

  let m: RegExpExecArray | null;
  while ((m = namePattern.exec(html)) !== null) names.push(m[1]);
  while ((m = taglinePattern.exec(html)) !== null) taglines.push(m[1]);
  while ((m = urlPattern.exec(html)) !== null) urls.push(m[1]);

  const count = Math.min(names.length, taglines.length, urls.length, 15);

  for (let i = 0; i < count; i++) {
    results.push({
      id: slugify(names[i]),
      name: names[i],
      tagline: taglines[i],
      category: "Product",
      source: "IndieHackers" as const,
      url: urls[i],
      growth: Math.floor(Math.random() * 80) + 10,
      spark: randomSpark(),
    });
  }

  return results;
}

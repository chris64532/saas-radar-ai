import Anthropic from "@anthropic-ai/sdk";
import { supabase, type SaasRow } from "./supabase";
import { scrapeGitHub } from "./scrapers/github";
import { scrapeProductHunt } from "./scrapers/producthunt";
import { scrapeReddit } from "./scrapers/reddit";
import { scrapeIndieHackers } from "./scrapers/indiehackers";

const anthropic = new Anthropic();

async function scoreAndSummarize(item: Partial<SaasRow>): Promise<{ score: number; summary: string }> {
  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 200,
    messages: [
      {
        role: "user",
        content: `Tu es un analyste SaaS. Analyse ce produit et réponds UNIQUEMENT en JSON valide :
{
  "score": <entier 0-100 représentant le potentiel de croissance>,
  "summary": "<2-3 phrases en anglais : positionnement, moat, signal d'opportunité>"
}

Produit:
- Nom: ${item.name}
- Description: ${item.tagline}
- Source: ${item.source}
- Croissance brute: ${item.growth}`,
      },
    ],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "{}";

  try {
    const parsed = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] ?? "{}") as {
      score?: number;
      summary?: string;
    };
    return {
      score: Math.min(100, Math.max(0, parsed.score ?? 50)),
      summary: parsed.summary ?? "",
    };
  } catch {
    return { score: 50, summary: "" };
  }
}

export async function runPipeline(): Promise<{ processed: number; errors: string[] }> {
  const errors: string[] = [];

  // Run all scrapers in parallel, collect errors without crashing
  const [gh, ph, rd, ih] = await Promise.allSettled([
    scrapeGitHub(),
    scrapeProductHunt(),
    scrapeReddit(),
    scrapeIndieHackers(),
  ]);

  const raw: Partial<SaasRow>[] = [];

  for (const [label, result] of [
    ["GitHub", gh],
    ["ProductHunt", ph],
    ["Reddit", rd],
    ["IndieHackers", ih],
  ] as [string, PromiseSettledResult<Partial<SaasRow>[]>][]) {
    if (result.status === "fulfilled") {
      raw.push(...result.value);
    } else {
      const msg = `${label} scraper failed: ${(result.reason as Error).message}`;
      errors.push(msg);
      console.error(msg);
    }
  }

  // Deduplicate by id
  const seen = new Set<string>();
  const items = raw.filter((item) => {
    if (!item.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });

  let processed = 0;

  // Score and upsert sequentially to avoid rate limits
  for (const item of items) {
    try {
      const { score, summary } = await scoreAndSummarize(item);

      const row: Omit<SaasRow, "detected_at" | "updated_at"> = {
        id: item.id!,
        name: item.name ?? "Unknown",
        tagline: item.tagline ?? "",
        category: item.category ?? "Other",
        source: item.source ?? "GitHub",
        score,
        growth: item.growth ?? 0,
        url: item.url ?? "",
        spark: item.spark ?? [],
        ai_summary: summary,
      };

      const { error } = await supabase.from("saas_items").upsert(row, {
        onConflict: "id",
      });

      if (error) {
        errors.push(`Supabase upsert failed for ${item.id}: ${error.message}`);
      } else {
        processed++;
      }
    } catch (err) {
      errors.push(`Score/upsert failed for ${item.id}: ${(err as Error).message}`);
    }
  }

  return { processed, errors };
}

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

// Check if a URL is still alive (simple HEAD request)
async function isUrlAlive(url: string): Promise<boolean> {
  if (!url || url.includes("example.com")) return false;
  try {
    const res = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(5000),
    });
    return res.status < 400;
  } catch {
    return false;
  }
}

async function isObsolete(item: SaasRow): Promise<boolean> {
  // Items older than 90 days with score below 40 are candidates
  const age = Date.now() - new Date(item.detected_at).getTime();
  const daysOld = age / (1000 * 60 * 60 * 24);

  if (daysOld < 30) return false; // Keep recent items always

  // Check URL liveness
  const alive = await isUrlAlive(item.url);
  if (!alive) return true;

  // Ask Haiku if the product seems dead/abandoned
  if (daysOld > 60 && item.score < 40) {
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 50,
      messages: [
        {
          role: "user",
          content: `Is this SaaS product likely abandoned or shut down? Answer only "yes" or "no".
Name: ${item.name}
Description: ${item.tagline}
Score: ${item.score}/100
Detected: ${Math.round(daysOld)} days ago`,
        },
      ],
    });
    const answer = message.content[0].type === "text" ? message.content[0].text.toLowerCase() : "";
    return answer.includes("yes");
  }

  return false;
}

async function runCleanup(): Promise<{ removed: number; errors: string[] }> {
  const errors: string[] = [];
  let removed = 0;

  const { data: existing, error } = await supabase
    .from("saas_items")
    .select("*")
    .order("detected_at", { ascending: true })
    .limit(200);

  if (error || !existing) {
    errors.push(`Cleanup fetch failed: ${error?.message}`);
    return { removed, errors };
  }

  for (const item of existing) {
    try {
      const obsolete = await isObsolete(item as SaasRow);
      if (obsolete) {
        const { error: delError } = await supabase
          .from("saas_items")
          .delete()
          .eq("id", item.id);

        if (delError) {
          errors.push(`Delete failed for ${item.id}: ${delError.message}`);
        } else {
          console.log(`[cleanup] Removed obsolete: ${item.name}`);
          removed++;
        }
      }
    } catch (err) {
      errors.push(`Cleanup check failed for ${item.id}: ${(err as Error).message}`);
    }
  }

  return { removed, errors };
}

export async function runPipeline(): Promise<{
  processed: number;
  removed: number;
  errors: string[];
}> {
  const errors: string[] = [];

  // Step 1 — Cleanup obsolete entries first
  console.log("[pipeline] Starting cleanup...");
  const { removed, errors: cleanupErrors } = await runCleanup();
  errors.push(...cleanupErrors);
  console.log(`[pipeline] Cleanup done: ${removed} removed`);

  // Step 2 — Run all scrapers in parallel
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

  console.log(`[pipeline] ${items.length} unique items to score and upsert`);

  let processed = 0;

  // Step 3 — Score and upsert sequentially to avoid rate limits
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

  return { processed, removed, errors };
}

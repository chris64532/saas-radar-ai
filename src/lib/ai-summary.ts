import { createServerFn } from "@tanstack/react-start";
import Anthropic from "@anthropic-ai/sdk";

type SummaryInput = {
  name: string;
  tagline: string;
  category: string;
  source: string;
  score: number;
  growth: number;
};

export const fetchAiSummary = createServerFn({ method: "POST" })
  .validator((data: SummaryInput) => data)
  .handler(async ({ data }) => {
    const client = new Anthropic();

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 150,
      messages: [
        {
          role: "user",
          content: `Analyse ce SaaS en 2-3 phrases pour des investisseurs et founders. Sois direct et factuel.

Nom: ${data.name}
Description: ${data.tagline}
Catégorie: ${data.category}
Source: ${data.source}
Score de croissance: ${data.score}/100
Croissance 7j: +${data.growth}%

Résumé (positionnement, moat, signal d'opportunité) :`,
        },
      ],
    });

    const block = message.content[0];
    return block.type === "text" ? block.text : "";
  });

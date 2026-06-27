import { createFileRoute } from "@tanstack/react-router";
import { Book, Database, Sparkles, HelpCircle } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/docs")({
  component: Docs,
  head: () => ({ meta: [{ title: "Docs — SaaS Radar AI" }] }),
});

const TOC = [
  { id: "how", label: "How it works", icon: Book },
  { id: "score", label: "Scoring system", icon: Sparkles },
  { id: "sources", label: "Data sources", icon: Database },
  { id: "faq", label: "FAQ", icon: HelpCircle },
];

function Docs() {
  return (
    <AppShell title="Documentation" subtitle="Everything about how SaaS Radar AI works under the hood">
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="sticky top-20 h-fit space-y-1 rounded-xl border border-border-subtle bg-surface p-2">
          {TOC.map((t) => (
            <a key={t.id} href={`#${t.id}`} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
              <t.icon className="h-3.5 w-3.5" /> {t.label}
            </a>
          ))}
        </aside>

        <article className="space-y-12">
          <Section id="how" title="How it works">
            <p>SaaS Radar AI continuously scans the web for new SaaS products, scores their growth potential and surfaces signals to operators in real-time.</p>
            <ol className="mt-4 space-y-3 text-sm">
              <li><strong>1. Crawl.</strong> Our pipelines poll Product Hunt, GitHub, Reddit, HackerNews, IndieHackers every 60 seconds.</li>
              <li><strong>2. Enrich.</strong> Each product is enriched with traffic estimates, backlinks, tech stack and sentiment analysis.</li>
              <li><strong>3. Score.</strong> A multi-factor AI model computes a 0-100 Growth Score updated every 15 minutes.</li>
              <li><strong>4. Notify.</strong> Custom alert rules fire when your thresholds are met.</li>
            </ol>
          </Section>

          <Section id="score" title="Scoring system">
            <p>The Growth Score is a weighted blend of four pillars, normalized to a 0-100 scale.</p>
            <div className="mt-4 space-y-2">
              {[
                { f: "Traction", w: 35, c: "Mentions, upvotes, stars over time" },
                { f: "Velocity", w: 25, c: "Week-over-week change of all signals" },
                { f: "Quality", w: 25, c: "Backlinks, sentiment, dev activity" },
                { f: "Novelty", w: 15, c: "Differentiation vs. existing SaaS in category" },
              ].map((row) => (
                <div key={row.f} className="rounded-lg border border-border-subtle bg-surface p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">{row.f}</span>
                    <span className="font-mono text-xs text-muted-foreground">{row.w}%</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${row.w * 2.5}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{row.c}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="sources" title="Data sources">
            <div className="grid gap-3 md:grid-cols-2">
              {[
                { n: "Product Hunt", d: "New launches, upvotes, comments" },
                { n: "GitHub", d: "Repo creation, stars, commit velocity" },
                { n: "Reddit", d: "r/SaaS, r/startups, niche subreddits" },
                { n: "Hacker News", d: "Show HN, Launch HN threads" },
                { n: "IndieHackers", d: "Milestones, revenue posts" },
                { n: "Twitter / X", d: "Founder activity, viral threads" },
              ].map((s) => (
                <div key={s.n} className="rounded-lg border border-border-subtle bg-surface p-4">
                  <div className="text-sm font-semibold">{s.n}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.d}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section id="faq" title="FAQ">
            <div className="space-y-3">
              {[
                { q: "How fresh is the data?", a: "Most sources poll every 60s. Scores recompute every 15 minutes." },
                { q: "Can I export the data?", a: "Yes — CSV and JSON exports are available on Premium and above." },
                { q: "Do you offer an API?", a: "Pro includes 1k calls/day. Premium and Business have higher limits." },
                { q: "Is the score predictive?", a: "Premium plan unlocks 30-day predictive scores trained on past breakouts." },
              ].map((f) => (
                <details key={f.q} className="rounded-xl border border-border-subtle bg-surface p-4">
                  <summary className="cursor-pointer text-sm font-medium">{f.q}</summary>
                  <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </Section>
        </article>
      </div>
    </AppShell>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-3 text-sm text-muted-foreground">{children}</div>
    </section>
  );
}

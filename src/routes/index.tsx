import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Activity, Radar, Sparkles, Bell, Zap, LineChart, Check } from "lucide-react";
import { MarketingNav } from "@/components/marketing-nav";
import { MarketingFooter } from "@/components/marketing-footer";
import { fetchFeed } from "@/lib/fetch-feed";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "SaaS Radar AI — Spot the next big SaaS, before it goes mainstream" },
      { name: "description", content: "AI-powered SaaS intelligence platform — discover, score and track emerging software products from Product Hunt, GitHub, Reddit and more." },
    ],
  }),
});

function Landing() {
  const { data: feed = [] } = useQuery({
    queryKey: ["feed"],
    queryFn: () => fetchFeed(),
    staleTime: 0,
  });
  const topMovers = feed.slice(0, 5);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingNav />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border-subtle">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-accent/10 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-primary live-dot" />
              <span className="font-mono uppercase tracking-wider">Live · {feed.length > 0 ? feed.length : "—"} signals detected</span>
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">
              The Bloomberg terminal for{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                emerging SaaS
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
              SaaS Radar AI discovers, scores and ranks new software products in real-time using AI and
              multi-source data — Product Hunt, GitHub, Reddit, IndieHackers and beyond.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Start free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/app"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium text-foreground hover:bg-surface-elevated"
              >
                View live dashboard
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">No credit card required · 7-day Pro trial</p>
          </div>

          {/* Live preview card */}
          <div className="mx-auto mt-16 max-w-4xl rounded-2xl border border-border-subtle bg-surface/60 p-2 shadow-card backdrop-blur-xl">
            <div className="rounded-xl bg-background p-4">
              <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-mono uppercase tracking-wider">RADAR.AI · TOP MOVERS · LAST 24H</span>
                <span className="flex items-center gap-1.5"><Activity className="h-3 w-3 text-primary live-dot" />LIVE</span>
              </div>
              <div className="grid gap-2">
                {topMovers.map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-3 rounded-lg border border-border-subtle bg-surface px-3 py-2.5 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="grid h-7 w-7 place-items-center rounded-md bg-primary/15 font-mono text-[10px] font-bold text-primary">{s.name.slice(0,2).toUpperCase()}</span>
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-xs text-muted-foreground">{s.tagline}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 font-mono text-xs">
                      <span className="text-muted-foreground">{s.category}</span>
                      <span className="text-primary">+{s.growth.toFixed(0)}%</span>
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 font-semibold text-primary">{s.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-border-subtle py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader eyebrow="How it works" title="From signal to intelligence in 3 steps" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { icon: Radar, n: "01", t: "Continuous discovery", d: "We crawl Product Hunt, GitHub, Reddit, HN and 12+ sources every minute to catch new SaaS the moment they launch." },
              { icon: Sparkles, n: "02", t: "Proprietary scoring engine", d: "Our model evaluates traction, backlinks, dev activity & sentiment — outputs a 0-100 Growth Score." },
              { icon: Bell, n: "03", t: "Realtime alerts", d: "Set rules by category, score threshold or growth spikes. Get notified before competitors do." },
            ].map((s) => (
              <div key={s.n} className="rounded-xl border border-border-subtle bg-surface p-6">
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary"><s.icon className="h-5 w-5" /></span>
                  <span className="font-mono text-xs text-muted-foreground">{s.n}</span>
                </div>
                <h3 className="mt-4 text-base font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-border-subtle py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader eyebrow="Features" title="Investor-grade SaaS intelligence" />
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { i: Sparkles, t: "AI growth score", d: "0-100 score blending traction, hype & dev velocity." },
              { i: LineChart, t: "Multi-source signals", d: "Product Hunt, GitHub, Reddit, HN, IndieHackers." },
              { i: Bell, t: "Custom alerts", d: "Score thresholds, spikes, category triggers." },
              { i: Zap, t: "API access", d: "Pipe insights into your CRM, Slack or notebook." },
            ].map((f) => (
              <div key={f.t} className="rounded-xl border border-border-subtle bg-surface p-5">
                <f.i className="h-5 w-5 text-primary" />
                <h4 className="mt-4 text-sm font-semibold">{f.t}</h4>
                <p className="mt-1 text-xs text-muted-foreground">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="border-b border-border-subtle py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader eyebrow="Pricing" title="Plans for every kind of operator" />
          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {[
              { n: "Free", p: "€0", d: "Daily top 10 + 1 alert" },
              { n: "Pro", p: "€19", d: "Full feed + 10 alerts + API", featured: true },
              { n: "Premium", p: "€49", d: "Predictive scores + exports" },
              { n: "Business", p: "€99", d: "Team seats + dedicated SLA" },
            ].map((p) => (
              <div key={p.n} className={`rounded-xl border p-6 ${p.featured ? "border-primary/40 bg-primary/5" : "border-border-subtle bg-surface"}`}>
                <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{p.n}</div>
                <div className="mt-2 text-3xl font-semibold">{p.p}<span className="text-sm text-muted-foreground">/mo</span></div>
                <p className="mt-2 text-xs text-muted-foreground">{p.d}</p>
                <Link to="/pricing" className="mt-4 inline-flex text-xs font-semibold text-primary hover:underline">Compare plans →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-b border-border-subtle py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader eyebrow="Trusted by" title="Founders, investors, marketers" />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              { q: "We caught 3 acquisition targets weeks before they hit TechCrunch. Worth every penny.", a: "Sarah Kline", r: "Partner, North Loop Ventures" },
              { q: "Replaced 4 Chrome tabs and a Slack channel. The score is scary accurate.", a: "Diego Marín", r: "Founder, Stacknotes" },
              { q: "Best market intelligence tool I've used since Crunchbase Pro.", a: "Priya Anand", r: "Head of Growth, Tetherly" },
            ].map((t) => (
              <figure key={t.a} className="rounded-xl border border-border-subtle bg-surface p-6">
                <Check className="h-4 w-4 text-primary" />
                <blockquote className="mt-3 text-sm text-foreground">"{t.q}"</blockquote>
                <figcaption className="mt-4 text-xs">
                  <div className="font-semibold">{t.a}</div>
                  <div className="text-muted-foreground">{t.r}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Start discovering the next big SaaS.</h2>
          <p className="mt-3 text-muted-foreground">Free forever plan. Upgrade when you're ready to scale.</p>
          <Link to="/signup" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
            Get started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="text-center">
      <div className="text-xs font-mono uppercase tracking-wider text-primary">{eyebrow}</div>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, ExternalLink, Sparkles, TrendingUp, Activity, Eye, Link2, Github } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ScoreRing } from "@/components/score-ring";
import { SaasCard } from "@/components/saas-card";
import { getSaas, SAAS, SOURCE_COLOR } from "@/lib/mock-saas";

export const Route = createFileRoute("/saas/$id")({
  component: SaasDetail,
  head: ({ params }) => ({
    meta: [{ title: `${getSaas(params.id).name} — SaaS Radar AI` }],
  }),
});

function SaasDetail() {
  const { id } = Route.useParams();
  const s = getSaas(id);
  const similar = SAAS.filter((x) => x.id !== s.id && x.category === s.category).slice(0, 4);

  return (
    <AppShell title={s.name} subtitle={s.tagline}>
      <div className="space-y-6">
        {/* Header card */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border-subtle bg-surface p-6">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 font-mono text-lg font-bold">
              {s.name.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">{s.name}</h2>
                <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-mono uppercase text-muted-foreground">{s.category}</span>
                <span
                  className="rounded-md px-2 py-0.5 text-[10px] font-mono uppercase"
                  style={{ backgroundColor: `color-mix(in oklab, ${SOURCE_COLOR[s.source]} 18%, transparent)`, color: SOURCE_COLOR[s.source] }}
                >
                  {s.source}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{s.tagline}</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">Detected {s.detectedAt} · ID {s.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Growth Score</div>
              <ScoreRing score={s.score} size={80} />
            </div>
            <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
              Visit site <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card title="AI summary" icon={Sparkles}>
              <p className="text-sm text-muted-foreground">
                {s.name} is a {s.category.toLowerCase()} product positioned as “{s.tagline}.”
                Early signal indicates rapid adoption among technical operators with above-average
                retention. The product surfaces in {s.source} discussions at {Math.round(s.growth / 4)}×
                baseline frequency.
              </p>
            </Card>

            <Card title="Why this SaaS is trending" icon={TrendingUp}>
              <ul className="space-y-3 text-sm">
                {[
                  "Strong dev velocity: 87 commits in the last 14 days, 3 maintainers active daily.",
                  `Mention spike on ${s.source}: ${s.growth}% week-over-week growth in discussions.`,
                  "Backed by 412 high-quality backlinks from tech publications and operator newsletters.",
                ].map((line, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="text-muted-foreground">{line}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="Growth — last 30 days" icon={Activity}>
              <GrowthChart data={[...s.spark, ...s.spark.map((v) => v + 10)]} />
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Metrics">
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <Metric icon={Eye} label="Traffic" value={`${(8.2 + s.score / 30).toFixed(1)}k/mo`} />
                <Metric icon={Link2} label="Backlinks" value={`${412 + s.score * 4}`} />
                <Metric icon={TrendingUp} label="MoM Growth" value={`+${s.growth}%`} accent />
                <Metric icon={Sparkles} label="Hype score" value={`${Math.round(s.score * 0.92)}`} />
              </dl>
            </Card>
            <Card title="Tech stack">
              <div className="flex flex-wrap gap-1.5">
                {["Next.js", "Postgres", "Stripe", "Vercel", "OpenAI"].map((t) => (
                  <span key={t} className="rounded-md border border-border-subtle bg-muted px-2 py-1 text-xs">{t}</span>
                ))}
              </div>
            </Card>
            <Card title="Detected pricing">
              <div className="space-y-1.5 font-mono text-sm">
                <Row k="Free" v="$0 / 100 calls" />
                <Row k="Pro" v="$19 / mo" />
                <Row k="Team" v="$79 / mo" />
              </div>
            </Card>
            <Card title="Source">
              <a href={s.url} className="flex items-center justify-between text-sm hover:text-primary">
                <span className="flex items-center gap-2"><Github className="h-4 w-4" /> Original listing</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Card>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">Similar SaaS</h3>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {similar.map((x) => <SaasCard key={x.id} saas={x} />)}
          </div>
        </div>

        <Link to="/discover" className="inline-flex text-sm text-muted-foreground hover:text-foreground">← Back to discovery</Link>
      </div>
    </AppShell>
  );
}

function Card({ title, icon: Icon, children }: { title: string; icon?: typeof Sparkles; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-5">
      <div className="mb-4 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
        {Icon && <Icon className="h-3.5 w-3.5" />} {title}
      </div>
      {children}
    </div>
  );
}

function Metric({ icon: Icon, label, value, accent }: { icon: typeof Eye; label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg border border-border-subtle bg-background p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-muted-foreground"><Icon className="h-3 w-3" />{label}</div>
      <div className={`mt-1 font-mono text-base font-semibold ${accent ? "text-primary" : ""}`}>{value}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-border-subtle py-1 last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <span>{v}</span>
    </div>
  );
}

function GrowthChart({ data }: { data: number[] }) {
  const w = 600, h = 160;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${h - ((v - min) / range) * (h - 20) - 10}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      <defs>
        <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1="0" x2={w} y1={(h / 4) * i + 10} y2={(h / 4) * i + 10} stroke="var(--border)" strokeDasharray="2 4" />
      ))}
      <polygon points={`0,${h} ${points} ${w},${h}`} fill="url(#g)" />
      <polyline points={points} fill="none" stroke="var(--primary)" strokeWidth={2} />
    </svg>
  );
}

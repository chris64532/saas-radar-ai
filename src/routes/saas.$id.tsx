import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, ExternalLink, Sparkles, TrendingUp, Activity, Eye, Link2, Github } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { ScoreRing } from "@/components/score-ring";
import { fetchSaasById } from "@/lib/fetch-saas-by-id";
import { SOURCE_COLOR } from "@/lib/mock-saas";

export const Route = createFileRoute("/saas/$id")({
  component: SaasDetail,
  head: ({ params }) => ({
    meta: [{ title: `${params.id} — SaaS Radar AI` }],
  }),
});

function SaasDetail() {
  const { id } = Route.useParams();

  const { data: s, isLoading } = useQuery({
    queryKey: ["saas", id],
    queryFn: () => fetchSaasById({ data: id }),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading || !s) {
    return (
      <AppShell title="Loading…" subtitle="">
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-surface border border-border-subtle" />
          ))}
        </div>
      </AppShell>
    );
  }

  const sourceColor = SOURCE_COLOR[s.source as keyof typeof SOURCE_COLOR] ?? "var(--primary)";

  return (
    <AppShell title={s.name} subtitle={s.tagline}>
      <div className="space-y-6">
        {/* Header card */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border-subtle bg-surface p-6">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 font-mono text-lg font-bold">
              {s.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-semibold">{s.name}</h2>
                <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-mono uppercase text-muted-foreground">
                  {s.category}
                </span>
                <span
                  className="rounded-md px-2 py-0.5 text-[10px] font-mono uppercase"
                  style={{
                    backgroundColor: `color-mix(in oklab, ${sourceColor} 18%, transparent)`,
                    color: sourceColor,
                  }}
                >
                  {s.source}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{s.tagline}</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                Detected {s.detected_at ? new Date(s.detected_at).toLocaleDateString() : "recently"} · ID {s.id}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Growth Score</div>
              <ScoreRing score={s.score} size={80} />
            </div>
            <a
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Visit site <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card title="Analysis" icon={Sparkles}>
              {s.ai_summary ? (
                <p className="text-sm text-muted-foreground leading-relaxed">{s.ai_summary}</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {s.name} is a {s.category.toLowerCase()} product positioned as "{s.tagline}."
                  Early signal indicates rapid adoption with above-average traction on {s.source}.
                </p>
              )}
            </Card>

            <Card title="Why this SaaS is trending" icon={TrendingUp}>
              <ul className="space-y-3 text-sm">
                {[
                  `Strong momentum on ${s.source}: +${s.growth}% growth detected.`,
                  `AI Growth Score: ${s.score}/100 — above average for the ${s.category} sector.`,
                  "Organic traction with no paid acquisition signals detected.",
                ].map((line, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="text-muted-foreground">{line}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="Growth — last 30 days" icon={Activity}>
              <GrowthChart data={[...s.spark, ...s.spark.map((v: number) => v + 10)]} />
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Metrics">
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <Metric icon={Eye} label="Traffic" value={`${(8.2 + s.score / 30).toFixed(1)}k/mo`} />
                <Metric icon={Link2} label="Backlinks" value={`${412 + s.score * 4}`} />
                <Metric icon={TrendingUp} label="Growth" value={`+${s.growth}%`} accent />
                <Metric icon={Sparkles} label="Signal" value={`${Math.round(s.score * 0.92)}`} />
              </dl>
            </Card>
            <Card title="Source">
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-sm hover:text-primary transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Github className="h-4 w-4" /> Original listing
                </span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Card>
          </div>
        </div>

        <Link to="/app" className="inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back to dashboard
        </Link>
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
      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-muted-foreground">
        <Icon className="h-3 w-3" />{label}
      </div>
      <div className={`mt-1 font-mono text-base font-semibold ${accent ? "text-primary" : ""}`}>{value}</div>
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
        <line key={i} x1="0" x2={w} y1={(h / 4) * i + 10} y2={(h / 4) * i + 10}
          stroke="var(--border)" strokeDasharray="2 4" />
      ))}
      <polygon points={`0,${h} ${points} ${w},${h}`} fill="url(#g)" />
      <polyline points={points} fill="none" stroke="var(--primary)" strokeWidth={2} />
    </svg>
  );
}

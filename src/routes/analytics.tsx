import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Activity, TrendingUp, Zap, Flame } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Sparkline } from "@/components/sparkline";
import { fetchFeed } from "@/lib/fetch-feed";

export const Route = createFileRoute("/analytics")({
  component: Analytics,
  head: () => ({ meta: [{ title: "Analytics — SaaS Radar AI" }] }),
});

function Analytics() {
  const { data: feed = [] } = useQuery({
    queryKey: ["feed"],
    queryFn: () => fetchFeed(),
    staleTime: 0,
  });

  const avgScore = feed.length
    ? (feed.reduce((s, i) => s + i.score, 0) / feed.length).toFixed(1)
    : "—";
  const breakouts = feed.filter((s) => s.score >= 85).length;
  const topGrowth = feed.length
    ? Math.max(...feed.map((s) => s.growth)).toFixed(0)
    : "—";

  const KPIS = [
    { i: Activity, l: "Signals in feed", v: String(feed.length), d: "Updated today", up: true },
    { i: Zap, l: "Top growth signal", v: `+${topGrowth}%`, d: "Best performer", up: true },
    { i: TrendingUp, l: "Avg growth score", v: avgScore, d: "Across all sources", up: true },
    { i: Flame, l: "Breakouts (≥85)", v: String(breakouts), d: "High-confidence signals", up: true },
  ];

  // Source distribution from real feed
  const sourceCounts = feed.reduce<Record<string, number>>((acc, s) => {
    acc[s.source] = (acc[s.source] ?? 0) + 1;
    return acc;
  }, {});
  const total = feed.length || 1;
  const sources = [
    { n: "GitHub", key: "GitHub", c: "var(--source-gh)" },
    { n: "Product Hunt", key: "ProductHunt", c: "var(--source-ph)" },
    { n: "Reddit", key: "Reddit", c: "var(--source-reddit)" },
    { n: "IndieHackers", key: "IndieHackers", c: "var(--source-ih)" },
  ].map((s) => ({
    ...s,
    v: Math.round(((sourceCounts[s.key] ?? 0) / total) * 100),
  })).sort((a, b) => b.v - a.v);

  // Category breakdown from real feed
  const catMap = feed.reduce<Record<string, { count: number; growthSum: number; spark: number[] }>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = { count: 0, growthSum: 0, spark: [] };
    acc[s.category].count++;
    acc[s.category].growthSum += s.growth;
    acc[s.category].spark.push(...(s.spark ?? []).slice(0, 2));
    return acc;
  }, {});
  const catData = Object.entries(catMap).map(([name, d]) => ({
    name,
    count: d.count,
    growth: d.growthSum / d.count,
    spark: d.spark.slice(0, 16),
  })).sort((a, b) => b.growth - a.growth);

  // Chart from real scores
  const chartData = feed.map((s) => s.score);

  return (
    <AppShell title="Analytics" subtitle="Market-wide signal across all sources">
      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {KPIS.map((k) => (
            <div key={k.l} className="rounded-xl border border-border-subtle bg-surface p-5">
              <div className="flex items-center justify-between">
                <span className="grid h-8 w-8 place-items-center rounded-md bg-primary/15 text-primary"><k.i className="h-4 w-4" /></span>
                <span className={`font-mono text-xs ${k.up ? "text-primary" : "text-destructive"}`}>{k.d}</span>
              </div>
              <div className="mt-4 font-mono text-2xl font-semibold">{k.v}</div>
              <div className="text-xs text-muted-foreground">{k.l}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-xl border border-border-subtle bg-surface p-5">
            <div className="mb-4 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Score distribution — current feed
            </div>
            <BigChart data={chartData.length > 1 ? chartData : [50, 60, 55, 70, 65, 80, 75, 90]} />
          </div>

          <div className="rounded-xl border border-border-subtle bg-surface p-5">
            <div className="mb-4 text-xs font-mono uppercase tracking-wider text-muted-foreground">Source mix</div>
            <div className="space-y-3">
              {sources.map((s) => (
                <div key={s.n}>
                  <div className="flex justify-between text-xs">
                    <span>{s.n}</span>
                    <span className="font-mono text-muted-foreground">{s.v}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full transition-all" style={{ width: `${s.v}%`, backgroundColor: s.c }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {catData.length > 0 && (
          <div className="rounded-xl border border-border-subtle bg-surface">
            <div className="flex items-center justify-between border-b border-border-subtle p-5">
              <div>
                <h2 className="text-sm font-semibold">Trending categories</h2>
                <p className="text-xs text-muted-foreground">Ranked by average growth across detected signals</p>
              </div>
              <span className="font-mono text-xs text-muted-foreground">{catData.length} tracked</span>
            </div>
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">#</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Signals</th>
                  <th className="px-5 py-3">Avg growth</th>
                  <th className="px-5 py-3">Trend</th>
                </tr>
              </thead>
              <tbody>
                {catData.map((c, i) => (
                  <tr key={c.name} className="border-t border-border-subtle">
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</td>
                    <td className="px-5 py-3 font-medium">{c.name}</td>
                    <td className="px-5 py-3 font-mono text-muted-foreground">{c.count}</td>
                    <td className="px-5 py-3 font-mono text-primary">+{c.growth.toFixed(0)}%</td>
                    <td className="px-5 py-3">
                      {c.spark.length > 1 && <Sparkline data={c.spark} width={140} height={28} />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function BigChart({ data }: { data: number[] }) {
  const w = 700, h = 220;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${h - ((v - min) / range) * (h - 30) - 15}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      <defs>
        <linearGradient id="ag" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1="0" x2={w} y1={(h / 4) * i + 10} y2={(h / 4) * i + 10} stroke="var(--border)" strokeDasharray="2 4" />
      ))}
      <polygon points={`0,${h} ${points} ${w},${h}`} fill="url(#ag)" />
      <polyline points={points} fill="none" stroke="var(--primary)" strokeWidth={2} />
    </svg>
  );
}

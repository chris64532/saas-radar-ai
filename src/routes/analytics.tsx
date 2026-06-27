import { createFileRoute } from "@tanstack/react-router";
import { Activity, TrendingUp, Users, Zap } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CATEGORIES, SAAS } from "@/lib/mock-saas";
import { Sparkline } from "@/components/sparkline";

export const Route = createFileRoute("/analytics")({
  component: Analytics,
  head: () => ({ meta: [{ title: "Analytics — SaaS Radar AI" }] }),
});

const KPIS = [
  { i: Activity, l: "SaaS scanned (30d)", v: "38,142", d: "+12.4%", up: true },
  { i: Zap, l: "New launches", v: "1,284", d: "+18.7%", up: true },
  { i: TrendingUp, l: "Avg growth score", v: "67.3", d: "+2.1", up: true },
  { i: Users, l: "Breakouts (>85)", v: "47", d: "-3", up: false },
];

function gen(seed: number, n = 24, base = 40, amp = 50) {
  let s = seed;
  return Array.from({ length: n }, () => {
    s = (s * 9301 + 49297) % 233280;
    return base + (s / 233280) * amp;
  });
}

function Analytics() {
  const catData = CATEGORIES.map((c, i) => {
    const inCat = SAAS.filter((s) => s.category === c);
    return {
      name: c,
      count: 80 + i * 18,
      growth: inCat.reduce((a, s) => a + s.growth, 0) / Math.max(1, inCat.length),
      spark: gen(i + 3),
    };
  }).sort((a, b) => b.growth - a.growth);

  return (
    <AppShell title="Analytics" subtitle="Market-wide signal across the SaaS galaxy">
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
            <div className="mb-4 flex items-center justify-between">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Market activity — 90 days</div>
              <div className="flex gap-1 text-xs">
                {["7D", "30D", "90D"].map((t, i) => (
                  <button key={t} className={`rounded-md px-2 py-0.5 ${i === 2 ? "bg-primary/15 text-primary" : "text-muted-foreground"}`}>{t}</button>
                ))}
              </div>
            </div>
            <BigChart data={gen(7, 60, 60, 40)} />
          </div>

          <div className="rounded-xl border border-border-subtle bg-surface p-5">
            <div className="mb-4 text-xs font-mono uppercase tracking-wider text-muted-foreground">Source mix</div>
            <div className="space-y-3">
              {[
                { n: "Product Hunt", v: 38, c: "var(--source-ph)" },
                { n: "GitHub", v: 27, c: "var(--source-gh)" },
                { n: "Reddit", v: 21, c: "var(--source-reddit)" },
                { n: "IndieHackers", v: 14, c: "var(--source-ih)" },
              ].map((s) => (
                <div key={s.n}>
                  <div className="flex justify-between text-xs"><span>{s.n}</span><span className="font-mono text-muted-foreground">{s.v}%</span></div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full" style={{ width: `${s.v * 2.5}%`, backgroundColor: s.c }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border-subtle bg-surface">
          <div className="flex items-center justify-between border-b border-border-subtle p-5">
            <div>
              <h2 className="text-sm font-semibold">Trending categories</h2>
              <p className="text-xs text-muted-foreground">Ranked by average growth score across the last 30 days</p>
            </div>
            <span className="font-mono text-xs text-muted-foreground">{CATEGORIES.length} tracked</span>
          </div>
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-5 py-3">#</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">SaaS tracked</th><th className="px-5 py-3">Avg growth</th><th className="px-5 py-3">30d trend</th></tr>
            </thead>
            <tbody>
              {catData.map((c, i) => (
                <tr key={c.name} className="border-t border-border-subtle">
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</td>
                  <td className="px-5 py-3 font-medium">{c.name}</td>
                  <td className="px-5 py-3 font-mono text-muted-foreground">{c.count}</td>
                  <td className="px-5 py-3 font-mono text-primary">+{c.growth.toFixed(0)}%</td>
                  <td className="px-5 py-3"><Sparkline data={c.spark} width={140} height={28} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

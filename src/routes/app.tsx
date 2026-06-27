import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAiSummary } from "@/lib/ai-summary";
import { fetchFeed, type FeedItem } from "@/lib/fetch-feed";
import {
  Activity,
  ArrowUpRight,
  Bell,
  BellRing,
  Cpu,
  Filter,
  Flame,
  Gem,
  Github,
  Globe,
  LineChart,
  Mail,
  Radar,
  Rocket,
  Search,
  Settings,
  Sparkles,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/app")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "SaaS Radar AI — Live discovery terminal" },
      {
        name: "description",
        content:
          "Real-time intelligence on emerging SaaS — AI-scored growth signals from Product Hunt, GitHub, Reddit and Indie Hackers.",
      },
    ],
  }),
});

type Source = "GitHub" | "ProductHunt" | "Reddit" | "IndieHackers";
type Tag = "HOT" | "RISING" | "GEM" | null;

interface SaaSItem {
  rank: number;
  name: string;
  tagline: string;
  category: string;
  score: number;
  growth: number;
  source: Source;
  tag: Tag;
  spark: number[];
  initials: string;
  tint: string;
  ai_summary?: string;
}

function toTag(score: number): Tag {
  if (score >= 88) return "HOT";
  if (score >= 75) return "RISING";
  if (score >= 60) return "GEM";
  return null;
}

function toTint(source: Source): string {
  return {
    GitHub: "from-emerald-400/30 to-emerald-500/5",
    ProductHunt: "from-sky-400/30 to-sky-500/5",
    Reddit: "from-orange-400/30 to-orange-500/5",
    IndieHackers: "from-fuchsia-400/30 to-fuchsia-500/5",
  }[source];
}

function feedItemToSaaSItem(item: FeedItem, rank: number): SaaSItem {
  const source = item.source as Source;
  return {
    rank,
    name: item.name,
    tagline: item.tagline,
    category: item.category,
    score: item.score,
    growth: item.growth,
    source,
    tag: toTag(item.score),
    spark: item.spark,
    initials: item.name.slice(0, 2).toUpperCase(),
    tint: toTint(source),
    ai_summary: item.ai_summary,
  };
}

const CATEGORIES = [
  { name: "All Sectors", count: 1204, active: true },
  { name: "Artificial Intelligence", count: 412 },
  { name: "Developer Tools", count: 286 },
  { name: "Marketing Stack", count: 198 },
  { name: "Fintech", count: 142 },
  { name: "No-Code", count: 96 },
];

const PLANS = [
  {
    name: "Free",
    price: "€0",
    tag: null,
    perks: ["Trending list (limited)", "Daily digest", "Basic filters"],
    cta: "Current plan",
    highlight: false,
  },
  {
    name: "Pro",
    price: "€19",
    tag: "Popular",
    perks: ["Full SaaS scoring", "Email alerts", "All category filters"],
    cta: "Upgrade",
    highlight: true,
  },
  {
    name: "Premium",
    price: "€49",
    tag: null,
    perks: ["Real-time alerts", "Hidden Gems access", "Advanced analytics"],
    cta: "Upgrade",
    highlight: false,
  },
  {
    name: "Business",
    price: "€99+",
    tag: null,
    perks: ["API access", "CSV/Webhook export", "Team seats"],
    cta: "Contact sales",
    highlight: false,
  },
];

function Dashboard() {
  const { data: rawFeed = [] } = useQuery({
    queryKey: ["feed"],
    queryFn: () => fetchFeed(),
    staleTime: 5 * 60 * 1000,
  });

  const FEED: SaaSItem[] = rawFeed.map((item, i) => feedItemToSaaSItem(item, i + 1));

  const [selected, setSelected] = useState<SaaSItem | null>(null);
  const activeItem = selected ?? FEED[0] ?? null;
  const [category, setCategory] = useState("All Sectors");
  const filtered = useMemo(
    () =>
      category === "All Sectors"
        ? FEED
        : FEED.filter((s) =>
            category.toLowerCase().includes(s.category.toLowerCase()),
          ),
    [category, FEED],
  );

  return (
    <div className="min-h-screen flex text-foreground font-sans">
      <Sidebar category={category} onChange={setCategory} />

      <main className="flex-1 min-w-0 flex flex-col">
        <TopBar />
        <Ticker />

        <div className="flex-1 px-8 py-8 space-y-10 max-w-[1600px] w-full mx-auto">
          <Hero />
          <MetricsRow />
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
            <FeedTable
              items={filtered}
              selected={activeItem}
              onSelect={setSelected}
            />
            {activeItem && <DetailPanel item={activeItem} />}
          </div>
          <AlertsAndPricing />
          <Footer />
        </div>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sidebar                                                            */
/* ------------------------------------------------------------------ */

function Sidebar({
  category,
  onChange,
}: {
  category: string;
  onChange: (c: string) => void;
}) {
  return (
    <aside className="hidden lg:flex w-64 shrink-0 border-r border-border-subtle bg-background/60 backdrop-blur-xl flex-col sticky top-0 h-screen">
      <div className="p-5 flex items-center gap-3 border-b border-border-subtle">
        <div className="relative size-9 rounded-lg bg-primary/15 ring-1 ring-primary/30 grid place-items-center">
          <Radar className="size-4 text-primary" />
          <span className="absolute inset-0 rounded-lg ring-1 ring-primary/40 [animation:radar-sweep_4s_linear_infinite] opacity-50" />
        </div>
        <div>
          <div className="text-sm font-bold tracking-tight">SaaS Radar AI</div>
          <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
            v4.0.2 · LIVE
          </div>
        </div>
      </div>

      <nav className="p-3 space-y-0.5">
        <SideLink icon={Activity} label="Discovery Feed" active />
        <SideLink icon={TrendingUp} label="Rising Fast" />
        <SideLink icon={Gem} label="Hidden Gems" badge="PRO" />
        <SideLink icon={Bell} label="Alerts" badge="3" />
        <SideLink icon={LineChart} label="Analytics" />
        <SideLink icon={Cpu} label="API & Webhooks" badge="BIZ" />
      </nav>

      <div className="px-3 mt-2">
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground px-2 py-2">
          Sectors
        </div>
        <div className="space-y-0.5">
          {CATEGORIES.map((c) => {
            const isActive = c.name === category;
            return (
              <button
                key={c.name}
                onClick={() => onChange(c.name)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <span className="truncate">{c.name}</span>
                <span className="text-[10px] font-mono opacity-70">
                  {c.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-auto p-4">
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="size-3.5 text-primary" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary">
              Pro Signal
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            Unlock real-time alerts, Hidden Gems and full scoring.
          </p>
          <button className="w-full rounded-md bg-primary text-primary-foreground text-xs font-semibold py-2 hover:brightness-110 transition">
            Upgrade — €19/mo
          </button>
        </div>
      </div>
    </aside>
  );
}

function SideLink({
  icon: Icon,
  label,
  active,
  badge,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  badge?: string;
}) {
  return (
    <a
      href="#"
      className={`flex items-center justify-between gap-3 px-2.5 py-2 rounded-md text-sm transition-colors ${
        active
          ? "bg-white/5 text-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
      }`}
    >
      <span className="flex items-center gap-2.5">
        <Icon className="size-4" />
        {label}
      </span>
      {badge && (
        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-border-subtle text-muted-foreground">
          {badge}
        </span>
      )}
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Top bar + ticker                                                   */
/* ------------------------------------------------------------------ */

function TopBar() {
  return (
    <header className="h-14 border-b border-border-subtle flex items-center px-6 gap-4 sticky top-0 z-40 bg-background/80 backdrop-blur-xl">
      <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
        <span className="size-1.5 rounded-full bg-primary live-dot" />
        <span className="uppercase tracking-widest">SCANNING_842_SOURCES</span>
      </div>
      <div className="h-4 w-px bg-border-subtle" />
      <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
        MARKET · HIGH VOLATILITY
      </div>

      <div className="ml-auto flex items-center gap-2 max-w-md w-full">
        <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-border-subtle ring-1 ring-black/10 focus-within:ring-primary/30 transition">
          <Search className="size-3.5 text-muted-foreground" />
          <input
            placeholder="Search signals, domains, founders…"
            className="bg-transparent text-sm w-full outline-none placeholder:text-muted-foreground/60"
          />
          <kbd className="hidden sm:inline-block text-[10px] font-mono text-muted-foreground border border-border-subtle rounded px-1.5 py-0.5">
            ⌘K
          </kbd>
        </div>
      </div>

      <button className="size-9 grid place-items-center rounded-md border border-border-subtle hover:bg-white/5 transition">
        <Bell className="size-4 text-muted-foreground" />
      </button>
      <button className="size-9 grid place-items-center rounded-md border border-border-subtle hover:bg-white/5 transition">
        <Settings className="size-4 text-muted-foreground" />
      </button>
      <div className="size-9 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 border border-border-subtle" />
    </header>
  );
}

function Ticker() {
  const items = [
    { label: "FluxFlow AI", v: "+412%", up: true },
    { label: "VectorShift", v: "+284%", up: true },
    { label: "OmniCRM", v: "+188%", up: true },
    { label: "StackLock", v: "+142%", up: true },
    { label: "PromptLayer", v: "+88%", up: true },
    { label: "FluxDB.io", v: "+67%", up: true },
    { label: "LegacyTool", v: "-12%", up: false },
    { label: "QueryLayer", v: "+54%", up: true },
  ];
  const row = [...items, ...items];
  return (
    <div className="h-9 border-b border-border-subtle bg-background/40 overflow-hidden relative">
      <div className="ticker-track flex items-center gap-8 h-full whitespace-nowrap px-6 font-mono text-[11px]">
        {row.map((i, idx) => (
          <span key={idx} className="flex items-center gap-2 text-muted-foreground">
            <span className="text-foreground">{i.label}</span>
            <span className={i.up ? "text-primary" : "text-destructive"}>
              {i.v}
            </span>
            <span className="text-border">·</span>
          </span>
        ))}
      </div>
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                               */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-primary/20 bg-primary/5 text-[11px] font-mono uppercase tracking-widest text-primary mb-4">
          <span className="size-1.5 rounded-full bg-primary live-dot" />
          Discovery Engine · 1,204 live signals
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-balance">
          The Bloomberg terminal
          <br />
          for emerging{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            SaaS startups
          </span>
          .
        </h1>
        <p className="mt-3 text-muted-foreground max-w-xl text-pretty">
          AI-scored intelligence on every new SaaS hitting Product Hunt, GitHub,
          Reddit and Indie Hackers — before they go mainstream.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button className="px-4 py-2.5 rounded-lg border border-border-subtle bg-white/5 hover:bg-white/10 transition text-sm font-medium flex items-center gap-2">
          <Filter className="size-4" /> Filters
        </button>
        <button className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:brightness-110 transition text-sm font-semibold flex items-center gap-2">
          <Rocket className="size-4" /> Upgrade to Pro
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Metrics                                                            */
/* ------------------------------------------------------------------ */

function MetricsRow() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label="New detections · 24h"
        value="+142"
        delta="+12% vs yesterday"
        accent="primary"
        icon={Zap}
      />
      <MetricCard
        label="Avg. Growth Score"
        value="68.4"
        delta="Median sector velocity"
        accent="accent"
        icon={Activity}
        progress={68}
      />
      <MetricCard
        label="Hidden Gems uncovered"
        value="11"
        delta="2 in the last hour"
        accent="gem"
        icon={Gem}
      />
      <MetricCard
        label="Signal latency"
        value="4.2s"
        delta="Real-time pipeline"
        accent="warn"
        icon={Cpu}
      />
    </div>
  );
}

function MetricCard({
  label,
  value,
  delta,
  accent,
  icon: Icon,
  progress,
}: {
  label: string;
  value: string;
  delta: string;
  accent: "primary" | "accent" | "gem" | "warn";
  icon: React.ComponentType<{ className?: string }>;
  progress?: number;
}) {
  const tone = {
    primary: "text-primary bg-primary/10 ring-primary/20",
    accent: "text-accent bg-accent/10 ring-accent/20",
    gem: "text-signal-gem bg-signal-gem/10 ring-signal-gem/20",
    warn: "text-signal-warn bg-signal-warn/10 ring-signal-warn/20",
  }[accent];

  return (
    <div className="relative rounded-2xl border border-border-subtle bg-surface/60 backdrop-blur p-5 overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={`size-8 grid place-items-center rounded-lg ring-1 ${tone}`}>
          <Icon className="size-4" />
        </span>
      </div>
      <div className="text-3xl font-bold font-mono tracking-tight">{value}</div>
      <div className="mt-2 text-[11px] font-mono text-muted-foreground">{delta}</div>
      {progress !== undefined && (
        <div className="mt-3 h-1 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent to-primary"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Feed table                                                         */
/* ------------------------------------------------------------------ */

function FeedTable({
  items,
  selected,
  onSelect,
}: {
  items: SaaSItem[];
  selected: SaaSItem | null;
  onSelect: (i: SaaSItem) => void;
}) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface/60 backdrop-blur overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <Flame className="size-4 text-primary" />
          <h2 className="text-sm font-semibold tracking-tight">
            Live Terminal Feed
          </h2>
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground border border-border-subtle rounded px-1.5 py-0.5">
            {items.length} signals
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
          <span>SORT</span>
          <select className="bg-background/60 border border-border-subtle rounded px-2 py-1 outline-none text-foreground">
            <option>Score · High→Low</option>
            <option>Growth 7D</option>
            <option>Most recent</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground bg-white/[0.02]">
              <th className="px-5 py-3 font-medium w-12">#</th>
              <th className="px-3 py-3 font-medium">Product</th>
              <th className="px-3 py-3 font-medium w-36">Score</th>
              <th className="px-3 py-3 font-medium w-28">7D Velocity</th>
              <th className="px-3 py-3 font-medium w-28">Trend</th>
              <th className="px-3 py-3 font-medium w-32">Source</th>
              <th className="px-5 py-3 font-medium w-10" />
            </tr>
          </thead>
          <tbody>
            {items.map((i) => {
              const active = selected ? i.name === selected.name : false;
              return (
                <tr
                  key={i.name}
                  onClick={() => onSelect(i)}
                  className={`group cursor-pointer border-t border-border-subtle transition-colors ${
                    active ? "bg-primary/[0.06]" : "hover:bg-white/[0.03]"
                  }`}
                >
                  <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                    {String(i.rank).padStart(2, "0")}
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-9 rounded-lg bg-gradient-to-br ${i.tint} ring-1 ring-white/10 grid place-items-center font-bold text-xs`}
                      >
                        {i.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium flex items-center gap-2">
                          {i.name}
                          <TagPill tag={i.tag} />
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate">
                          {i.tagline} · {i.category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <ScoreBar score={i.score} />
                  </td>
                  <td className="px-3 py-4">
                    <span className="font-mono text-xs text-primary">
                      +{i.growth.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <Sparkline data={i.spark} />
                  </td>
                  <td className="px-3 py-4">
                    <SourceBadge source={i.source} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-foreground transition" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TagPill({ tag }: { tag: Tag }) {
  if (!tag) return null;
  const map = {
    HOT: "bg-signal-hot/15 text-signal-hot ring-signal-hot/30",
    RISING: "bg-signal-rising/15 text-signal-rising ring-signal-rising/30",
    GEM: "bg-signal-gem/15 text-signal-gem ring-signal-gem/30",
  } as const;
  return (
    <span
      className={`text-[9px] font-mono font-bold tracking-widest px-1.5 py-0.5 rounded ring-1 ${map[tag]}`}
    >
      {tag}
    </span>
  );
}

function ScoreBar({ score }: { score: number }) {
  const tone =
    score >= 90
      ? "from-signal-hot to-primary"
      : score >= 80
        ? "from-accent to-signal-rising"
        : score >= 70
          ? "from-signal-gem to-accent"
          : "from-muted-foreground to-muted-foreground";
  const text =
    score >= 90
      ? "text-signal-hot"
      : score >= 80
        ? "text-signal-rising"
        : score >= 70
          ? "text-signal-gem"
          : "text-foreground";
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${tone}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`font-mono text-sm font-bold ${text} w-7 text-right`}>
        {score}
      </span>
    </div>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 90;
  const h = 28;
  const step = w / (data.length - 1);
  const norm = (v: number) =>
    h - ((v - min) / Math.max(1, max - min)) * (h - 4) - 2;
  const d = data
    .map((v, i) => `${i === 0 ? "M" : "L"} ${i * step} ${norm(v)}`)
    .join(" ");
  const area = `${d} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id="spk" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.78 0.18 162)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="oklch(0.78 0.18 162)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spk)" />
      <path
        d={d}
        stroke="oklch(0.78 0.18 162)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SourceBadge({ source }: { source: Source }) {
  const conf = {
    GitHub: {
      label: "GITHUB",
      icon: Github,
      cls: "text-source-gh bg-source-gh/10 ring-source-gh/30",
    },
    ProductHunt: {
      label: "PH",
      icon: Rocket,
      cls: "text-source-ph bg-source-ph/10 ring-source-ph/30",
    },
    Reddit: {
      label: "REDDIT",
      icon: Globe,
      cls: "text-source-reddit bg-source-reddit/10 ring-source-reddit/30",
    },
    IndieHackers: {
      label: "IH",
      icon: Sparkles,
      cls: "text-source-ih bg-source-ih/10 ring-source-ih/30",
    },
  }[source];
  const Icon = conf.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ring-1 ${conf.cls}`}
    >
      <Icon className="size-3" />
      {conf.label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Detail panel                                                       */
/* ------------------------------------------------------------------ */

function DetailPanel({ item }: { item: SaaSItem }) {
  const factors = [
    { label: "Traffic Growth", value: 94 },
    { label: "Backlink Velocity", value: 86 },
    { label: "Social Mentions", value: 78 },
    { label: "Launch Credibility", value: 71 },
    { label: "Landing Page Quality (AI)", value: 88 },
  ];

  // Use pre-computed summary from DB if available, otherwise call AI on demand
  const { data: summary, isLoading } = useQuery({
    queryKey: ["ai-summary", item.name],
    queryFn: () =>
      item.ai_summary
        ? Promise.resolve(item.ai_summary)
        : fetchAiSummary({
            data: {
              name: item.name,
              tagline: item.tagline,
              category: item.category,
              source: item.source,
              score: item.score,
              growth: item.growth,
            },
          }),
    staleTime: Infinity,
  });

  return (
    <aside className="rounded-2xl border border-border-subtle bg-surface/60 backdrop-blur p-5 space-y-6 h-fit sticky top-24">
      <div className="flex items-start gap-3">
        <div
          className={`size-12 rounded-xl bg-gradient-to-br ${item.tint} ring-1 ring-white/10 grid place-items-center font-bold`}
        >
          {item.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold tracking-tight">{item.name}</h3>
            <TagPill tag={item.tag} />
          </div>
          <p className="text-[11px] text-muted-foreground">{item.tagline}</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Score
          </div>
          <div className="text-2xl font-bold font-mono text-primary leading-none">
            {item.score}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-background/60 border border-border-subtle p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Growth — last 7 days
          </span>
          <span className="text-[11px] font-mono text-primary">
            +{item.growth.toFixed(1)}%
          </span>
        </div>
        <BigSparkline data={item.spark} />
      </div>

      <div>
        <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">
          AI Score Breakdown
        </div>
        <div className="space-y-2.5">
          {factors.map((f) => (
            <div key={f.label} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{f.label}</span>
                <span className="font-mono">{f.value}</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent to-primary"
                  style={{ width: `${f.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border-subtle bg-background/40 p-4">
        <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
          AI Summary
        </div>
        {isLoading ? (
          <div className="space-y-1.5 animate-pulse">
            <div className="h-2.5 w-full rounded bg-white/5" />
            <div className="h-2.5 w-5/6 rounded bg-white/5" />
            <div className="h-2.5 w-4/6 rounded bg-white/5" />
          </div>
        ) : (
          <p className="text-xs leading-relaxed text-foreground/90">{summary}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button className="rounded-lg bg-primary text-primary-foreground text-xs font-semibold py-2.5 flex items-center justify-center gap-1.5 hover:brightness-110 transition">
          <BellRing className="size-3.5" /> Set Alert
        </button>
        <button className="rounded-lg border border-border-subtle bg-white/5 text-xs font-semibold py-2.5 flex items-center justify-center gap-1.5 hover:bg-white/10 transition">
          <ArrowUpRight className="size-3.5" /> Open report
        </button>
      </div>
    </aside>
  );
}

function BigSparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 360;
  const h = 96;
  const step = w / (data.length - 1);
  const norm = (v: number) =>
    h - ((v - min) / Math.max(1, max - min)) * (h - 12) - 6;
  const d = data
    .map((v, i) => `${i === 0 ? "M" : "L"} ${i * step} ${norm(v)}`)
    .join(" ");
  const area = `${d} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-24">
      <defs>
        <linearGradient id="bigspk" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.78 0.18 162)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="oklch(0.78 0.18 162)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((y) => (
        <line
          key={y}
          x1="0"
          x2={w}
          y1={h * y}
          y2={h * y}
          stroke="white"
          strokeOpacity="0.04"
          strokeDasharray="2 4"
        />
      ))}
      <path d={area} fill="url(#bigspk)" />
      <path
        d={d}
        stroke="oklch(0.78 0.18 162)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Alerts + Pricing                                                   */
/* ------------------------------------------------------------------ */

function AlertsAndPricing() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_2fr] gap-6">
      <AlertsCard />
      <PricingCard />
    </div>
  );
}

function AlertsCard() {
  const alerts = [
    {
      icon: Mail,
      title: "New SaaS · AI category",
      desc: "Email digest every morning",
      on: true,
    },
    {
      icon: Flame,
      title: "Fast-growing (+200%)",
      desc: "Real-time push",
      on: true,
    },
    {
      icon: Gem,
      title: "Hidden Gems",
      desc: "Pro · Weekly summary",
      on: false,
    },
    {
      icon: Wallet,
      title: "Competitor in niche",
      desc: "Tracked: 4 keywords",
      on: true,
    },
  ];
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface/60 backdrop-blur p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="size-4 text-accent" />
          <h3 className="text-sm font-semibold">Alerts</h3>
        </div>
        <button className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition">
          Configure
        </button>
      </div>
      <div className="space-y-2">
        {alerts.map((a) => (
          <div
            key={a.title}
            className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border-subtle bg-background/40"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="size-8 rounded-lg bg-white/5 grid place-items-center text-muted-foreground">
                <a.icon className="size-4" />
              </span>
              <div className="min-w-0">
                <div className="text-sm truncate">{a.title}</div>
                <div className="text-[11px] text-muted-foreground truncate">
                  {a.desc}
                </div>
              </div>
            </div>
            <Toggle on={a.on} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <span
      className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors ${
        on ? "bg-primary" : "bg-white/10"
      }`}
    >
      <span
        className={`absolute top-0.5 size-4 rounded-full bg-background shadow transition-all ${
          on ? "left-[18px]" : "left-0.5"
        }`}
      />
    </span>
  );
}

function PricingCard() {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface/60 backdrop-blur p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wallet className="size-4 text-primary" />
          <h3 className="text-sm font-semibold">Access tiers</h3>
        </div>
        <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
          Monthly · EUR
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {PLANS.map((p) => (
          <div
            key={p.name}
            className={`relative rounded-xl p-4 border flex flex-col ${
              p.highlight
                ? "border-primary/40 bg-primary/[0.06] ring-1 ring-primary/30"
                : "border-border-subtle bg-background/40"
            }`}
          >
            {p.tag && (
              <span className="absolute -top-2 right-3 text-[9px] font-mono font-bold tracking-widest px-1.5 py-0.5 rounded bg-primary text-primary-foreground">
                {p.tag}
              </span>
            )}
            <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              {p.name}
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono">{p.price}</span>
              <span className="text-[11px] text-muted-foreground">/mo</span>
            </div>
            <ul className="mt-3 space-y-1.5 flex-1">
              {p.perks.map((perk) => (
                <li
                  key={perk}
                  className="text-[11px] text-muted-foreground flex items-start gap-1.5"
                >
                  <span className="mt-1 size-1 rounded-full bg-primary shrink-0" />
                  {perk}
                </li>
              ))}
            </ul>
            <button
              className={`mt-4 w-full text-xs font-semibold py-2 rounded-md transition ${
                p.highlight
                  ? "bg-primary text-primary-foreground hover:brightness-110"
                  : "border border-border-subtle bg-white/5 hover:bg-white/10"
              }`}
            >
              {p.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="pt-8 border-t border-border-subtle flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] font-mono text-muted-foreground">
      <div className="flex items-center gap-2">
        <Radar className="size-3.5 text-primary" />
        SaaS Radar AI · scanning 842 sources · v4.0.2
      </div>
      <div className="flex gap-4 uppercase tracking-widest">
        <a href="#" className="hover:text-foreground">API</a>
        <a href="#" className="hover:text-foreground">Docs</a>
        <a href="#" className="hover:text-foreground">Privacy</a>
        <a href="#" className="hover:text-foreground">Terms</a>
      </div>
    </footer>
  );
}

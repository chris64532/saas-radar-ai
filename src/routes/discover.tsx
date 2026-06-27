import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { fetchFeed } from "@/lib/fetch-feed";
import { SOURCES } from "@/lib/mock-saas";

export const Route = createFileRoute("/discover")({
  component: Discover,
  head: () => ({ meta: [{ title: "Discover SaaS — Radar AI" }] }),
});

function Discover() {
  const { data: feed = [] } = useQuery({
    queryKey: ["feed"],
    queryFn: () => fetchFeed(),
    staleTime: 5 * 60 * 1000,
  });

  const categories = useMemo(() => [...new Set(feed.map((s) => s.category))].sort(), [feed]);

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [minScore, setMinScore] = useState(0);
  const [sort, setSort] = useState<"growth" | "score">("score");

  const filtered = useMemo(() => {
    const list = feed.filter((s) =>
      (!q || s.name.toLowerCase().includes(q.toLowerCase()) || s.tagline.toLowerCase().includes(q.toLowerCase())) &&
      (!cat || s.category === cat) &&
      (!src || s.source === src) &&
      s.score >= minScore
    );
    if (sort === "growth") list.sort((a, b) => b.growth - a.growth);
    else list.sort((a, b) => b.score - a.score);
    return list;
  }, [feed, q, cat, src, minScore, sort]);

  return (
    <AppShell title="Discover" subtitle={`${filtered.length} signals matching your filters`}>
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-5 rounded-xl border border-border-subtle bg-surface p-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
          </div>
          <FilterGroup label="Category">
            <Chip active={!cat} onClick={() => setCat(null)}>All</Chip>
            {categories.map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}
          </FilterGroup>
          <FilterGroup label="Source">
            <Chip active={!src} onClick={() => setSrc(null)}>All</Chip>
            {SOURCES.map((s) => <Chip key={s} active={src === s} onClick={() => setSrc(s)}>{s}</Chip>)}
          </FilterGroup>
          <FilterGroup label={`Min score: ${minScore}`}>
            <input type="range" min={0} max={100} value={minScore} onChange={(e) => setMinScore(+e.target.value)} className="w-full accent-[color:var(--primary)]" />
          </FilterGroup>
        </aside>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, tagline, category…"
                className="w-full rounded-lg border border-border bg-surface py-2.5 pl-9 pr-3 text-sm placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none"
              />
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value as never)} className="rounded-lg border border-border bg-surface px-3 py-2.5 text-sm">
              <option value="score">Highest score</option>
              <option value="growth">Fastest growing</option>
            </select>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((s) => (
              <Link key={s.id} to="/saas/$id" params={{ id: s.id }}>
                <div className="group block rounded-xl border border-border-subtle bg-surface p-4 transition-all hover:border-primary/40 hover:bg-surface-elevated cursor-pointer">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 font-mono text-sm font-bold">
                        {s.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{s.name}</div>
                        <div className="text-xs text-muted-foreground">{s.tagline}</div>
                      </div>
                    </div>
                    <span className="font-mono text-sm font-bold text-primary">{s.score}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{s.category}</span>
                      <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{s.source}</span>
                    </div>
                    <span className="font-mono text-xs text-primary">+{s.growth.toFixed(0)}%</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-xs font-medium text-muted-foreground">{label}</div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`rounded-full px-2.5 py-1 text-xs ${active ? "bg-primary/15 text-primary ring-1 ring-primary/30" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
      {children}
    </button>
  );
}

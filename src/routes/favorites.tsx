import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bookmark, Search, Trash2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { SaasCard } from "@/components/saas-card";
import { SAAS } from "@/lib/mock-saas";

export const Route = createFileRoute("/favorites")({
  component: Favorites,
  head: () => ({ meta: [{ title: "Favorites — SaaS Radar AI" }] }),
});

function Favorites() {
  const [saved, setSaved] = useState(SAAS.slice(0, 6).map((s) => s.id));
  const [q, setQ] = useState("");
  const items = SAAS.filter((s) => saved.includes(s.id) && (!q || s.name.toLowerCase().includes(q.toLowerCase())));

  return (
    <AppShell title="Favorites" subtitle={`${saved.length} SaaS bookmarked for deep tracking`}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter your saved SaaS…" className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm focus:border-primary/50 focus:outline-none" />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Bookmark className="h-3.5 w-3.5 text-primary" />
          <span className="font-mono uppercase tracking-wider">Synced · last 2m ago</span>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface/40 p-12 text-center">
          <Bookmark className="mx-auto h-8 w-8 text-muted-foreground/40" />
          <h2 className="mt-4 text-base font-semibold">No favorites yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">Bookmark SaaS from the discovery feed to track them here.</p>
          <Link to="/discover" className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">Browse discovery</Link>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {items.map((s) => (
            <div key={s.id} className="group relative">
              <SaasCard saas={s} />
              <button
                onClick={() => setSaved((p) => p.filter((x) => x !== s.id))}
                className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-md bg-background/80 text-muted-foreground opacity-0 backdrop-blur transition-opacity hover:text-destructive group-hover:opacity-100"
                aria-label="Remove from favorites"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}

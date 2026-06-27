import { Link } from "@tanstack/react-router";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { ScoreRing } from "./score-ring";
import { Sparkline } from "./sparkline";
import { SOURCE_COLOR, type SaasItem } from "@/lib/mock-saas";

export function SaasCard({ saas }: { saas: SaasItem }) {
  return (
    <Link
      to="/saas/$id"
      params={{ id: saas.id }}
      className="group block rounded-xl border border-border-subtle bg-surface p-4 transition-all hover:border-primary/40 hover:bg-surface-elevated"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 font-mono text-sm font-bold text-foreground">
            {saas.name.slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-sm font-semibold">
              {saas.name}
              <ArrowUpRight className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <div className="text-xs text-muted-foreground">{saas.tagline}</div>
          </div>
        </div>
        <ScoreRing score={saas.score} size={48} stroke={4} />
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {saas.category}
          </span>
          <span
            className="rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider"
            style={{ backgroundColor: `color-mix(in oklab, ${SOURCE_COLOR[saas.source]} 18%, transparent)`, color: SOURCE_COLOR[saas.source] }}
          >
            {saas.source}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkline data={saas.spark} width={70} height={24} />
          <span className="flex items-center gap-0.5 font-mono text-xs font-semibold text-primary">
            <TrendingUp className="h-3 w-3" />+{saas.growth}%
          </span>
        </div>
      </div>
    </Link>
  );
}

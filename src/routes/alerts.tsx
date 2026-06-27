import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, BellOff, Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CATEGORIES } from "@/lib/mock-saas";

export const Route = createFileRoute("/alerts")({
  component: Alerts,
  head: () => ({ meta: [{ title: "Alerts — SaaS Radar AI" }] }),
});

type Rule = { id: string; name: string; category: string; minScore: number; spike: number; on: boolean };

const INITIAL: Rule[] = [
  { id: "r1", name: "AI breakouts", category: "AI", minScore: 75, spike: 50, on: true },
  { id: "r2", name: "Dev tools watch", category: "Dev Tools", minScore: 70, spike: 30, on: true },
  { id: "r3", name: "Marketing risers", category: "Marketing", minScore: 60, spike: 40, on: false },
];

const HISTORY: { t: string; saas: string; reason: string; level: string }[] = [];

function Alerts() {
  const [tab, setTab] = useState<"rules" | "history">("rules");
  const [rules, setRules] = useState<Rule[]>(INITIAL);
  const [globalOn, setGlobalOn] = useState(true);

  return (
    <AppShell title="Alerts" subtitle="Get notified the moment SaaS match your radar">
      <div className="mb-5 flex items-center justify-between rounded-xl border border-border-subtle bg-surface p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setGlobalOn(!globalOn)} className={`grid h-9 w-9 place-items-center rounded-lg ${globalOn ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
            {globalOn ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
          </button>
          <div>
            <div className="text-sm font-semibold">Notifications {globalOn ? "enabled" : "paused"}</div>
            <div className="text-xs text-muted-foreground">Email + in-app · Slack integration available on Pro</div>
          </div>
        </div>
        <Toggle on={globalOn} onChange={setGlobalOn} />
      </div>

      <div className="mb-4 inline-flex gap-1 rounded-lg border border-border-subtle bg-surface p-1 text-sm">
        <button onClick={() => setTab("rules")} className={`rounded-md px-4 py-1.5 ${tab === "rules" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>Rules ({rules.length})</button>
        <button onClick={() => setTab("history")} className={`rounded-md px-4 py-1.5 ${tab === "history" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>History</button>
      </div>

      {tab === "rules" ? (
        <div className="space-y-3">
          {rules.map((r) => (
            <div key={r.id} className="grid items-center gap-3 rounded-xl border border-border-subtle bg-surface p-4 md:grid-cols-[1.5fr_1fr_1fr_1fr_auto_auto]">
              <div>
                <div className="text-sm font-semibold">{r.name}</div>
                <div className="text-xs text-muted-foreground">Category trigger</div>
              </div>
              <Pill label="Category" value={r.category} />
              <Pill label="Min score" value={`≥ ${r.minScore}`} />
              <Pill label="Growth spike" value={`+${r.spike}%`} />
              <Toggle on={r.on} onChange={(v) => setRules((p) => p.map((x) => x.id === r.id ? { ...x, on: v } : x))} />
              <button onClick={() => setRules((p) => p.filter((x) => x.id !== r.id))} className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          <div className="rounded-xl border border-dashed border-border bg-surface/40 p-5">
            <div className="mb-3 text-sm font-semibold">New alert rule</div>
            <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr_1fr_auto]">
              <input placeholder="Rule name" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
              <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <input type="number" defaultValue={70} className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
              <input type="number" defaultValue={30} className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
              <button onClick={() => setRules((p) => [...p, { id: `r${Date.now()}`, name: "New rule", category: "AI", minScore: 70, spike: 30, on: true }])} className="inline-flex items-center justify-center gap-1 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90">
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border-subtle">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-3">When</th><th className="px-4 py-3">SaaS</th><th className="px-4 py-3">Reason</th><th className="px-4 py-3">Signal</th></tr>
            </thead>
            <tbody>
              {HISTORY.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    No alerts triggered yet. Set up rules to start receiving notifications.
                  </td>
                </tr>
              ) : HISTORY.map((h, i) => (
                <tr key={i} className="border-t border-border-subtle">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{h.t}</td>
                  <td className="px-4 py-3 font-medium">{h.saas}</td>
                  <td className="px-4 py-3 text-muted-foreground">{h.reason}</td>
                  <td className="px-4 py-3"><span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-mono uppercase text-primary">{h.level}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-xs">
      <div className="font-mono uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-mono text-sm font-semibold">{value}</div>
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} className={`relative h-5 w-9 rounded-full transition-colors ${on ? "bg-primary" : "bg-muted"}`}>
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-background transition-transform ${on ? "translate-x-4" : "translate-x-0.5"}`} />
    </button>
  );
}

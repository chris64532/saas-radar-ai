import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { CATEGORIES } from "@/lib/mock-saas";

export const Route = createFileRoute("/settings")({
  component: Settings,
  head: () => ({ meta: [{ title: "Settings — SaaS Radar AI" }] }),
});

const TABS = ["Profile", "Security", "Notifications", "Categories", "Danger zone"] as const;

function Settings() {
  const [tab, setTab] = useState<typeof TABS[number]>("Profile");
  const [cats, setCats] = useState<string[]>(["AI", "Dev Tools"]);

  return (
    <AppShell title="Settings" subtitle="Manage your account, alerts & preferences">
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav className="space-y-1 rounded-xl border border-border-subtle bg-surface p-2">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`block w-full rounded-md px-3 py-2 text-left text-sm ${tab === t ? (t === "Danger zone" ? "bg-destructive/15 text-destructive" : "bg-primary/10 text-foreground") : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </nav>

        <div className="rounded-xl border border-border-subtle bg-surface p-6">
          {tab === "Profile" && (
            <Panel title="Profile" desc="Your account identity">
              <Row><Label>Full name</Label><input defaultValue="Ada Radar" className={i} /></Row>
              <Row><Label>Email</Label><input defaultValue="ada@startup.com" className={i} /></Row>
              <Row><Label>Role</Label>
                <select className={i}><option>Founder</option><option>Investor</option><option>Marketer</option><option>Researcher</option></select>
              </Row>
              <Save />
            </Panel>
          )}
          {tab === "Security" && (
            <Panel title="Security" desc="Password & 2FA">
              <Row><Label>Current password</Label><input type="password" className={i} /></Row>
              <Row><Label>New password</Label><input type="password" className={i} /></Row>
              <Row><Label>Confirm</Label><input type="password" className={i} /></Row>
              <Row><Label>Two-factor auth</Label>
                <button className="rounded-md border border-border px-3 py-1.5 text-sm hover:border-primary/40">Enable 2FA</button>
              </Row>
              <Save label="Update password" />
            </Panel>
          )}
          {tab === "Notifications" && (
            <Panel title="Notifications" desc="When and how we ping you">
              {["Email digests (daily)", "Email — score breakouts", "Slack — growth spikes", "Push — new launches"].map((l, idx) => (
                <Row key={l}><Label>{l}</Label>
                  <input type="checkbox" defaultChecked={idx < 2} className="h-4 w-4 accent-[color:var(--primary)]" />
                </Row>
              ))}
              <Save />
            </Panel>
          )}
          {tab === "Categories" && (
            <Panel title="Category preferences" desc="Filter your radar by topics that matter to you">
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => {
                  const on = cats.includes(c);
                  return (
                    <button key={c} onClick={() => setCats((p) => on ? p.filter(x => x !== c) : [...p, c])} className={`rounded-full px-3 py-1.5 text-xs ${on ? "bg-primary/15 text-primary ring-1 ring-primary/30" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{c}</button>
                  );
                })}
              </div>
              <Save />
            </Panel>
          )}
          {tab === "Danger zone" && (
            <Panel title="Danger zone" desc="Irreversible actions">
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4">
                <div className="text-sm font-semibold text-destructive">Delete account</div>
                <p className="mt-1 text-xs text-muted-foreground">All your alert rules, saved SaaS and history will be permanently removed.</p>
                <button className="mt-3 rounded-md bg-destructive px-3 py-1.5 text-sm font-medium text-destructive-foreground hover:opacity-90">Delete my account</button>
              </div>
            </Panel>
          )}
        </div>
      </div>
    </AppShell>
  );
}

const i = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm";

function Panel({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      <div className="mt-6 space-y-4">{children}</div>
    </div>
  );
}
function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid items-center gap-3 md:grid-cols-[180px_1fr]">{children}</div>;
}
function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-sm text-muted-foreground">{children}</span>;
}
function Save({ label = "Save changes" }: { label?: string }) {
  return <button className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">{label}</button>;
}

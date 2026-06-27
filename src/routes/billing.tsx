import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, Download, Plus } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/billing")({
  component: Billing,
  head: () => ({ meta: [{ title: "Billing — SaaS Radar AI" }] }),
});

const INVOICES = [
  { id: "INV-2026-006", date: "Jun 01, 2026", amount: "€19.00", status: "Paid" },
  { id: "INV-2026-005", date: "May 01, 2026", amount: "€19.00", status: "Paid" },
  { id: "INV-2026-004", date: "Apr 01, 2026", amount: "€19.00", status: "Paid" },
  { id: "INV-2026-003", date: "Mar 01, 2026", amount: "€19.00", status: "Paid" },
];

function Billing() {
  return (
    <AppShell title="Billing" subtitle="Manage your subscription, payment & invoices">
      <div className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-primary/30 bg-primary/5 p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-primary">Current plan</div>
                <div className="mt-1 text-2xl font-semibold">Pro · €19/mo</div>
                <p className="mt-1 text-sm text-muted-foreground">Renews on July 1, 2026 · Visa ending 4242</p>
              </div>
              <div className="flex gap-2">
                <button className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm hover:border-primary/40">Downgrade</button>
                <button className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90">Upgrade</button>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <Quota label="API calls" used={684} total={1000} />
              <Quota label="Alert rules" used={7} total={10} />
              <Quota label="Exports" used={3} total={20} />
            </div>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-surface p-6">
            <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Payment method</div>
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-border-subtle bg-background p-3">
              <div className="grid h-8 w-12 place-items-center rounded-md bg-gradient-to-br from-accent to-primary text-[10px] font-bold text-primary-foreground">VISA</div>
              <div className="flex-1 font-mono text-sm">•••• •••• •••• 4242</div>
              <span className="text-xs text-muted-foreground">12/27</span>
            </div>
            <button className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground">
              <Plus className="h-4 w-4" /> Add payment method
            </button>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <CreditCard className="h-3.5 w-3.5" /> Secured by Stripe
            </div>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Invoice history</h2>
            <button className="text-xs text-muted-foreground hover:text-foreground">Export all</button>
          </div>
          <div className="overflow-hidden rounded-xl border border-border-subtle">
            <table className="w-full text-sm">
              <thead className="bg-surface text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3">Invoice</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Status</th><th /></tr>
              </thead>
              <tbody>
                {INVOICES.map((inv) => (
                  <tr key={inv.id} className="border-t border-border-subtle">
                    <td className="px-4 py-3 font-mono text-xs">{inv.id}</td>
                    <td className="px-4 py-3 text-muted-foreground">{inv.date}</td>
                    <td className="px-4 py-3 font-mono">{inv.amount}</td>
                    <td className="px-4 py-3"><span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-mono uppercase text-primary">{inv.status}</span></td>
                    <td className="px-4 py-3 text-right"><button className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><Download className="h-3.5 w-3.5" /> PDF</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
          <div className="text-sm font-semibold text-destructive">Cancel subscription</div>
          <p className="mt-1 text-xs text-muted-foreground">You'll keep Pro access until June 30, 2026. After that, your account will revert to Free.</p>
          <button className="mt-3 rounded-md border border-destructive/40 bg-background px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10">Cancel plan</button>
        </div>
      </div>
    </AppShell>
  );
}

function Quota({ label, used, total }: { label: string; used: number; total: number }) {
  const pct = (used / total) * 100;
  return (
    <div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="font-mono">{used}/{total}</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

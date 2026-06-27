import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Minus } from "lucide-react";
import { MarketingNav } from "@/components/marketing-nav";
import { MarketingFooter } from "@/components/marketing-footer";

export const Route = createFileRoute("/pricing")({
  component: Pricing,
  head: () => ({
    meta: [
      { title: "Pricing — SaaS Radar AI" },
      { name: "description", content: "Simple pricing for founders, investors and teams. Free forever plan included." },
    ],
  }),
});

const PLANS = [
  { n: "Free", m: 0, y: 0, d: "For curious operators", cta: "Start free", features: ["Daily top 10 signals", "1 alert rule", "7-day history", "Community support"] },
  { n: "Pro", m: 19, y: 15, d: "For founders & marketers", cta: "Start Pro trial", featured: true, features: ["Full live feed", "10 alert rules", "90-day history", "Growth scores", "API (1k req/day)"] },
  { n: "Premium", m: 49, y: 39, d: "For investors & analysts", cta: "Upgrade to Premium", features: ["Everything in Pro", "Predictive scoring", "CSV / JSON exports", "Custom dashboards", "Priority support"] },
  { n: "Business", m: 99, y: 79, d: "For teams & funds", cta: "Contact sales", features: ["Everything in Premium", "5 team seats", "Dedicated SLA", "SSO & audit logs", "White-label reports"] },
];

const MATRIX: { label: string; vals: (boolean | string)[] }[] = [
  { label: "Live SaaS feed", vals: [true, true, true, true] },
  { label: "AI Growth Score", vals: ["Daily", "Realtime", "Realtime", "Realtime"] },
  { label: "Alert rules", vals: ["1", "10", "50", "Unlimited"] },
  { label: "History", vals: ["7 days", "90 days", "Unlimited", "Unlimited"] },
  { label: "Predictive scoring", vals: [false, false, true, true] },
  { label: "API access", vals: [false, "1k/day", "10k/day", "Custom"] },
  { label: "Team seats", vals: ["1", "1", "3", "5+"] },
  { label: "SSO / SAML", vals: [false, false, false, true] },
];

function Pricing() {
  const [yearly, setYearly] = useState(false);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingNav />
      <section className="border-b border-border-subtle py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="text-xs font-mono uppercase tracking-wider text-primary">Pricing</div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">Plans that scale with your radar</h1>
          <p className="mt-4 text-muted-foreground">Switch any time. Cancel any time. No surprises.</p>
          <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-border-subtle bg-surface p-1 text-xs">
            <button onClick={() => setYearly(false)} className={`rounded-full px-4 py-1.5 ${!yearly ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>Monthly</button>
            <button onClick={() => setYearly(true)} className={`rounded-full px-4 py-1.5 ${yearly ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>Yearly <span className="ml-1 text-[10px] opacity-70">-20%</span></button>
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-7xl gap-4 px-6 md:grid-cols-4">
          {PLANS.map((p) => (
            <div key={p.n} className={`rounded-2xl border p-6 ${p.featured ? "border-primary/50 bg-primary/5 ring-1 ring-primary/30" : "border-border-subtle bg-surface"}`}>
              {p.featured && <div className="mb-3 inline-block rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase text-primary-foreground">Most popular</div>}
              <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{p.n}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-semibold">€{yearly ? p.y : p.m}</span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{p.d}</p>
              <Link to="/signup" className={`mt-5 block rounded-lg px-4 py-2 text-center text-sm font-medium ${p.featured ? "bg-primary text-primary-foreground hover:opacity-90" : "border border-border bg-surface-elevated hover:border-primary/40"}`}>
                {p.cta}
              </Link>
              <ul className="mt-6 space-y-2.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{f}</span></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-border-subtle py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-2xl font-semibold tracking-tight">Compare every feature</h2>
          <div className="mt-10 overflow-hidden rounded-xl border border-border-subtle">
            <table className="w-full text-sm">
              <thead className="bg-surface text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Feature</th>
                  {PLANS.map((p) => <th key={p.n} className="px-4 py-3 text-center">{p.n}</th>)}
                </tr>
              </thead>
              <tbody>
                {MATRIX.map((row) => (
                  <tr key={row.label} className="border-t border-border-subtle">
                    <td className="px-4 py-3 text-muted-foreground">{row.label}</td>
                    {row.vals.map((v, i) => (
                      <td key={i} className="px-4 py-3 text-center font-mono text-xs">
                        {v === true ? <Check className="mx-auto h-4 w-4 text-primary" /> : v === false ? <Minus className="mx-auto h-4 w-4 text-muted-foreground/50" /> : v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center text-2xl font-semibold tracking-tight">FAQ</h2>
          <div className="mt-8 space-y-3">
            {[
              { q: "Can I switch plans later?", a: "Yes — upgrade or downgrade anytime, prorated automatically." },
              { q: "Do you offer a free trial?", a: "Pro and Premium include a 7-day free trial. No card required for Free." },
              { q: "What payment methods?", a: "All major cards via Stripe. Annual invoicing for Business plan." },
              { q: "Can I cancel anytime?", a: "Of course. Cancel in one click from the Billing page." },
            ].map((f) => (
              <details key={f.q} className="group rounded-xl border border-border-subtle bg-surface p-4">
                <summary className="cursor-pointer text-sm font-medium">{f.q}</summary>
                <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

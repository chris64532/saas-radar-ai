import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Radar, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
  head: () => ({ meta: [{ title: "Welcome — SaaS Radar AI" }] }),
});

const INTERESTS = ["AI", "Dev Tools", "Marketing", "Fintech", "No-code", "Design", "Productivity", "Analytics"];
const ROLES = [
  { id: "founder", t: "Founder", d: "Spot competitors & validate ideas" },
  { id: "investor", t: "Investor", d: "Discover deals before TechCrunch" },
  { id: "marketer", t: "Marketer", d: "Track launches & growth tactics" },
  { id: "researcher", t: "Researcher", d: "Map the SaaS ecosystem" },
];

function Onboarding() {
  const [step, setStep] = useState(0);
  const [interests, setInterests] = useState<string[]>([]);
  const [role, setRole] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/15 ring-1 ring-primary/30">
              <Radar className="h-4 w-4 text-primary" />
            </div>
            <span className="font-mono text-sm font-semibold">SaaS<span className="text-primary">.</span>RadarAI</span>
          </Link>
          <span className="font-mono text-xs text-muted-foreground">Step {step + 1} of 3</span>
        </div>

        <div className="mt-6 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>

        <div className="my-auto py-12">
          {step === 0 && (
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">What categories interest you?</h1>
              <p className="mt-2 text-sm text-muted-foreground">Pick a few — we'll prioritize SaaS from these spaces in your feed.</p>
              <div className="mt-8 flex flex-wrap gap-2">
                {INTERESTS.map((tag) => {
                  const on = interests.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => setInterests((p) => on ? p.filter(x => x !== tag) : [...p, tag])}
                      className={`rounded-full border px-4 py-1.5 text-sm transition-all ${on ? "border-primary bg-primary/10 text-foreground" : "border-border bg-surface text-muted-foreground hover:text-foreground"}`}
                    >
                      {on && <Check className="mr-1.5 inline h-3 w-3 text-primary" />}{tag}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {step === 1 && (
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">How will you use SaaS Radar?</h1>
              <p className="mt-2 text-sm text-muted-foreground">We'll tailor the dashboard to your workflow.</p>
              <div className="mt-8 grid gap-3 md:grid-cols-2">
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`rounded-xl border p-5 text-left transition-all ${role === r.id ? "border-primary bg-primary/5" : "border-border-subtle bg-surface hover:border-primary/40"}`}
                  >
                    <div className="text-sm font-semibold">{r.t}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{r.d}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/15 ring-1 ring-primary/30">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <h1 className="mt-6 text-2xl font-semibold tracking-tight">You're all set</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Radar tuned for {interests.length || "all"} categor{interests.length === 1 ? "y" : "ies"} · profile: {role ?? "explorer"}
              </p>
              <Link to="/app" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
                Enter the terminal <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>

        {step < 2 && (
          <div className="mt-auto flex items-center justify-between">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-30"
            >
              Back
            </button>
            <button
              onClick={() => setStep((s) => s + 1)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { Radar } from "lucide-react";
import type { ReactNode } from "react";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({ meta: [{ title: "Sign in — SaaS Radar AI" }] }),
});

function Login() {
  return (
    <AuthShell title="Sign in to your radar" sub="Welcome back. Resume scanning the SaaS galaxy.">
      <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium hover:bg-surface-elevated">
        <GoogleIcon /> Continue with Google
      </button>
      <Divider />
      <Field label="Email"><input type="email" placeholder="you@startup.com" className={input} /></Field>
      <Field label="Password" right={<Link to="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground">Forgot?</Link>}>
        <input type="password" placeholder="••••••••" className={input} />
      </Field>
      <Link to="/app" className="block w-full rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground hover:opacity-90">
        Sign in
      </Link>
      <p className="text-center text-xs text-muted-foreground">
        No account? <Link to="/signup" className="text-foreground hover:underline">Create one</Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({ title, sub, children }: { title: string; sub: string; children: ReactNode }) {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-4">
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
      </div>
      <div className="relative w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/15 ring-1 ring-primary/30">
            <Radar className="h-4 w-4 text-primary" />
          </div>
          <span className="font-mono text-sm font-semibold">SaaS<span className="text-primary">.</span>RadarAI</span>
        </Link>
        <div className="rounded-2xl border border-border-subtle bg-surface/80 p-6 shadow-card backdrop-blur-xl">
          <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
          <div className="mt-6 space-y-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

export const input =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/40";

export function Field({ label, right, children }: { label: string; right?: ReactNode; children: ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>{label}</span>
        {right}
      </div>
      {children}
    </label>
  );
}

export function Divider() {
  return (
    <div className="relative my-1 flex items-center">
      <span className="flex-1 border-t border-border-subtle" />
      <span className="px-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">or</span>
      <span className="flex-1 border-t border-border-subtle" />
    </div>
  );
}

export function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.56c2.08-1.92 3.28-4.74 3.28-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.99.66-2.25 1.06-3.72 1.06-2.87 0-5.3-1.94-6.16-4.55H2.16v2.86A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC04" d="M5.84 14.08A6.6 6.6 0 0 1 5.48 12c0-.72.12-1.43.34-2.08V7.06H2.16A11 11 0 0 0 1 12c0 1.77.42 3.45 1.16 4.94l3.68-2.86Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.07.56 4.21 1.64l3.15-3.15C17.45 2.16 14.97 1 12 1A11 11 0 0 0 2.16 7.06l3.68 2.86C6.7 7.32 9.13 5.38 12 5.38Z" />
    </svg>
  );
}

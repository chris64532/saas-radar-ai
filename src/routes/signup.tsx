import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell, Field, Divider, GoogleIcon, input } from "./login";

export const Route = createFileRoute("/signup")({
  component: Signup,
  head: () => ({ meta: [{ title: "Create account — SaaS Radar AI" }] }),
});

function Signup() {
  return (
    <AuthShell title="Create your account" sub="Start spotting the next big SaaS in under 60 seconds.">
      <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium hover:bg-surface-elevated">
        <GoogleIcon /> Continue with Google
      </button>
      <Divider />
      <Field label="Full name"><input type="text" placeholder="Ada Radar" className={input} /></Field>
      <Field label="Work email"><input type="email" placeholder="ada@startup.com" className={input} /></Field>
      <Field label="Password"><input type="password" placeholder="At least 8 characters" className={input} /></Field>
      <Link to="/onboarding" className="block w-full rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground hover:opacity-90">
        Create account
      </Link>
      <p className="text-center text-xs text-muted-foreground">
        Have an account? <Link to="/login" className="text-foreground hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  );
}

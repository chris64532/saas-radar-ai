import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell, Field, input } from "./login";

export const Route = createFileRoute("/forgot-password")({
  component: Forgot,
  head: () => ({ meta: [{ title: "Reset password — SaaS Radar AI" }] }),
});

function Forgot() {
  return (
    <AuthShell title="Reset your password" sub="We'll email you a secure link to set a new password.">
      <Field label="Email"><input type="email" placeholder="you@startup.com" className={input} /></Field>
      <button className="block w-full rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground hover:opacity-90">
        Send reset link
      </button>
      <p className="text-center text-xs text-muted-foreground">
        <Link to="/login" className="text-foreground hover:underline">Back to sign in</Link>
      </p>
    </AuthShell>
  );
}

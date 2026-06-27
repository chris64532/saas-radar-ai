import { Link } from "@tanstack/react-router";
import { Radar } from "lucide-react";

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative grid h-8 w-8 place-items-center rounded-md bg-primary/15 ring-1 ring-primary/30">
            <Radar className="h-4 w-4 text-primary" />
            <span className="absolute inset-0 rounded-md ring-1 ring-primary/40 live-dot" />
          </div>
          <span className="font-mono text-sm font-semibold tracking-tight">
            SaaS<span className="text-primary">.</span>Radar<span className="text-muted-foreground">AI</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <Link to="/pricing" className="hover:text-foreground">Pricing</Link>
          <Link to="/docs" className="hover:text-foreground">Docs</Link>
          <Link to="/app" className="hover:text-foreground">Dashboard</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login" className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground">
            Sign in
          </Link>
          <Link
            to="/signup"
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Start free
          </Link>
        </div>
      </div>
    </header>
  );
}

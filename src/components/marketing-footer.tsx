import { Link } from "@tanstack/react-router";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border-subtle bg-background/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <div className="font-mono text-sm font-semibold">
            SaaS<span className="text-primary">.</span>RadarAI
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Bloomberg terminal for emerging SaaS. Built for founders, investors, marketers.
          </p>
        </div>
        <FooterCol title="Product" links={[
          { to: "/app", label: "Dashboard" },
          { to: "/discover", label: "Discover" },
          { to: "/alerts", label: "Alerts" },
          { to: "/pricing", label: "Pricing" },
        ]} />
        <FooterCol title="Resources" links={[
          { to: "/docs", label: "Documentation" },
          { to: "/docs", label: "Scoring system" },
          { to: "/docs", label: "Data sources" },
          { to: "/docs", label: "FAQ" },
        ]} />
        <FooterCol title="Account" links={[
          { to: "/login", label: "Sign in" },
          { to: "/signup", label: "Create account" },
          { to: "/settings", label: "Settings" },
          { to: "/billing", label: "Billing" },
        ]} />
      </div>
      <div className="border-t border-border-subtle">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} SaaS Radar AI</span>
          <span className="font-mono">SIGNAL · LIVE</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="text-foreground/80 hover:text-foreground">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Bell,
  Bookmark,
  CreditCard,
  LayoutDashboard,
  LineChart,
  Radar,
  Search,
  Settings,
  BookOpen,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

const NAV: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard },
  { to: "/discover", label: "Discover", icon: Search },
  { to: "/favorites", label: "Favorites", icon: Bookmark },
  { to: "/analytics", label: "Analytics", icon: LineChart },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/billing", label: "Billing", icon: CreditCard },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/docs", label: "Docs", icon: BookOpen },
];

export function AppShell({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-border-subtle bg-surface/40 md:flex md:flex-col">
        <Link to="/" className="flex h-16 items-center gap-2 border-b border-border-subtle px-5">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/15 ring-1 ring-primary/30">
            <Radar className="h-4 w-4 text-primary" />
          </div>
          <span className="font-mono text-sm font-semibold">
            SaaS<span className="text-primary">.</span>Radar
          </span>
        </Link>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map((item) => {
            const active = pathname === item.to || (item.to !== "/app" && pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-primary/10 text-foreground ring-1 ring-primary/20"
                    : "text-muted-foreground hover:bg-surface hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border-subtle p-4">
          <div className="rounded-lg border border-border-subtle bg-surface p-3">
            <div className="flex items-center gap-2 text-xs">
              <Activity className="h-3 w-3 text-primary live-dot" />
              <span className="font-mono uppercase tracking-wider text-muted-foreground">Live · 1,284 scans</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Pro plan · 87% quota used this month</p>
          </div>
        </div>
      </aside>
      <main className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border-subtle bg-background/80 px-6 backdrop-blur-xl">
          <div>
            <h1 className="text-base font-semibold tracking-tight">{title}</h1>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden items-center gap-2 rounded-md border border-border-subtle bg-surface px-3 py-1.5 text-xs text-muted-foreground md:flex">
              <Search className="h-3.5 w-3.5" />
              Search SaaS…
              <kbd className="ml-2 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
            </button>
            <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary to-accent font-mono text-xs font-semibold text-primary-foreground">
              AR
            </div>
          </div>
        </header>
        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  );
}

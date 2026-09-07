import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import Icon from "@/components/ui/Icon.jsx";
import { useApp } from "@/store/AppStore.jsx";

const nav = [
  { to: "/admin/dashboard", label: "Dashboard", icon: "chart" },
  { to: "/admin/services", label: "Services", icon: "layers" },
  { to: "/admin/portfolio", label: "Portfolio", icon: "file" },
  { to: "/admin/industries", label: "Industries", icon: "building" },
  { to: "/admin/testimonials", label: "Testimonials", icon: "quote" },
  { to: "/admin/pricing", label: "Pricing Estimator", icon: "sliders" },
  { to: "/admin/quotes", label: "Quote Requests", icon: "inbox" },
  { to: "/admin/messages", label: "Contact Messages", icon: "mail" },
  { to: "/admin/company", label: "Company Information", icon: "briefcase" },
  { to: "/admin/settings", label: "Settings", icon: "gear" },
];

export function AdminGuard({ children }) {
  const { isAdmin, hydrated } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && !isAdmin) navigate({ to: "/admin/login" });
  }, [hydrated, isAdmin, navigate]);

  if (!hydrated || !isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-mist">
        <div className="flex items-center gap-3 text-sm font-semibold text-muted-foreground">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-royal border-t-transparent" />
          Checking admin session…
        </div>
      </div>
    );
  }
  return children;
}

export default function AdminLayout({ title, description, actions, children }) {
  const { logout, company } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const signOut = () => {
    logout();
    navigate({ to: "/admin/login" });
  };

  const sidebar = (
    <div className="flex h-full flex-col gap-2 bg-navy p-4 text-white">
      <Link to="/" className="mb-3 flex items-center gap-3 rounded-xl bg-white/8 p-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-safety text-white">
          <Icon name="shield" className="h-5 w-5" />
        </span>
        <span className="min-w-0">
          <span className="block truncate font-display text-sm font-extrabold">{company.shortName}</span>
          <span className="block truncate text-[11px] text-white/60">Admin Panel</span>
        </span>
      </Link>
      <nav className="flex-1 space-y-1 overflow-y-auto" aria-label="Admin navigation">
        {nav.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            activeProps={{ className: "bg-white/14 text-white" }}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Icon name={item.icon} className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        ))}
      </nav>
      <button
        onClick={signOut}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-white/70 transition-colors hover:bg-destructive/25 hover:text-white"
      >
        <Icon name="logout" className="h-4 w-4" /> Logout
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-mist lg:grid lg:grid-cols-[264px_minmax(0,1fr)]">
      <aside className="hidden lg:sticky lg:top-0 lg:block lg:h-screen">{sidebar}</aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 px-4 py-3 sm:px-6">
            <button
              className="rounded-lg border border-border p-2 text-navy lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open admin menu"
            >
              <Icon name="menu" />
            </button>
            <div className="min-w-0 lg:col-span-2">
              <h1 className="truncate font-display text-lg font-extrabold text-navy sm:text-xl">{title}</h1>
              {description && (
                <p className="truncate text-xs text-muted-foreground sm:text-sm">{description}</p>
              )}
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 sm:py-8">
          {actions && <div className="mb-5 flex flex-wrap gap-2">{actions}</div>}
          {children}
        </main>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy/60" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="absolute inset-y-0 left-0 w-[min(84vw,280px)] shadow-lift">{sidebar}</div>
        </div>
      )}
    </div>
  );
}

export function StatusPill({ value }) {
  const tone =
    {
      New: "bg-royal/12 text-royal",
      Contacted: "bg-safety/15 text-safety-dark",
      Quoted: "bg-safety/15 text-safety-dark",
      Converted: "bg-success/12 text-success",
      Closed: "bg-muted text-muted-foreground",
      Read: "bg-safety/15 text-safety-dark",
      Replied: "bg-success/12 text-success",
      Active: "bg-success/12 text-success",
      Published: "bg-success/12 text-success",
      Inactive: "bg-muted text-muted-foreground",
      Draft: "bg-muted text-muted-foreground",
    }[value] ?? "bg-muted text-muted-foreground";
  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${tone}`}>{value}</span>;
}

export function EmptyState({ message }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
      <Icon name="inbox" className="mx-auto h-8 w-8 text-muted-foreground" />
      <p className="mt-3 text-sm font-semibold text-navy">{message}</p>
    </div>
  );
}

export function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-5 left-1/2 z-[120] -translate-x-1/2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow-lift">
      {message}
    </div>
  );
}

export function useToast() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 2200);
    return () => clearTimeout(t);
  }, [message]);
  return [message, setMessage];
}

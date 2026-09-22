"use client";

import { useEffect, useState, ReactNode } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Icon from "@/components/ui/Icon";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "chart" },
  { href: "/admin/service-categories", label: "11 Service Categories", icon: "layers" },
  { href: "/admin/services", label: "Individual Services", icon: "briefcase" },
  { href: "/admin/portfolio", label: "Portfolio Projects", icon: "file" },
  { href: "/admin/gallery", label: "Photo Gallery", icon: "photo" },
  { href: "/admin/industries", label: "Target Industries", icon: "building" },
  { href: "/admin/testimonials", label: "Client Testimonials", icon: "quote" },
  { href: "/admin/pricing", label: "Pricing Estimator Rules", icon: "sliders" },
  { href: "/admin/quotes", label: "Quote Requests", icon: "inbox" },
  { href: "/admin/enquiries", label: "Contact Enquiries", icon: "mail" },
  { href: "/admin/banners", label: "Hero & Banners", icon: "layers" },
  { href: "/admin/content", label: "CMS Website Content", icon: "file" },
  { href: "/admin/company", label: "Company Information", icon: "phone" },
  { href: "/admin/settings", label: "Settings & Access", icon: "gear" },
];

export function AdminGuard({ children }: { children: ReactNode }) {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        if (isMounted) {
          if (data.authenticated) {
            setAuthenticated(true);
          } else {
            router.push("/admin/login");
          }
        }
      } catch (err) {
        if (isMounted) router.push("/admin/login");
      } finally {
        if (isMounted) setChecking(false);
      }
    }
    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [router]);

  if (checking) {
    return (
      <div className="grid min-h-screen place-items-center bg-mist">
        <div className="flex flex-col items-center gap-3 text-sm font-semibold text-navy">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          Verifying Diamond Admin Session…
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
}

export interface AdminLayoutProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
}

export default function AdminLayout({
  title = "",
  description = "",
  actions = null,
  children,
}: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const signOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    }
    router.push("/admin/login");
  };

  const sidebar = (
    <div className="flex h-full flex-col gap-2 bg-navy p-4 text-white">
      <Link href="/" className="mb-3 flex flex-col gap-1 rounded-xl bg-white/8 p-3 transition-colors hover:bg-white/12">
        <img
          src="/images/logo-white.png"
          alt="Diamond Integrated Facility Services LLP"
          className="h-9 w-auto max-w-[190px] object-contain"
        />
        <span className="text-[10px] font-bold uppercase tracking-wider text-gold">Admin Portal</span>
      </Link>
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1" aria-label="Admin navigation">
        {nav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                isActive
                  ? "bg-gold text-white shadow-sm"
                  : "text-white/75 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon name={item.icon} className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="pt-2 border-t border-white/10 flex flex-col gap-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <Icon name="link" className="h-4 w-4" /> Live Website ↗
        </Link>
        <button
          onClick={signOut}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold text-destructive-foreground bg-destructive/80 transition-colors hover:bg-destructive"
        >
          <Icon name="logout" className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <AdminGuard>
      <div className="min-h-screen bg-mist lg:grid lg:grid-cols-[264px_minmax(0,1fr)]">
        <aside className="hidden lg:sticky lg:top-0 lg:block lg:h-screen shadow-md">{sidebar}</aside>

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
            <div className="absolute inset-0 bg-navy/60 backdrop-blur-xs" onClick={() => setOpen(false)} aria-hidden="true" />
            <div className="absolute inset-y-0 left-0 w-[min(84vw,280px)] shadow-lift">{sidebar}</div>
          </div>
        )}
      </div>
    </AdminGuard>
  );
}

export function StatusPill({ value }: { value: string }) {
  const tone =
    {
      New: "bg-gold/15 text-gold border border-gold/30",
      Contacted: "bg-blue-500/15 text-blue-700 border border-blue-500/30",
      Quoted: "bg-amber-500/15 text-amber-700 border border-amber-500/30",
      Converted: "bg-emerald-500/15 text-emerald-700 border border-emerald-500/30",
      Closed: "bg-muted text-muted-foreground border border-border",
      Read: "bg-blue-500/15 text-blue-700 border border-blue-500/30",
      Replied: "bg-emerald-500/15 text-emerald-700 border border-emerald-500/30",
      Active: "bg-emerald-500/15 text-emerald-700 border border-emerald-500/30",
      Completed: "bg-emerald-500/15 text-emerald-700 border border-emerald-500/30",
      Ongoing: "bg-blue-500/15 text-blue-700 border border-blue-500/30",
      Published: "bg-emerald-500/15 text-emerald-700 border border-emerald-500/30",
      Inactive: "bg-muted text-muted-foreground border border-border",
      Draft: "bg-muted text-muted-foreground border border-border",
      Approved: "bg-emerald-500/15 text-emerald-700 border border-emerald-500/30",
      Pending: "bg-amber-500/15 text-amber-700 border border-amber-500/30",
      Rejected: "bg-rose-500/15 text-rose-700 border border-rose-500/30",
    }[value] ?? "bg-muted text-muted-foreground border border-border";
  return <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${tone}`}>{value}</span>;
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
      <Icon name="inbox" className="mx-auto h-8 w-8 text-muted-foreground" />
      <p className="mt-3 text-sm font-semibold text-navy">{message}</p>
    </div>
  );
}

export function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-5 left-1/2 z-[120] -translate-x-1/2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow-lift border border-gold/30 flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
      {message}
    </div>
  );
}

export function useToast(): [string, (msg: string) => void] {
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 2500);
    return () => clearTimeout(t);
  }, [message]);
  return [message, setMessage];
}

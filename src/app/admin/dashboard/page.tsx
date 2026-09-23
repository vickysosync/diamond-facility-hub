"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout, { StatusPill } from "@/components/admin/AdminLayout";
import Icon from "@/components/ui/Icon";
import { formatINR } from "@/data/mock";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const counts = stats?.counts || {
    serviceCategories: 11,
    services: 0,
    industries: 0,
    portfolioProjects: 0,
    testimonials: 0,
    quoteRequests: 0,
    enquiries: 0,
    banners: 0,
  };

  const cards = [
    { label: "Service Categories", value: counts.serviceCategories, icon: "layers", href: "/admin/service-categories" },
    { label: "Individual Services", value: counts.services, icon: "briefcase", href: "/admin/services" },
    { label: "Quote Requests", value: counts.quoteRequests, icon: "inbox", href: "/admin/quotes" },
    { label: "Contact Enquiries", value: counts.enquiries, icon: "mail", href: "/admin/enquiries" },
    { label: "Portfolio Projects", value: counts.portfolioProjects, icon: "file", href: "/admin/portfolio" },
    { label: "Target Industries", value: counts.industries, icon: "building", href: "/admin/industries" },
  ];

  return (
    <AdminLayout
      title="Live Operations Dashboard"
      description="Real-time MongoDB metrics for Diamond Integrated Facility Services LLP"
      actions={
        <button
          onClick={fetchStats}
          className="btn-base btn-secondary text-xs flex items-center gap-1.5 py-1.5 px-3"
        >
          <Icon name="sliders" className="w-3.5 h-3.5" /> Refresh Live Data
        </button>
      }
    >
      {loading && !stats ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <span className="h-7 w-7 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          <p className="text-xs font-semibold text-muted-foreground">Loading MongoDB metrics…</p>
        </div>
      ) : (
        <>
          {/* Summary Metric Cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((c) => (
              <Link
                key={c.label}
                href={c.href}
                className="group rounded-2xl border border-border bg-card p-5 shadow-card hover:border-gold/60 transition-all hover:shadow-lift"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-navy">
                    {c.label}
                  </span>
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-gold/10 text-gold group-hover:bg-gold group-hover:text-white transition-colors">
                    <Icon name={c.icon} className="h-4 w-4" />
                  </span>
                </div>
                <p className="mt-3 font-display text-3xl font-extrabold text-navy">{c.value}</p>
              </Link>
            ))}
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {/* Recent Quote Requests */}
            <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-border">
                <div>
                  <h2 className="font-display text-base font-bold text-navy">Recent Quote Requests</h2>
                  <p className="text-xs text-muted-foreground">Incoming customer requirement submissions</p>
                </div>
                <Link href="/admin/quotes" className="text-xs font-bold text-gold hover:underline">
                  View All ({counts.quoteRequests}) →
                </Link>
              </div>

              {!stats?.recentQuotes?.length ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No quote requests received yet.
                </div>
              ) : (
                <ul className="mt-3 divide-y divide-border">
                  {stats.recentQuotes.slice(0, 5).map((q: any) => (
                    <li key={q._id} className="py-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-gold">{q.quoteId}</span>
                          <span className="font-bold text-sm text-navy">{q.companyName || q.name}</span>
                        </div>
                        <p className="truncate text-xs text-muted-foreground mt-0.5">
                          {q.phone} · {q.serviceCategory || "Facility Management"} · {new Date(q.createdAt).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {q.estimatedPrice ? (
                          <span className="text-xs font-bold text-navy">{formatINR(q.estimatedPrice)}</span>
                        ) : null}
                        <StatusPill value={q.status || "New"} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Recent Enquiries */}
            <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-border">
                <div>
                  <h2 className="font-display text-base font-bold text-navy">Recent Contact Enquiries</h2>
                  <p className="text-xs text-muted-foreground">Website enquiries and service questions</p>
                </div>
                <Link href="/admin/enquiries" className="text-xs font-bold text-gold hover:underline">
                  View All ({counts.enquiries}) →
                </Link>
              </div>

              {!stats?.recentEnquiries?.length ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No enquiries received yet.
                </div>
              ) : (
                <ul className="mt-3 divide-y divide-border">
                  {stats.recentEnquiries.slice(0, 5).map((enq: any) => (
                    <li key={enq._id} className="py-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-navy">{enq.enquiryId}</span>
                          <span className="font-bold text-sm text-navy">{enq.name}</span>
                        </div>
                        <p className="truncate text-xs text-muted-foreground mt-0.5">
                          {enq.email} · {enq.serviceInterest || "General"} · {new Date(enq.createdAt).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                      <StatusPill value={enq.status || "New"} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {/* Quick Management Shortcuts */}
          <div className="mt-6 rounded-2xl border border-border bg-white p-5 shadow-card">
            <h3 className="font-display text-base font-bold text-navy mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link
                href="/admin/service-categories"
                className="p-3 rounded-xl bg-mist hover:bg-gold/10 border border-border hover:border-gold text-xs font-bold text-navy flex items-center gap-2 transition-all"
              >
                <Icon name="layers" className="w-4 h-4 text-gold" />
                Manage Categories
              </Link>
              <Link
                href="/admin/portfolio"
                className="p-3 rounded-xl bg-mist hover:bg-gold/10 border border-border hover:border-gold text-xs font-bold text-navy flex items-center gap-2 transition-all"
              >
                <Icon name="file" className="w-4 h-4 text-gold" />
                Add Portfolio Project
              </Link>
              <Link
                href="/admin/pricing"
                className="p-3 rounded-xl bg-mist hover:bg-gold/10 border border-border hover:border-gold text-xs font-bold text-navy flex items-center gap-2 transition-all"
              >
                <Icon name="sliders" className="w-4 h-4 text-gold" />
                Adjust Pricing Rules
              </Link>
              <Link
                href="/admin/company"
                className="p-3 rounded-xl bg-mist hover:bg-gold/10 border border-border hover:border-gold text-xs font-bold text-navy flex items-center gap-2 transition-all"
              >
                <Icon name="phone" className="w-4 h-4 text-gold" />
                Edit Company Info
              </Link>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

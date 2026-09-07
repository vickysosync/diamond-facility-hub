import { createFileRoute, Link } from "@tanstack/react-router";
import AdminLayout, { AdminGuard, StatusPill } from "@/components/admin/AdminLayout.jsx";
import Icon from "@/components/ui/Icon.jsx";
import { useApp } from "@/store/AppStore.jsx";
import { formatINR } from "@/data/mock.jsx";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard | Diamond Integrated Facility Services LLP" },
      { name: "description", content: "Overview of services, portfolio, quote requests and messages." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Dashboard | Diamond Facility Services" },
      { property: "og:description", content: "Restricted demonstration admin area." },
    ],
  }),
  component: () => (
    <AdminGuard>
      <DashboardPage />
    </AdminGuard>
  ),
});

function DashboardPage() {
  const { services, portfolio, quotes, messages, testimonials } = useApp();
  const activeServices = services.filter((s) => s.status === "Active").length;
  const leads = quotes.filter((q) => q.status !== "Closed").length;
  const pipeline = quotes.reduce((sum, q) => sum + (q.estimatedCost || 0), 0);

  const cards = [
    { label: "Total Services", value: services.length, icon: "layers" },
    { label: "Portfolio Projects", value: portfolio.length, icon: "file" },
    { label: "Quote Requests", value: quotes.length, icon: "inbox" },
    { label: "Contact Messages", value: messages.length, icon: "mail" },
    { label: "Active Services", value: activeServices, icon: "check" },
    { label: "Estimated Leads", value: leads, icon: "chart" },
  ];

  const statuses = ["New", "Contacted", "Quoted", "Converted", "Closed"];
  const counts = statuses.map((s) => ({ s, n: quotes.filter((q) => q.status === s).length }));
  const maxCount = Math.max(1, ...counts.map((c) => c.n));

  const byCategory = ["Security", "Pest Control", "Tank Cleaning", "Painting", "Facility Management"].map(
    (c) => ({ c, n: portfolio.filter((p) => p.category === c).length }),
  );
  const totalProjects = Math.max(1, portfolio.length);

  return (
    <AdminLayout title="Dashboard" description="Demonstration overview of website activity">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {c.label}
              </span>
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-royal/10 text-royal">
                <Icon name={c.icon} className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-extrabold text-navy">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-display text-base font-bold text-navy">Quote Requests by Status</h2>
          <ul className="mt-5 space-y-4">
            {counts.map(({ s, n }) => (
              <li key={s}>
                <div className="flex items-center justify-between text-xs font-semibold text-navy-700">
                  <span>{s}</span>
                  <span>{n}</span>
                </div>
                <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-royal transition-all duration-700"
                    style={{ width: `${(n / maxCount) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-5 rounded-xl bg-mist p-3 text-xs text-muted-foreground">
            Indicative pipeline value:{" "}
            <span className="font-bold text-navy">{formatINR(pipeline)}</span>
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-display text-base font-bold text-navy">Portfolio Mix</h2>
          <ul className="mt-5 space-y-4">
            {byCategory.map(({ c, n }) => (
              <li key={c}>
                <div className="flex items-center justify-between text-xs font-semibold text-navy-700">
                  <span>{c}</span>
                  <span>{Math.round((n / totalProjects) * 100)}%</span>
                </div>
                <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-safety transition-all duration-700"
                    style={{ width: `${(n / totalProjects) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-5 rounded-xl bg-mist p-3 text-xs text-muted-foreground">
            Published testimonials:{" "}
            <span className="font-bold text-navy">
              {testimonials.filter((t) => t.status === "Published").length}
            </span>
          </p>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-base font-bold text-navy">Latest Quote Requests</h2>
          <Link to="/admin/quotes" className="text-xs font-bold text-royal hover:underline">
            View all
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-border">
          {quotes.slice(0, 5).map((q) => (
            <li key={q.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-navy">{q.company}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {q.contact} · {(q.services || []).join(", ")} · {q.date}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-navy">{formatINR(q.estimatedCost || 0)}</span>
                <StatusPill value={q.status} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </AdminLayout>
  );
}

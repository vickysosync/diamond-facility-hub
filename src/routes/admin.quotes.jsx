import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import AdminLayout, {
  AdminGuard,
  EmptyState,
  StatusPill,
  Toast,
  useToast,
} from "@/components/admin/AdminLayout.jsx";
import Modal from "@/components/ui/Modal.jsx";
import Icon from "@/components/ui/Icon.jsx";
import { useApp } from "@/store/AppStore.jsx";
import { formatINR } from "@/data/mock.jsx";

export const Route = createFileRoute("/admin/quotes")({
  head: () => ({
    meta: [
      { title: "Quote Requests | Diamond Admin" },
      { name: "description", content: "Review and update the status of incoming facility service quote requests." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Quote Requests | Diamond Admin" },
      { property: "og:description", content: "Restricted demonstration admin area." },
    ],
  }),
  component: () => (
    <AdminGuard>
      <QuotesAdmin />
    </AdminGuard>
  ),
});

const statuses = ["New", "Contacted", "Quoted", "Converted", "Closed"];
const filters = ["All", ...statuses];

function QuotesAdmin() {
  const { quotes, updateQuote } = useApp();
  const [filter, setFilter] = useState("All");
  const [detail, setDetail] = useState(null);
  const [toast, setToast] = useToast();

  const list = useMemo(
    () => (filter === "All" ? quotes : quotes.filter((q) => q.status === filter)),
    [quotes, filter],
  );

  const setStatus = (q, status) => {
    updateQuote(q.id, { status });
    setToast(`${q.id} marked ${status}`);
  };

  return (
    <AdminLayout title="Quote Requests" description="Leads captured from the estimator and quote forms">
      <div className="mb-5 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors ${
              filter === f
                ? "border-navy bg-navy text-white"
                : "border-border bg-card text-navy-700 hover:border-royal hover:text-royal"
            }`}
          >
            {f}
            <span className="ml-1.5 opacity-70">
              {f === "All" ? quotes.length : quotes.filter((q) => q.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState message="No quote requests with this status." />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto rounded-2xl border border-border bg-card shadow-card lg:block">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead className="bg-mist text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-bold">Request ID</th>
                  <th className="px-4 py-3 font-bold">Company</th>
                  <th className="px-4 py-3 font-bold">Contact Person</th>
                  <th className="px-4 py-3 font-bold">Phone</th>
                  <th className="px-4 py-3 font-bold">Services</th>
                  <th className="px-4 py-3 font-bold">Facility Size</th>
                  <th className="px-4 py-3 font-bold">Estimated Cost</th>
                  <th className="px-4 py-3 font-bold">Date</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 font-bold">Update</th>
                </tr>
              </thead>
              <tbody>
                {list.map((q) => (
                  <tr key={q.id} className="border-t border-border align-top">
                    <td className="px-4 py-3">
                      <button
                        className="font-bold text-royal underline-offset-2 hover:underline"
                        onClick={() => setDetail(q)}
                      >
                        {q.id}
                      </button>
                    </td>
                    <td className="px-4 py-3 font-semibold text-navy">{q.company}</td>
                    <td className="px-4 py-3 text-muted-foreground">{q.contact}</td>
                    <td className="px-4 py-3 text-muted-foreground">{q.phone}</td>
                    <td className="px-4 py-3 text-muted-foreground">{(q.services || []).join(", ")}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {Number(q.facilitySize || 0).toLocaleString("en-IN")} sq.ft
                    </td>
                    <td className="px-4 py-3 font-bold text-navy">{formatINR(q.estimatedCost || 0)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{q.date}</td>
                    <td className="px-4 py-3">
                      <StatusPill value={q.status} />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className="field w-auto"
                        value={q.status}
                        onChange={(e) => setStatus(q, e.target.value)}
                        aria-label={`Status for ${q.id}`}
                      >
                        {statuses.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:hidden">
            {list.map((q) => (
              <article key={q.id} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-royal">{q.id}</p>
                    <h2 className="truncate text-sm font-bold text-navy">{q.company}</h2>
                    <p className="text-xs text-muted-foreground">
                      {q.contact} · {q.phone}
                    </p>
                  </div>
                  <StatusPill value={q.status} />
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <dt className="text-muted-foreground">Services</dt>
                    <dd className="font-semibold text-navy">{(q.services || []).join(", ")}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Facility Size</dt>
                    <dd className="font-semibold text-navy">
                      {Number(q.facilitySize || 0).toLocaleString("en-IN")} sq.ft
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Estimate</dt>
                    <dd className="font-semibold text-navy">{formatINR(q.estimatedCost || 0)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Date</dt>
                    <dd className="font-semibold text-navy">{q.date}</dd>
                  </div>
                </dl>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="btn-base btn-ghost-navy" onClick={() => setDetail(q)}>
                    <Icon name="info" className="h-4 w-4" /> Details
                  </button>
                  <select
                    className="field w-auto"
                    value={q.status}
                    onChange={(e) => setStatus(q, e.target.value)}
                    aria-label={`Status for ${q.id}`}
                  >
                    {statuses.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      <Modal open={!!detail} onClose={() => setDetail(null)} title={`Quote Request ${detail?.id ?? ""}`}>
        {detail && (
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            {[
              ["Company", detail.company],
              ["Contact Person", detail.contact],
              ["Phone", detail.phone],
              ["Email", detail.email],
              ["Facility Type", detail.facilityType],
              ["City", detail.city],
              ["Services", (detail.services || []).join(", ")],
              ["Facility Size", `${Number(detail.facilitySize || 0).toLocaleString("en-IN")} sq.ft`],
              ["Frequency", detail.frequency],
              ["Preferred Date", detail.preferredDate],
              ["Estimated Cost", formatINR(detail.estimatedCost || 0)],
              ["Received", detail.date],
              ["Additional Requirements", detail.notes],
            ]
              .filter(([, value]) => value)
              .map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="mt-1 font-semibold text-navy">{value}</dd>
                </div>
              ))}
          </dl>
        )}
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button className="btn-base btn-ghost-navy" onClick={() => setDetail(null)}>
            Close
          </button>
          {detail && (
            <a className="btn-base btn-accent" href={`tel:${detail.phone}`}>
              <Icon name="phone" className="h-4 w-4" /> Call Contact
            </a>
          )}
        </div>
      </Modal>

      <Toast message={toast} />
    </AdminLayout>
  );
}

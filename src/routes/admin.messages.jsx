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

export const Route = createFileRoute("/admin/messages")({
  head: () => ({
    meta: [
      { title: "Contact Messages | Diamond Admin" },
      { name: "description", content: "Read and manage enquiries submitted through the contact form." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Contact Messages | Diamond Admin" },
      { property: "og:description", content: "Restricted demonstration admin area." },
    ],
  }),
  component: () => (
    <AdminGuard>
      <MessagesAdmin />
    </AdminGuard>
  ),
});

const statuses = ["New", "Read", "Replied", "Closed"];
const filters = ["All", ...statuses];

function MessagesAdmin() {
  const { messages, updateMessage } = useApp();
  const [filter, setFilter] = useState("All");
  const [detail, setDetail] = useState(null);
  const [toast, setToast] = useToast();

  const list = useMemo(
    () => (filter === "All" ? messages : messages.filter((m) => m.status === filter)),
    [messages, filter],
  );

  const open = (m) => {
    setDetail(m);
    if (m.status === "New") updateMessage(m.id, { status: "Read" });
  };

  return (
    <AdminLayout title="Contact Messages" description="Enquiries received from the public contact form">
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
              {f === "All" ? messages.length : messages.filter((m) => m.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState message="No messages with this status." />
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-2xl border border-border bg-card shadow-card lg:block">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-mist text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-bold">Name</th>
                  <th className="px-4 py-3 font-bold">Company</th>
                  <th className="px-4 py-3 font-bold">Email</th>
                  <th className="px-4 py-3 font-bold">Phone</th>
                  <th className="px-4 py-3 font-bold">Service</th>
                  <th className="px-4 py-3 font-bold">Message</th>
                  <th className="px-4 py-3 font-bold">Date</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 font-bold">Update</th>
                </tr>
              </thead>
              <tbody>
                {list.map((m) => (
                  <tr key={m.id} className="border-t border-border align-top">
                    <td className="px-4 py-3">
                      <button
                        className="font-semibold text-royal underline-offset-2 hover:underline"
                        onClick={() => open(m)}
                      >
                        {m.name}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{m.company}</td>
                    <td className="px-4 py-3 text-muted-foreground">{m.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{m.phone}</td>
                    <td className="px-4 py-3 text-muted-foreground">{m.service}</td>
                    <td className="max-w-[280px] px-4 py-3 text-muted-foreground">
                      <span className="line-clamp-2">{m.message}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{m.date}</td>
                    <td className="px-4 py-3">
                      <StatusPill value={m.status} />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className="field w-auto"
                        value={m.status}
                        onChange={(e) => {
                          updateMessage(m.id, { status: e.target.value });
                          setToast(`Message marked ${e.target.value}`);
                        }}
                        aria-label={`Status for message from ${m.name}`}
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

          <div className="grid gap-4 md:grid-cols-2 lg:hidden">
            {list.map((m) => (
              <article key={m.id} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-bold text-navy">{m.name}</h2>
                    <p className="truncate text-xs text-muted-foreground">
                      {m.company} · {m.service}
                    </p>
                  </div>
                  <StatusPill value={m.status} />
                </div>
                <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{m.message}</p>
                <p className="mt-2 text-[11px] text-muted-foreground">{m.date}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="btn-base btn-ghost-navy" onClick={() => open(m)}>
                    <Icon name="mail" className="h-4 w-4" /> Open
                  </button>
                  <select
                    className="field w-auto"
                    value={m.status}
                    onChange={(e) => {
                      updateMessage(m.id, { status: e.target.value });
                      setToast(`Message marked ${e.target.value}`);
                    }}
                    aria-label={`Status for message from ${m.name}`}
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

      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail ? `Message from ${detail.name}` : ""}
      >
        {detail && (
          <>
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              {[
                ["Company", detail.company],
                ["Email", detail.email],
                ["Phone", detail.phone],
                ["Service Required", detail.service],
                ["Received", detail.date],
                ["Status", detail.status],
              ]
                .filter(([, v]) => v)
                .map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {label}
                    </dt>
                    <dd className="mt-1 font-semibold text-navy">{value}</dd>
                  </div>
                ))}
            </dl>
            <div className="mt-5 rounded-xl bg-mist p-4 text-sm leading-relaxed text-navy-700">
              {detail.message}
            </div>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button className="btn-base btn-ghost-navy" onClick={() => setDetail(null)}>
                Close
              </button>
              <button
                className="btn-base btn-ghost-navy"
                onClick={() => {
                  updateMessage(detail.id, { status: "Replied" });
                  setToast("Marked as replied");
                  setDetail(null);
                }}
              >
                <Icon name="check" className="h-4 w-4" /> Mark Replied
              </button>
              <a className="btn-base btn-accent" href={`mailto:${detail.email}`}>
                <Icon name="mail" className="h-4 w-4" /> Reply by Email
              </a>
            </div>
          </>
        )}
      </Modal>

      <Toast message={toast} />
    </AdminLayout>
  );
}

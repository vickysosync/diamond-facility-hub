import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import AdminLayout, { AdminGuard, EmptyState, StatusPill, Toast, useToast } from "@/components/admin/AdminLayout.jsx";
import Modal, { ConfirmDialog } from "@/components/ui/Modal.jsx";
import Icon from "@/components/ui/Icon.jsx";
import { useApp } from "@/store/AppStore.jsx";
import { images, portfolioCategories } from "@/data/mock.jsx";

export const Route = createFileRoute("/admin/portfolio")({
  head: () => ({
    meta: [
      { title: "Manage Portfolio | Diamond Admin" },
      { name: "description", content: "Add, edit and remove portfolio projects shown on the website." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Manage Portfolio | Diamond Admin" },
      { property: "og:description", content: "Restricted demonstration admin area." },
    ],
  }),
  component: () => (
    <AdminGuard>
      <PortfolioAdmin />
    </AdminGuard>
  ),
});

const imageKeys = ["security", "pest", "tank", "painting", "facility"];
const categories = portfolioCategories.filter((c) => c !== "All");
const statuses = ["Completed", "Ongoing", "In Progress"];

const blank = {
  title: "",
  category: "Security",
  client: "",
  location: "Pune",
  serviceType: "",
  description: "",
  year: "2026",
  status: "Completed",
  image: "facility",
};

function PortfolioAdmin() {
  const { portfolio, portfolioOps } = useApp();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [confirm, setConfirm] = useState(null);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");
  const [toast, setToast] = useToast();

  const list = filter === "All" ? portfolio : portfolio.filter((p) => p.category === filter);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const openNew = () => {
    setForm(blank);
    setEditing("new");
    setError("");
  };

  const openEdit = (p) => {
    setForm({ ...p, image: imageKeys.find((k) => images[k] === p.image) ?? "facility" });
    setEditing(p.id);
    setError("");
  };

  const save = () => {
    if (!form.title.trim() || !form.serviceType.trim()) {
      setError("Project name and service type are required.");
      return;
    }
    const payload = { ...form, image: images[form.image] ?? images.facility };
    if (editing === "new") {
      portfolioOps.add(payload);
      setToast("Project added");
    } else {
      portfolioOps.update(editing, payload);
      setToast("Project updated");
    }
    setEditing(null);
  };

  return (
    <AdminLayout
      title="Portfolio"
      description="Projects displayed in the public portfolio grid"
      actions={
        <button className="btn-base btn-accent" onClick={openNew}>
          <Icon name="plus" className="h-4 w-4" /> Add Project
        </button>
      }
    >
      <div className="mb-5 flex flex-wrap gap-2">
        {portfolioCategories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors ${
              filter === c
                ? "border-navy bg-navy text-white"
                : "border-border bg-card text-navy-700 hover:border-royal hover:text-royal"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState message="No projects in this category." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((p) => (
            <article key={p.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              <img src={p.image} alt={p.title} className="h-32 w-full object-cover" loading="lazy" />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-sm font-bold leading-snug text-navy">{p.title}</h2>
                  <StatusPill value={p.status} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {p.category} · {p.location} · {p.year}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="btn-base btn-ghost-navy" onClick={() => openEdit(p)}>
                    <Icon name="edit" className="h-4 w-4" /> Edit
                  </button>
                  <select
                    className="field w-auto"
                    value={p.status}
                    onChange={(e) => {
                      portfolioOps.update(p.id, { status: e.target.value });
                      setToast("Status updated");
                    }}
                    aria-label={`Status for ${p.title}`}
                  >
                    {statuses.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  <button
                    className="btn-base border border-destructive/40 text-destructive hover:bg-destructive/8"
                    onClick={() => setConfirm(p)}
                  >
                    <Icon name="trash" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing === "new" ? "Add Project" : "Edit Project"}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm sm:col-span-2">
            <span className="mb-1.5 block font-semibold text-navy-700">Project Name *</span>
            <input className="field" value={form.title} onChange={(e) => set("title", e.target.value)} />
          </label>
          <label className="text-sm">
            <span className="mb-1.5 block font-semibold text-navy-700">Category</span>
            <select className="field" value={form.category} onChange={(e) => set("category", e.target.value)}>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1.5 block font-semibold text-navy-700">Client / Industry</span>
            <input className="field" value={form.client} onChange={(e) => set("client", e.target.value)} />
          </label>
          <label className="text-sm">
            <span className="mb-1.5 block font-semibold text-navy-700">Service Type *</span>
            <input
              className="field"
              value={form.serviceType}
              onChange={(e) => set("serviceType", e.target.value)}
            />
          </label>
          <label className="text-sm">
            <span className="mb-1.5 block font-semibold text-navy-700">Location</span>
            <input className="field" value={form.location} onChange={(e) => set("location", e.target.value)} />
          </label>
          <label className="text-sm">
            <span className="mb-1.5 block font-semibold text-navy-700">Year</span>
            <input className="field" value={form.year} onChange={(e) => set("year", e.target.value)} />
          </label>
          <label className="text-sm">
            <span className="mb-1.5 block font-semibold text-navy-700">Status</span>
            <select className="field" value={form.status} onChange={(e) => set("status", e.target.value)}>
              {statuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1.5 block font-semibold text-navy-700">Image</span>
            <select className="field" value={form.image} onChange={(e) => set("image", e.target.value)}>
              {imageKeys.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="mb-1.5 block font-semibold text-navy-700">Description</span>
            <textarea
              rows={3}
              className="field"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </label>
        </div>

        {error && <p className="mt-4 text-xs font-semibold text-destructive">{error}</p>}

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button className="btn-base btn-ghost-navy" onClick={() => setEditing(null)}>
            Cancel
          </button>
          <button className="btn-base btn-accent" onClick={save}>
            Save Project
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          portfolioOps.remove(confirm.id);
          setToast("Project deleted");
        }}
        message={`Delete "${confirm?.title}" from the portfolio?`}
      />
      <Toast message={toast} />
    </AdminLayout>
  );
}

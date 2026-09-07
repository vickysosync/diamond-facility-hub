import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import AdminLayout, { AdminGuard, EmptyState, StatusPill, Toast, useToast } from "@/components/admin/AdminLayout.jsx";
import Modal, { ConfirmDialog } from "@/components/ui/Modal.jsx";
import Icon from "@/components/ui/Icon.jsx";
import { useApp } from "@/store/AppStore.jsx";
import { formatINR, images } from "@/data/mock.jsx";

export const Route = createFileRoute("/admin/services")({
  head: () => ({
    meta: [
      { title: "Manage Services | Diamond Admin" },
      { name: "description", content: "Add, edit, activate or remove facility service listings." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Manage Services | Diamond Admin" },
      { property: "og:description", content: "Restricted demonstration admin area." },
    ],
  }),
  component: () => (
    <AdminGuard>
      <ServicesAdmin />
    </AdminGuard>
  ),
});

const blank = {
  name: "",
  category: "Security",
  short: "",
  description: "",
  features: "",
  startingPrice: 5000,
  priceNote: "per project",
  status: "Active",
  image: "security",
  icon: "shield",
};

const imageKeys = ["security", "pest", "tank", "painting", "facility"];

function ServicesAdmin() {
  const { services, servicesOps } = useApp();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [confirm, setConfirm] = useState(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useToast();

  const openNew = () => {
    setForm(blank);
    setEditing("new");
    setError("");
  };

  const openEdit = (s) => {
    setForm({
      ...s,
      features: (s.features || []).join("\n"),
      image: imageKeys.find((k) => images[k] === s.image) ?? "facility",
    });
    setEditing(s.id);
    setError("");
  };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = () => {
    if (!form.name.trim() || !form.short.trim()) {
      setError("Service name and short description are required.");
      return;
    }
    const payload = {
      ...form,
      startingPrice: Number(form.startingPrice) || 0,
      features: form.features.split("\n").map((f) => f.trim()).filter(Boolean),
      image: images[form.image] ?? images.facility,
    };
    if (editing === "new") {
      const id = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      servicesOps.add({ ...payload, id, slug: id });
      setToast("Service added");
    } else {
      servicesOps.update(editing, payload);
      setToast("Service updated");
    }
    setEditing(null);
  };

  return (
    <AdminLayout
      title="Services"
      description="Manage the service categories shown on the public website"
      actions={
        <button className="btn-base btn-accent" onClick={openNew}>
          <Icon name="plus" className="h-4 w-4" /> Add Service
        </button>
      }
    >
      {services.length === 0 ? (
        <EmptyState message="No services yet. Add your first service." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((s) => (
            <article key={s.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              <img src={s.image} alt={s.name} className="h-32 w-full object-cover" loading="lazy" />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-base font-bold text-navy">{s.name}</h2>
                  <StatusPill value={s.status} />
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{s.short}</p>
                <p className="mt-3 text-sm font-bold text-navy">
                  From {formatINR(s.startingPrice)}{" "}
                  <span className="text-xs font-medium text-muted-foreground">{s.priceNote}</span>
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="btn-base btn-ghost-navy" onClick={() => openEdit(s)}>
                    <Icon name="edit" className="h-4 w-4" /> Edit
                  </button>
                  <button
                    className="btn-base btn-ghost-navy"
                    onClick={() => {
                      servicesOps.update(s.id, { status: s.status === "Active" ? "Inactive" : "Active" });
                      setToast(s.status === "Active" ? "Service deactivated" : "Service activated");
                    }}
                  >
                    {s.status === "Active" ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    className="btn-base border border-destructive/40 text-destructive hover:bg-destructive/8"
                    onClick={() => setConfirm(s)}
                  >
                    <Icon name="trash" className="h-4 w-4" /> Delete
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
        title={editing === "new" ? "Add Service" : "Edit Service"}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm sm:col-span-2">
            <span className="mb-1.5 block font-semibold text-navy-700">Service Name *</span>
            <input className="field" value={form.name} onChange={(e) => set("name", e.target.value)} />
          </label>
          <label className="text-sm">
            <span className="mb-1.5 block font-semibold text-navy-700">Category</span>
            <input className="field" value={form.category} onChange={(e) => set("category", e.target.value)} />
          </label>
          <label className="text-sm">
            <span className="mb-1.5 block font-semibold text-navy-700">Status</span>
            <select className="field" value={form.status} onChange={(e) => set("status", e.target.value)}>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1.5 block font-semibold text-navy-700">Starting Price (₹)</span>
            <input
              type="number"
              className="field"
              value={form.startingPrice}
              onChange={(e) => set("startingPrice", e.target.value)}
            />
          </label>
          <label className="text-sm">
            <span className="mb-1.5 block font-semibold text-navy-700">Price Note</span>
            <input className="field" value={form.priceNote} onChange={(e) => set("priceNote", e.target.value)} />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="mb-1.5 block font-semibold text-navy-700">Short Description *</span>
            <textarea
              rows={2}
              className="field"
              value={form.short}
              onChange={(e) => set("short", e.target.value)}
            />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="mb-1.5 block font-semibold text-navy-700">Full Description</span>
            <textarea
              rows={3}
              className="field"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="mb-1.5 block font-semibold text-navy-700">Features (one per line)</span>
            <textarea
              rows={5}
              className="field"
              value={form.features}
              onChange={(e) => set("features", e.target.value)}
            />
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
        </div>

        {error && <p className="mt-4 text-xs font-semibold text-destructive">{error}</p>}

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button className="btn-base btn-ghost-navy" onClick={() => setEditing(null)}>
            Cancel
          </button>
          <button className="btn-base btn-accent" onClick={save}>
            Save Service
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          servicesOps.remove(confirm.id);
          setToast("Service deleted");
        }}
        message={`Delete "${confirm?.name}"? This removes it from the public website for this demo session.`}
      />
      <Toast message={toast} />
    </AdminLayout>
  );
}

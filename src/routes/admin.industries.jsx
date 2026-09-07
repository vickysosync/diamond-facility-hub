import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import AdminLayout, { AdminGuard, EmptyState, Toast, useToast } from "@/components/admin/AdminLayout.jsx";
import Modal, { ConfirmDialog } from "@/components/ui/Modal.jsx";
import Icon from "@/components/ui/Icon.jsx";
import { useApp } from "@/store/AppStore.jsx";

export const Route = createFileRoute("/admin/industries")({
  head: () => ({
    meta: [
      { title: "Manage Industries | Diamond Admin" },
      { name: "description", content: "Add, edit and remove the industries shown on the public website." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Manage Industries | Diamond Admin" },
      { property: "og:description", content: "Restricted demonstration admin area." },
    ],
  }),
  component: () => (
    <AdminGuard>
      <IndustriesAdmin />
    </AdminGuard>
  ),
});

const iconKeys = [
  "building",
  "home",
  "store",
  "factory",
  "box",
  "school",
  "cross",
  "cart",
  "bed",
  "cone",
  "shield",
  "layers",
];

const blank = { name: "", icon: "building", description: "" };

function IndustriesAdmin() {
  const { industries, industriesOps } = useApp();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [confirm, setConfirm] = useState(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useToast();

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const openNew = () => {
    setForm(blank);
    setEditing("new");
    setError("");
  };

  const openEdit = (item) => {
    setForm({ ...item });
    setEditing(item.id);
    setError("");
  };

  const save = () => {
    if (!form.name.trim()) {
      setError("Industry name is required.");
      return;
    }
    if (editing === "new") {
      industriesOps.add(form);
      setToast("Industry added");
    } else {
      industriesOps.update(editing, form);
      setToast("Industry updated");
    }
    setEditing(null);
  };

  return (
    <AdminLayout
      title="Industries"
      description="Sectors listed in the Industries We Serve section"
      actions={
        <button className="btn-base btn-accent" onClick={openNew}>
          <Icon name="plus" className="h-4 w-4" /> Add Industry
        </button>
      }
    >
      {industries.length === 0 ? (
        <EmptyState message="No industries added yet." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {industries.map((item) => (
            <article key={item.id} className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-royal/10 text-royal">
                  <Icon name={item.icon} className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-navy">{item.name}</h2>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="btn-base btn-ghost-navy" onClick={() => openEdit(item)}>
                  <Icon name="edit" className="h-4 w-4" /> Edit
                </button>
                <button
                  className="btn-base border border-destructive/40 text-destructive hover:bg-destructive/8"
                  onClick={() => setConfirm(item)}
                  aria-label={`Delete ${item.name}`}
                >
                  <Icon name="trash" className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing === "new" ? "Add Industry" : "Edit Industry"}
        maxWidth="max-w-xl"
      >
        <div className="grid gap-4">
          <label className="text-sm">
            <span className="mb-1.5 block font-semibold text-navy-700">Industry Name *</span>
            <input className="field" value={form.name} onChange={(e) => set("name", e.target.value)} />
          </label>
          <label className="text-sm">
            <span className="mb-1.5 block font-semibold text-navy-700">Icon</span>
            <select className="field" value={form.icon} onChange={(e) => set("icon", e.target.value)}>
              {iconKeys.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
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
            Save Industry
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          industriesOps.remove(confirm.id);
          setToast("Industry deleted");
        }}
        message={`Remove "${confirm?.name}" from the industries list?`}
      />
      <Toast message={toast} />
    </AdminLayout>
  );
}

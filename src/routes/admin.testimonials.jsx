import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import AdminLayout, {
  AdminGuard,
  EmptyState,
  StatusPill,
  Toast,
  useToast,
} from "@/components/admin/AdminLayout.jsx";
import Modal, { ConfirmDialog } from "@/components/ui/Modal.jsx";
import Icon from "@/components/ui/Icon.jsx";
import { useApp } from "@/store/AppStore.jsx";

export const Route = createFileRoute("/admin/testimonials")({
  head: () => ({
    meta: [
      { title: "Manage Testimonials | Diamond Admin" },
      { name: "description", content: "Add, edit, publish or remove client testimonials." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Manage Testimonials | Diamond Admin" },
      { property: "og:description", content: "Restricted demonstration admin area." },
    ],
  }),
  component: () => (
    <AdminGuard>
      <TestimonialsAdmin />
    </AdminGuard>
  ),
});

const blank = { name: "", company: "", industry: "", rating: 5, status: "Published", review: "" };

function Stars({ value }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Icon
          key={n}
          name="star"
          className={`h-3.5 w-3.5 ${n <= value ? "text-safety" : "text-border"}`}
        />
      ))}
    </span>
  );
}

function TestimonialsAdmin() {
  const { testimonials, testimonialsOps } = useApp();
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
    if (!form.name.trim() || !form.review.trim()) {
      setError("Client name and review text are required.");
      return;
    }
    const payload = { ...form, rating: Number(form.rating) };
    if (editing === "new") {
      testimonialsOps.add(payload);
      setToast("Testimonial added");
    } else {
      testimonialsOps.update(editing, payload);
      setToast("Testimonial updated");
    }
    setEditing(null);
  };

  return (
    <AdminLayout
      title="Testimonials"
      description="Reviews shown in the public testimonials section"
      actions={
        <button className="btn-base btn-accent" onClick={openNew}>
          <Icon name="plus" className="h-4 w-4" /> Add Testimonial
        </button>
      }
    >
      {testimonials.length === 0 ? (
        <EmptyState message="No testimonials yet." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {testimonials.map((t) => (
            <article key={t.id} className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-navy">{t.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {t.company}
                    {t.industry ? ` · ${t.industry}` : ""}
                  </p>
                </div>
                <StatusPill value={t.status} />
              </div>
              <div className="mt-3">
                <Stars value={Number(t.rating)} />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">“{t.review}”</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="btn-base btn-ghost-navy" onClick={() => openEdit(t)}>
                  <Icon name="edit" className="h-4 w-4" /> Edit
                </button>
                <button
                  className="btn-base btn-ghost-navy"
                  onClick={() => {
                    const next = t.status === "Published" ? "Draft" : "Published";
                    testimonialsOps.update(t.id, { status: next });
                    setToast(next === "Published" ? "Testimonial published" : "Testimonial unpublished");
                  }}
                >
                  <Icon name="check" className="h-4 w-4" />
                  {t.status === "Published" ? "Unpublish" : "Publish"}
                </button>
                <button
                  className="btn-base border border-destructive/40 text-destructive hover:bg-destructive/8"
                  onClick={() => setConfirm(t)}
                  aria-label={`Delete testimonial by ${t.name}`}
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
        title={editing === "new" ? "Add Testimonial" : "Edit Testimonial"}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1.5 block font-semibold text-navy-700">Client Name *</span>
            <input className="field" value={form.name} onChange={(e) => set("name", e.target.value)} />
          </label>
          <label className="text-sm">
            <span className="mb-1.5 block font-semibold text-navy-700">Company</span>
            <input className="field" value={form.company} onChange={(e) => set("company", e.target.value)} />
          </label>
          <label className="text-sm">
            <span className="mb-1.5 block font-semibold text-navy-700">Industry</span>
            <input className="field" value={form.industry} onChange={(e) => set("industry", e.target.value)} />
          </label>
          <label className="text-sm">
            <span className="mb-1.5 block font-semibold text-navy-700">Rating</span>
            <select className="field" value={form.rating} onChange={(e) => set("rating", e.target.value)}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} star{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1.5 block font-semibold text-navy-700">Status</span>
            <select className="field" value={form.status} onChange={(e) => set("status", e.target.value)}>
              <option>Published</option>
              <option>Draft</option>
            </select>
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="mb-1.5 block font-semibold text-navy-700">Review *</span>
            <textarea
              rows={4}
              className="field"
              value={form.review}
              onChange={(e) => set("review", e.target.value)}
            />
          </label>
        </div>

        {error && <p className="mt-4 text-xs font-semibold text-destructive">{error}</p>}

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button className="btn-base btn-ghost-navy" onClick={() => setEditing(null)}>
            Cancel
          </button>
          <button className="btn-base btn-accent" onClick={save}>
            Save Testimonial
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          testimonialsOps.remove(confirm.id);
          setToast("Testimonial deleted");
        }}
        message={`Delete the testimonial from ${confirm?.name}?`}
      />
      <Toast message={toast} />
    </AdminLayout>
  );
}

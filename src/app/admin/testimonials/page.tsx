"use client";

import { useEffect, useState } from "react";
import AdminLayout, { EmptyState, StatusPill, Toast, useToast } from "@/components/admin/AdminLayout";
import ImageUpload from "@/components/admin/ImageUpload";
import Icon from "@/components/ui/Icon";

interface Testimonial {
  _id: string;
  name: string;
  company: string;
  role: string;
  industry: string;
  rating: number;
  content: string;
  avatar: string;
  status: "Approved" | "Pending" | "Rejected";
  featured: boolean;
  sortOrder: number;
  createdAt: string;
}

const emptyTestimonial: Omit<Testimonial, "_id" | "createdAt"> = {
  name: "",
  company: "",
  role: "Facility Manager",
  industry: "Corporate Offices",
  rating: 5,
  content: "",
  avatar: "",
  status: "Approved",
  featured: false,
  sortOrder: 1,
};

function Stars({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Icon
          key={n}
          name="star"
          className={`h-3.5 w-3.5 ${n <= value ? "text-gold" : "text-border"}`}
        />
      ))}
    </span>
  );
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [viewing, setViewing] = useState<Testimonial | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState(emptyTestimonial);
  const [saving, setSaving] = useState(false);
  const [toastMessage, showToast] = useToast();

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      if (Array.isArray(data)) setTestimonials(data);
    } catch (err) {
      console.error("Failed to load testimonials:", err);
      showToast("Error loading testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const openCreate = () => {
    setFormData({
      ...emptyTestimonial,
      sortOrder: testimonials.length + 1,
    });
    setIsCreating(true);
    setEditing(null);
    setViewing(null);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setFormData({
      name: t.name,
      company: t.company || "",
      role: t.role || "",
      industry: t.industry || "",
      rating: t.rating || 5,
      content: t.content || (t as any).review || "",
      avatar: t.avatar || (t as any).image || "",
      status: t.status || "Approved",
      featured: !!t.featured,
      sortOrder: t.sortOrder || 1,
    });
    setIsCreating(false);
    setViewing(null);
  };

  const closeModal = () => {
    setEditing(null);
    setIsCreating(false);
    setViewing(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.content.trim()) {
      showToast("Name and testimonial content are required.");
      return;
    }

    setSaving(true);
    try {
      if (isCreating) {
        const res = await fetch("/api/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to add testimonial");
        showToast("Testimonial added successfully!");
      } else if (editing) {
        const res = await fetch(`/api/testimonials/${editing._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update testimonial");
        showToast("Testimonial updated!");
      }

      closeModal();
      loadTestimonials();
    } catch (err: any) {
      showToast(err?.message || "Operation failed.");
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (id: string, status: "Approved" | "Pending" | "Rejected") => {
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Status update failed");
      showToast(`Status changed to ${status}`);
      loadTestimonials();
      if (viewing && viewing._id === id) {
        setViewing({ ...viewing, status });
      }
    } catch (err: any) {
      showToast(err?.message || "Failed to update status");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete testimonial by "${name}"?`)) return;
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      showToast("Testimonial deleted.");
      if (viewing && viewing._id === id) setViewing(null);
      loadTestimonials();
    } catch (err: any) {
      showToast(err?.message || "Failed to delete.");
    }
  };

  return (
    <AdminLayout
      title="Client Testimonials Management"
      description="Verified client feedback, trust ratings and customer reviews published on the website"
      actions={
        <button
          onClick={openCreate}
          className="btn-base btn-accent text-xs flex items-center gap-1.5 py-2 px-3.5 shadow-sm"
        >
          <Icon name="plus" className="w-3.5 h-3.5" /> Add Testimonial
        </button>
      }
    >
      <Toast message={toastMessage} />

      {loading ? (
        <div className="py-20 text-center">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent inline-block" />
          <p className="mt-2 text-xs font-semibold text-muted-foreground">Loading testimonials…</p>
        </div>
      ) : testimonials.length === 0 ? (
        <EmptyState message="No testimonials yet. Click 'Add Testimonial' to create one." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <article 
              key={t._id} 
              className="rounded-2xl border border-border bg-card p-5 shadow-xs hover:shadow-card transition-all duration-200 flex flex-col justify-between group hover:border-gold/30"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {t.avatar || (t as any).image ? (
                      <img
                        src={t.avatar || (t as any).image}
                        alt={t.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gold/20 shrink-0 shadow-xs"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-gold/20 to-navy/10 text-navy font-bold text-base flex items-center justify-center border border-gold/30 shrink-0 shadow-xs">
                        {t.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h2 className="text-sm font-bold text-navy truncate" title={t.name}>{t.name}</h2>
                      <p className="text-[11px] text-muted-foreground truncate" title={`${t.role || ""} · ${t.company || ""}`}>
                        {t.role ? `${t.role} · ` : ""}{t.company || "Client"}
                      </p>
                      {t.industry && (
                        <span className="inline-block mt-0.5 text-[10px] font-semibold text-gold bg-gold/10 px-2 py-0.5 rounded-full">
                          {t.industry}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <StatusPill value={t.status} />
                    {t.featured && (
                      <span className="text-[9px] font-bold text-navy bg-navy/10 px-1.5 py-0.5 rounded text-center">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3.5 flex items-center justify-between bg-surface-subtle/50 px-2.5 py-1.5 rounded-lg border border-border/60">
                  <Stars value={t.rating} />
                  <span className="text-[11px] font-bold text-navy">{t.rating}.0 / 5.0</span>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-navy-700 italic line-clamp-3 bg-surface-subtle/30 p-2.5 rounded-lg border border-border/40">
                  “{t.content || (t as any).review}”
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/80 flex flex-wrap items-center justify-between gap-2">
                {/* View, Edit, Delete Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    className="bg-white border border-border shadow-2xs hover:bg-navy hover:text-white text-navy text-xs font-semibold py-1.5 px-2.5 rounded-lg inline-flex items-center gap-1 transition-all"
                    onClick={() => setViewing(t)}
                    title="View Testimonial Details"
                  >
                    <Icon name="eye" className="w-3.5 h-3.5" /> View
                  </button>
                  <button
                    className="bg-gold/10 hover:bg-gold hover:text-white text-gold border border-gold/30 text-xs font-semibold py-1.5 px-2.5 rounded-lg inline-flex items-center gap-1 transition-all"
                    onClick={() => openEdit(t)}
                    title="Edit Testimonial"
                  >
                    <Icon name="sliders" className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    className="border border-destructive/30 text-destructive hover:bg-destructive hover:text-white text-xs font-semibold p-1.5 rounded-lg inline-flex items-center transition-all shadow-2xs"
                    onClick={() => handleDelete(t._id, t.name)}
                    title="Delete Testimonial"
                  >
                    <Icon name="x" className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  {t.status !== "Approved" && (
                    <button
                      onClick={() => updateStatus(t._id, "Approved")}
                      className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-bold transition-colors border border-emerald-200"
                      title="Approve Testimonial"
                    >
                      ✓ Approve
                    </button>
                  )}
                  {t.status !== "Rejected" && (
                    <button
                      onClick={() => updateStatus(t._id, "Rejected")}
                      className="px-2 py-1 rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100 text-[11px] font-bold transition-colors border border-rose-200"
                      title="Reject Testimonial"
                    >
                      ✕ Reject
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* View Testimonial Detail Modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg my-8 rounded-2xl bg-card p-6 shadow-lift border border-border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-gold/10 text-gold">
                  <Icon name="star" className="w-4 h-4" />
                </span>
                <h2 className="font-display text-base font-bold text-navy">Testimonial Details</h2>
              </div>
              <button onClick={() => setViewing(null)} className="p-1 text-muted-foreground hover:text-navy rounded-lg hover:bg-surface-subtle">
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="flex items-center gap-3.5 p-3 rounded-xl bg-surface-subtle border border-border">
                {viewing.avatar || (viewing as any).image ? (
                  <img
                    src={viewing.avatar || (viewing as any).image}
                    alt={viewing.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-gold/30 shadow-xs shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-linear-to-br from-gold/30 to-navy/10 text-navy font-bold text-lg flex items-center justify-center border border-gold/30 shrink-0">
                    {viewing.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-bold text-navy">{viewing.name}</h3>
                  <p className="text-xs text-muted-foreground">{viewing.role || "Client"} · {viewing.company || "Direct Feedback"}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusPill value={viewing.status} />
                    {viewing.industry && (
                      <span className="text-[10px] font-semibold text-gold bg-gold/10 px-2 py-0.5 rounded-full">
                        {viewing.industry}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-card border border-border/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-navy">Rating Score:</span>
                  <div className="flex items-center gap-2">
                    <Stars value={viewing.rating} />
                    <span className="font-bold text-navy">{viewing.rating} / 5</span>
                  </div>
                </div>
                {viewing.sortOrder && (
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Display Sort Order:</span>
                    <span className="font-semibold text-navy">#{viewing.sortOrder}</span>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-navy mb-1.5">Client Review / Statement:</h4>
                <blockquote className="p-4 rounded-xl bg-surface-subtle border-l-4 border-gold text-xs leading-relaxed text-navy italic">
                  “{viewing.content || (viewing as any).review}”
                </blockquote>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  {viewing.status !== "Approved" && (
                    <button
                      onClick={() => updateStatus(viewing._id, "Approved")}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold transition-colors"
                    >
                      ✓ Approve
                    </button>
                  )}
                  {viewing.status !== "Rejected" && (
                    <button
                      onClick={() => updateStatus(viewing._id, "Rejected")}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 text-xs font-bold transition-colors"
                    >
                      ✕ Reject
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const item = viewing;
                      setViewing(null);
                      openEdit(item);
                    }}
                    className="btn-base btn-secondary py-1.5 px-3 text-xs flex items-center gap-1"
                  >
                    <Icon name="sliders" className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => setViewing(null)}
                    className="btn-base btn-primary py-1.5 px-4 text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {(isCreating || editing) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl my-8 rounded-2xl bg-card p-6 shadow-lift border border-border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <h2 className="font-display text-lg font-bold text-navy">
                {isCreating ? "Add Client Testimonial" : `Edit Testimonial: ${editing?.name}`}
              </h2>
              <button onClick={closeModal} className="p-1 text-muted-foreground hover:text-navy">
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    className="field text-xs"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Rajesh Sharma"
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Company / Society Name</label>
                  <input
                    type="text"
                    className="field text-xs"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g., Blue Ridge Housing Society"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-navy mb-1">Designation / Role</label>
                  <input
                    type="text"
                    className="field text-xs"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Secretary / Admin Head"
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Industry</label>
                  <input
                    type="text"
                    className="field text-xs"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="Residential / IT"
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Star Rating (1-5)</label>
                  <select
                    className="field text-xs"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                    <option value={2}>2 Stars ★★☆☆☆</option>
                    <option value={1}>1 Star ★☆☆☆☆</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-navy mb-1">Testimonial Review *</label>
                <textarea
                  rows={4}
                  required
                  className="field text-xs"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Detailed customer experience and feedback..."
                />
              </div>

              <ImageUpload
                label="Client Avatar / Photo (Optional Cloudinary Upload)"
                value={formData.avatar}
                onChange={(url) => setFormData({ ...formData, avatar: url })}
                folder="diamond_facility/testimonials"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy mb-1">Status</label>
                  <select
                    className="field text-xs"
                    value={formData.status}
                    onChange={(e: any) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Approved">Approved (Public)</option>
                    <option value="Pending">Pending Review</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Sort Order</label>
                  <input
                    type="number"
                    className="field text-xs"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-base btn-secondary py-2 px-4 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-base btn-accent py-2 px-5 text-xs flex items-center gap-1.5"
                >
                  {saving ? (
                    <>
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Saving…
                    </>
                  ) : (
                    "Save Testimonial"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

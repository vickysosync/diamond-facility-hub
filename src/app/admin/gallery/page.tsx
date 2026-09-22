"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout, { EmptyState, StatusPill, Toast, useToast } from "@/components/admin/AdminLayout";
import ImageUpload from "@/components/admin/ImageUpload";
import Modal, { ConfirmDialog } from "@/components/ui/Modal";
import Icon from "@/components/ui/Icon";

interface GalleryItem {
  _id: string;
  title: string;
  description?: string;
  image: string;
  category: string;
  altText?: string;
  sortOrder: number;
  status: "Active" | "Inactive";
  createdAt?: string;
}

const emptyItem: Omit<GalleryItem, "_id"> = {
  title: "",
  description: "",
  image: "",
  category: "Security Operations",
  altText: "",
  sortOrder: 1,
  status: "Active",
};

const defaultCategories = [
  "Security Operations",
  "Housekeeping & Sanitization",
  "Tank Cleaning & Hygiene",
  "Civil & Technical Upkeep",
  "Pest Management",
  "Integrated Facility",
  "Events & Bouncers",
  "Landscaping & Gardening",
];

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [viewing, setViewing] = useState<GalleryItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Omit<GalleryItem, "_id">>(emptyItem);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [saving, setSaving] = useState(false);
  const [toastMessage, showToast] = useToast();

  const loadGallery = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (Array.isArray(data)) {
        setItems(data);
      }
    } catch (err) {
      console.error("Failed to load gallery:", err);
      showToast("Error loading gallery items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const openCreate = () => {
    setFormData({
      ...emptyItem,
      sortOrder: items.length + 1,
    });
    setIsCreating(true);
    setEditing(null);
    setViewing(null);
  };

  const openEdit = (item: GalleryItem) => {
    setEditing(item);
    setViewing(null);
    setFormData({
      title: item.title,
      description: item.description || "",
      image: item.image,
      category: item.category,
      altText: item.altText || "",
      sortOrder: item.sortOrder || 1,
      status: item.status || "Active",
    });
    setIsCreating(false);
  };

  const closeModal = () => {
    setEditing(null);
    setIsCreating(false);
    setViewing(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.image.trim()) {
      showToast("Title and image are required.");
      return;
    }

    setSaving(true);
    try {
      if (isCreating) {
        const res = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create gallery item");
        showToast("Gallery visual added successfully!");
      } else if (editing) {
        const res = await fetch(`/api/gallery/${editing._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update gallery item");
        showToast("Gallery visual updated!");
      }

      closeModal();
      loadGallery();
    } catch (err: any) {
      showToast(err?.message || "Operation failed.");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (item: GalleryItem) => {
    const nextStatus = item.status === "Active" ? "Inactive" : "Active";
    try {
      const res = await fetch(`/api/gallery/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error("Status update failed");
      showToast(`Status changed to ${nextStatus}`);
      loadGallery();
    } catch (err: any) {
      showToast(err?.message || "Failed to update status");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/gallery/${deleteTarget._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      showToast("Gallery item removed successfully.");
      setDeleteTarget(null);
      loadGallery();
    } catch (err: any) {
      showToast(err?.message || "Failed to delete item");
    }
  };

  const categories = useMemo(() => {
    const set = new Set<string>(defaultCategories);
    items.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return ["All", ...Array.from(set)];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat = selectedCategory === "All" || item.category === selectedCategory;
      const term = search.toLowerCase().trim();
      const matchSearch =
        !term ||
        item.title.toLowerCase().includes(term) ||
        (item.description && item.description.toLowerCase().includes(term)) ||
        item.category.toLowerCase().includes(term);
      return matchCat && matchSearch;
    });
  }, [items, selectedCategory, search]);

  return (
    <AdminLayout
      title="Photo Gallery & Visuals"
      description="Manage on-site operations imagery, Cloudinary uploads and category filters"
      actions={
        <button
          onClick={openCreate}
          className="btn-base btn-accent text-xs flex items-center gap-1.5 py-2 px-3.5"
        >
          <Icon name="plus" className="w-3.5 h-3.5" /> Add Gallery Visual
        </button>
      }
    >
      <Toast message={toastMessage} />

      {/* Filter and Search */}
      <div className="mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
                selectedCategory === cat
                  ? "border-gold bg-gold text-white shadow-xs"
                  : "border-border bg-card text-navy hover:border-gold/60"
              }`}
            >
              {cat}
              <span className="ml-1 opacity-70 font-normal">
                ({cat === "All" ? items.length : items.filter((i) => i.category === cat).length})
              </span>
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            className="field text-xs py-1.5"
            placeholder="Search visuals…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table or Cards */}
      {loading ? (
        <div className="py-20 text-center text-xs text-muted-foreground">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent inline-block" />
          <p className="mt-2 font-semibold">Loading gallery items from MongoDB…</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <EmptyState message="No gallery visuals found. Click 'Add Gallery Visual' to upload photos via Cloudinary." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card flex flex-col justify-between"
            >
              <div className="relative aspect-4/3 w-full bg-muted">
                <img
                  src={item.image}
                  alt={item.altText || item.title}
                  className="h-full w-full object-cover"
                />
                <span className="absolute top-2.5 left-2.5 rounded bg-navy/90 px-2 py-0.5 text-[10px] font-bold text-gold border border-gold/20">
                  {item.category}
                </span>
                <span className="absolute top-2.5 right-2.5">
                  <StatusPill value={item.status} />
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-navy text-sm line-clamp-1">{item.title}</h3>
                  {item.description && (
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  {item.altText && (
                    <p className="mt-2 text-[10px] text-muted-foreground/70 font-mono line-clamp-1">
                      Alt: {item.altText}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs gap-1.5">
                  <button
                    type="button"
                    onClick={() => setViewing(item)}
                    className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-semibold bg-white border border-border shadow-xs hover:bg-navy hover:text-white text-navy transition-all"
                  >
                    <Icon name="eye" className="w-3.5 h-3.5 text-gold" /> View
                  </button>

                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-semibold bg-gold/10 hover:bg-gold hover:text-white text-gold border border-gold/30 transition-all"
                  >
                    <Icon name="sliders" className="w-3.5 h-3.5" /> Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
                    className="p-1.5 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive hover:text-white transition-all shadow-xs"
                    title="Delete Visual"
                  >
                    <Icon name="trash" className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Gallery Detail Modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl my-8 rounded-2xl bg-card p-6 shadow-lift border border-border max-h-[90vh] overflow-y-auto animate-in fade-in">
            <div className="flex items-start justify-between pb-3 border-b border-border mb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gold block mb-1">
                  Category: {viewing.category}
                </span>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-lg font-bold text-navy">{viewing.title}</h2>
                  <StatusPill value={viewing.status} />
                </div>
              </div>
              <button onClick={() => setViewing(null)} className="p-1 text-muted-foreground hover:text-navy">
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 rounded-xl overflow-hidden border border-border max-h-72 bg-navy flex items-center justify-center">
              <img src={viewing.image} alt={viewing.altText || viewing.title} className="w-full h-full object-contain max-h-72" />
            </div>

            <div className="space-y-4 text-xs">
              {viewing.description && (
                <div>
                  <p className="font-bold text-navy mb-1">Visual Description</p>
                  <p className="text-muted-foreground leading-relaxed bg-mist/50 p-3 rounded-xl border border-border/50">
                    {viewing.description}
                  </p>
                </div>
              )}

              {viewing.altText && (
                <div className="bg-mist/30 p-2.5 rounded-lg border border-border/50">
                  <span className="text-muted-foreground block text-[11px]">SEO Alt Text</span>
                  <span className="font-mono text-navy font-semibold">{viewing.altText}</span>
                </div>
              )}

              <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
                <a
                  href="/gallery"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-base btn-secondary text-xs py-2 px-3.5 inline-flex items-center gap-1.5"
                >
                  <Icon name="file" className="w-3.5 h-3.5 text-gold" /> View on Live Gallery ↗
                </a>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const it = viewing;
                      setViewing(null);
                      openEdit(it);
                    }}
                    className="btn-base btn-accent text-xs py-2 px-4 inline-flex items-center gap-1.5"
                  >
                    <Icon name="sliders" className="w-3.5 h-3.5" /> Edit Visual
                  </button>
                  <button onClick={() => setViewing(null)} className="btn-base btn-ghost-navy text-xs py-2 px-3">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {(isCreating || editing) && (
        <Modal
          open={isCreating || !!editing}
          onClose={closeModal}
          title={isCreating ? "Add Gallery Visual" : `Edit: ${editing?.title}`}
          maxWidth="max-w-3xl"
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-navy mb-1">Image Upload (Cloudinary) *</label>
              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData((f) => ({ ...f, image: url }))}
                folder="diamond_gallery"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block font-bold text-navy mb-1">Visual Title *</label>
                <input
                  type="text"
                  required
                  className="field text-xs"
                  placeholder="e.g., Corporate Office Security Guard Briefing"
                  value={formData.title}
                  onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
                />
              </div>

              <div>
                <label className="block font-bold text-navy mb-1">Category / Tag *</label>
                <input
                  type="text"
                  required
                  list="category-options"
                  className="field text-xs"
                  placeholder="Select or enter category"
                  value={formData.category}
                  onChange={(e) => setFormData((f) => ({ ...f, category: e.target.value }))}
                />
                <datalist id="category-options">
                  {defaultCategories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block font-bold text-navy mb-1">Sort Order Index</label>
                <input
                  type="number"
                  min={1}
                  className="field text-xs"
                  value={formData.sortOrder}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, sortOrder: Number(e.target.value) || 1 }))
                  }
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-navy mb-1">SEO Image Alt Text</label>
                <input
                  type="text"
                  className="field text-xs"
                  placeholder="Descriptive alt text for accessibility and SEO ranking"
                  value={formData.altText}
                  onChange={(e) => setFormData((f) => ({ ...f, altText: e.target.value }))}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-navy mb-1">Short Description</label>
                <textarea
                  rows={2}
                  className="field text-xs"
                  placeholder="Brief context regarding the deployment or site shown…"
                  value={formData.description}
                  onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
                />
              </div>

              <div>
                <label className="block font-bold text-navy mb-1">Publication Status</label>
                <select
                  className="field text-xs"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, status: e.target.value as "Active" | "Inactive" }))
                  }
                >
                  <option value="Active">Active (Visible on public gallery)</option>
                  <option value="Inactive">Inactive (Hidden)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <button
                type="button"
                className="btn-base btn-secondary text-xs py-2 px-4"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-base btn-accent text-xs py-2 px-5 font-bold"
              >
                {saving ? "Saving…" : isCreating ? "Upload & Publish" : "Save Changes"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <ConfirmDialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
          title="Delete Gallery Visual"
          message={`Are you sure you want to delete "${deleteTarget.title}"? This cannot be undone.`}
        />
      )}
    </AdminLayout>
  );
}

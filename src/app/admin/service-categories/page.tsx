"use client";

import { useEffect, useState } from "react";
import AdminLayout, { EmptyState, StatusPill, Toast, useToast } from "@/components/admin/AdminLayout";
import ImageUpload from "@/components/admin/ImageUpload";
import Icon from "@/components/ui/Icon";
import { formatINR } from "@/data/mock";

interface Category {
  _id: string;
  name: string;
  slug: string;
  categoryNumber: string;
  shortDescription: string;
  description: string;
  icon: string;
  image: string;
  features: string[];
  startingPrice: number;
  priceNote: string;
  pricingType: "Monthly" | "Per Shift" | "Per SqFt" | "Per Visit" | "Custom Quote";
  status: "Active" | "Inactive";
  sortOrder: number;
}

const emptyCategory: Omit<Category, "_id"> = {
  name: "",
  slug: "",
  categoryNumber: "01",
  shortDescription: "",
  description: "",
  icon: "layers",
  image: "/images/security.jpg",
  features: [],
  startingPrice: 0,
  priceNote: "per month",
  pricingType: "Monthly",
  status: "Active",
  sortOrder: 1,
};

export default function AdminServiceCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [viewing, setViewing] = useState<Category | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Omit<Category, "_id">>(emptyCategory);
  const [featureInput, setFeatureInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [toastMessage, showToast] = useToast();

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/service-categories");
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(data);
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
      showToast("Error loading categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreate = () => {
    setFormData({
      ...emptyCategory,
      categoryNumber: String(categories.length + 1).padStart(2, "0"),
      sortOrder: categories.length + 1,
    });
    setFeatureInput("");
    setIsCreating(true);
    setEditing(null);
    setViewing(null);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setViewing(null);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      categoryNumber: cat.categoryNumber,
      shortDescription: cat.shortDescription || "",
      description: cat.description || "",
      icon: cat.icon || "layers",
      image: cat.image || "",
      features: cat.features || [],
      startingPrice: cat.startingPrice || 0,
      priceNote: cat.priceNote || "",
      pricingType: cat.pricingType || "Monthly",
      status: cat.status || "Active",
      sortOrder: cat.sortOrder || 1,
    });
    setFeatureInput((cat.features || []).join("\n"));
    setIsCreating(false);
  };

  const closeModal = () => {
    setEditing(null);
    setIsCreating(false);
    setViewing(null);
  };

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData((prev) => ({
      ...prev,
      name,
      slug: isCreating ? slug : prev.slug,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) {
      showToast("Category name and slug are required.");
      return;
    }

    setSaving(true);
    try {
      const features = featureInput
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        features,
      };

      if (isCreating) {
        const res = await fetch("/api/service-categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create category");
        showToast("Service category created successfully!");
      } else if (editing) {
        const res = await fetch(`/api/service-categories/${editing._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update category");
        showToast("Service category updated successfully!");
      }

      closeModal();
      loadCategories();
    } catch (err: any) {
      showToast(err?.message || "Operation failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      const res = await fetch(`/api/service-categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      showToast("Category deleted.");
      loadCategories();
    } catch (err: any) {
      showToast(err?.message || "Failed to delete.");
    }
  };

  return (
    <AdminLayout
      title="11 Main Service Categories"
      description="Official service divisions from the company business card"
      actions={
        <button
          onClick={openCreate}
          className="btn-base btn-accent text-xs flex items-center gap-1.5 py-2 px-3.5"
        >
          <Icon name="plus" className="w-3.5 h-3.5" /> Add Service Category
        </button>
      }
    >
      <Toast message={toastMessage} />

      {loading ? (
        <div className="py-20 text-center">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent inline-block" />
          <p className="mt-2 text-xs font-semibold text-muted-foreground">Loading service categories…</p>
        </div>
      ) : categories.length === 0 ? (
        <EmptyState message="No service categories found. Click 'Add Service Category' or seed the database." />
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-mist/70 border-b border-border text-navy font-bold">
                <tr>
                  <th className="p-3.5 w-12">#</th>
                  <th className="p-3.5">Category Name</th>
                  <th className="p-3.5">Slug</th>
                  <th className="p-3.5">Features Count</th>
                  <th className="p-3.5">Starting Price</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-gold">{cat.categoryNumber || cat.sortOrder}</td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        {cat.image ? (
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-10 h-9 rounded-lg object-cover border border-border shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-9 rounded-lg bg-navy/10 flex items-center justify-center text-navy font-bold shrink-0">
                            <Icon name={cat.icon || "layers"} className="w-4 h-4 text-gold" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-sm text-navy">{cat.name}</p>
                          <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-sm">
                            {cat.shortDescription}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-muted-foreground">{cat.slug}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-navy">
                        {cat.features?.length || 0} items
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-navy">
                      {cat.startingPrice ? formatINR(cat.startingPrice) : "Custom"}
                      <span className="block text-[10px] font-normal text-muted-foreground">{cat.priceNote}</span>
                    </td>
                    <td className="p-3.5">
                      <StatusPill value={cat.status} />
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          type="button"
                          onClick={() => setViewing(cat)}
                          className="px-2.5 py-1.5 rounded-lg border border-border bg-white text-navy hover:bg-navy hover:text-white text-xs font-semibold inline-flex items-center gap-1 transition-all shadow-xs"
                          title="View Details"
                        >
                          <Icon name="eye" className="w-3.5 h-3.5 text-gold" /> View
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(cat)}
                          className="px-2.5 py-1.5 rounded-lg border border-gold/30 bg-gold/10 text-gold hover:bg-gold hover:text-white text-xs font-semibold inline-flex items-center gap-1 transition-all shadow-xs"
                          title="Edit Category"
                        >
                          <Icon name="sliders" className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat._id, cat.name)}
                          className="p-1.5 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive hover:text-white text-xs font-semibold inline-flex items-center transition-all shadow-xs"
                          title="Delete Category"
                        >
                          <Icon name="x" className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Category Detail Modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl my-8 rounded-2xl bg-card p-6 shadow-lift border border-border max-h-[90vh] overflow-y-auto animate-in fade-in">
            <div className="flex items-start justify-between pb-3 border-b border-border mb-4">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold border border-gold/30 font-bold font-mono text-base">
                  {viewing.categoryNumber || viewing.sortOrder}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-lg font-bold text-navy">{viewing.name}</h2>
                    <StatusPill value={viewing.status} />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">URL Slug: /services/{viewing.slug}</span>
                </div>
              </div>
              <button onClick={() => setViewing(null)} className="p-1 text-muted-foreground hover:text-navy">
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            {viewing.image && (
              <div className="mb-4 rounded-xl overflow-hidden border border-border max-h-56 bg-navy/5">
                <img src={viewing.image} alt={viewing.name} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-mist/50 p-3 rounded-xl border border-border/50">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Pricing Model</span>
                  <span className="font-bold text-navy text-sm">
                    {viewing.startingPrice ? formatINR(viewing.startingPrice) : "Custom Proposal"}
                  </span>
                  <span className="text-[11px] text-muted-foreground block">{viewing.priceNote}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Billing Type</span>
                  <span className="font-bold text-gold text-sm">{viewing.pricingType}</span>
                </div>
              </div>

              <div>
                <p className="font-bold text-navy mb-1">Overview & Scope</p>
                <p className="text-muted-foreground leading-relaxed bg-mist/30 p-3 rounded-xl border border-border/50">
                  {viewing.description || viewing.shortDescription}
                </p>
              </div>

              {viewing.features?.length ? (
                <div>
                  <p className="font-bold text-navy mb-1.5">Official Sub-services & Activities ({viewing.features.length})</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {viewing.features.map((f, i) => (
                      <div
                        key={i}
                        className="px-2.5 py-1.5 rounded-lg bg-navy/5 text-navy font-medium border border-border/60 flex items-center gap-1.5"
                      >
                        <Icon name="check" className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
                <a
                  href={`/services/${viewing.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-base btn-secondary text-xs py-2 px-3.5 inline-flex items-center gap-1.5"
                >
                  <Icon name="file" className="w-3.5 h-3.5 text-gold" /> View on Live Website ↗
                </a>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const cat = viewing;
                      setViewing(null);
                      openEdit(cat);
                    }}
                    className="btn-base btn-accent text-xs py-2 px-4 inline-flex items-center gap-1.5"
                  >
                    <Icon name="sliders" className="w-3.5 h-3.5" /> Edit Category
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

      {/* Create / Edit Modal */}
      {(isCreating || editing) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl my-8 rounded-2xl bg-card p-6 shadow-lift border border-border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <h2 className="font-display text-lg font-bold text-navy">
                {isCreating ? "Add Service Category" : `Edit Category: ${editing?.name}`}
              </h2>
              <button onClick={closeModal} className="p-1 text-muted-foreground hover:text-navy">
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-navy mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    className="field text-xs"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g., Security Guard Services"
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Category # (01-11)</label>
                  <input
                    type="text"
                    className="field text-xs font-mono"
                    value={formData.categoryNumber}
                    onChange={(e) => setFormData({ ...formData, categoryNumber: e.target.value })}
                    placeholder="01"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    className="field text-xs font-mono"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="security-guard-services"
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Icon Key</label>
                  <select
                    className="field text-xs"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  >
                    <option value="shield">shield (Security)</option>
                    <option value="sparkles">sparkles (Housekeeping)</option>
                    <option value="building">building (Property)</option>
                    <option value="bug">bug (Pest Control)</option>
                    <option value="users">users (Bouncer/Manpower)</option>
                    <option value="layers">layers (Facility Mgmt)</option>
                    <option value="droplet">droplet (Tank/Garden)</option>
                    <option value="video">video (CCTV)</option>
                    <option value="roller">roller (Painting/Plumbing)</option>
                    <option value="gear">gear (Repairs)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-navy mb-1">Short Description (for cards)</label>
                <input
                  type="text"
                  className="field text-xs"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Concise 1-sentence summary"
                />
              </div>

              <div>
                <label className="block font-bold text-navy mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  className="field text-xs"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Full category scope, standards and operations..."
                />
              </div>

              <ImageUpload
                label="Category Cover Image (Cloudinary)"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                folder="diamond_facility/categories"
              />

              <div>
                <label className="block font-bold text-navy mb-1">
                  Features / Offerings (One per line)
                </label>
                <textarea
                  rows={4}
                  className="field text-xs font-mono"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder={"Commercial Security Guard\nResidential Society Security\nAccess Control Management\n24/7 Patrolling"}
                />
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Enter each service item or feature on a new line.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-navy mb-1">Starting Price (₹)</label>
                  <input
                    type="number"
                    className="field text-xs"
                    value={formData.startingPrice || ""}
                    onChange={(e) => setFormData({ ...formData, startingPrice: Number(e.target.value) })}
                    placeholder="16500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Price Note</label>
                  <input
                    type="text"
                    className="field text-xs"
                    value={formData.priceNote}
                    onChange={(e) => setFormData({ ...formData, priceNote: e.target.value })}
                    placeholder="per guard / month"
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Pricing Model</label>
                  <select
                    className="field text-xs"
                    value={formData.pricingType}
                    onChange={(e: any) => setFormData({ ...formData, pricingType: e.target.value })}
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Per Shift">Per Shift</option>
                    <option value="Per SqFt">Per SqFt</option>
                    <option value="Per Visit">Per Visit</option>
                    <option value="Custom Quote">Custom Quote</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy mb-1">Status</label>
                  <select
                    className="field text-xs"
                    value={formData.status}
                    onChange={(e: any) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
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
                      Saving to MongoDB…
                    </>
                  ) : (
                    "Save Category"
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

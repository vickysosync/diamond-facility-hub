"use client";

import { useEffect, useState } from "react";
import AdminLayout, { EmptyState, StatusPill, Toast, useToast } from "@/components/admin/AdminLayout";
import ImageUpload from "@/components/admin/ImageUpload";
import Icon from "@/components/ui/Icon";
import { formatINR } from "@/data/mock";

interface Service {
  _id: string;
  name: string;
  slug: string;
  category: string;
  categoryId?: string;
  shortDescription: string;
  description: string;
  features: string[];
  startingPrice: number;
  priceNote: string;
  pricingType: string;
  status: "Active" | "Inactive";
  image: string;
  icon: string;
  sortOrder: number;
}

const emptyService: Omit<Service, "_id"> = {
  name: "",
  slug: "",
  category: "Security Guard Services",
  categoryId: "",
  shortDescription: "",
  description: "",
  features: [],
  startingPrice: 5000,
  priceNote: "per month",
  pricingType: "Monthly",
  status: "Active",
  image: "/images/security.jpg",
  icon: "shield",
  sortOrder: 1,
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [viewing, setViewing] = useState<Service | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState(emptyService);
  const [featureInput, setFeatureInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [toastMessage, showToast] = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [srvRes, catRes] = await Promise.all([
        fetch("/api/services"),
        fetch("/api/service-categories"),
      ]);
      const srvData = await srvRes.json();
      const catData = await catRes.json();

      if (Array.isArray(srvData)) setServices(srvData);
      if (Array.isArray(catData)) setCategories(catData);
    } catch (err) {
      console.error("Failed to load services:", err);
      showToast("Error loading services data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreate = () => {
    const defaultCat = categories[0]?.name || "Security Guard Services";
    const defaultCatId = categories[0]?._id || "";
    setFormData({
      ...emptyService,
      category: defaultCat,
      categoryId: defaultCatId,
      sortOrder: services.length + 1,
    });
    setFeatureInput("");
    setIsCreating(true);
    setEditing(null);
    setViewing(null);
  };

  const openEdit = (s: Service) => {
    setEditing(s);
    setViewing(null);
    const catName = s.category || (s as any).categoryName || categories[0]?.name || "Security Guard Services";
    setFormData({
      name: s.name,
      slug: s.slug,
      category: catName,
      categoryId: s.categoryId || "",
      shortDescription: s.shortDescription || "",
      description: s.description || "",
      features: s.features || [],
      startingPrice: s.startingPrice || 0,
      priceNote: s.priceNote || "",
      pricingType: s.pricingType || "Monthly",
      status: s.status || "Active",
      image: s.image || "",
      icon: s.icon || "shield",
      sortOrder: s.sortOrder || 1,
    });
    setFeatureInput((s.features || []).join("\n"));
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

  const handleCategorySelect = (catName: string) => {
    const found = categories.find((c) => c.name === catName);
    setFormData((prev) => ({
      ...prev,
      category: catName,
      categoryId: found ? found._id : "",
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) {
      showToast("Service name and slug are required.");
      return;
    }

    setSaving(true);
    try {
      const features = featureInput
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean);

      const categoryValue = formData.category || categories[0]?.name || "Security Guard Services";
      const payload = {
        ...formData,
        category: categoryValue,
        categoryName: categoryValue,
        features,
      };

      if (isCreating) {
        const res = await fetch("/api/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create service");
        showToast("Service created successfully!");
      } else if (editing) {
        const res = await fetch(`/api/services/${editing._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update service");
        showToast("Service updated successfully!");
      }

      closeModal();
      loadData();
    } catch (err: any) {
      showToast(err?.message || "Operation failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete service "${name}"?`)) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      showToast("Service deleted.");
      loadData();
    } catch (err: any) {
      showToast(err?.message || "Failed to delete.");
    }
  };

  return (
    <AdminLayout
      title="Individual Services Management"
      description="Create and organize specialized service offerings across categories"
      actions={
        <button
          onClick={openCreate}
          className="btn-base btn-accent text-xs flex items-center gap-1.5 py-2 px-3.5"
        >
          <Icon name="plus" className="w-3.5 h-3.5" /> Add Service
        </button>
      }
    >
      <Toast message={toastMessage} />

      {loading ? (
        <div className="py-20 text-center">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent inline-block" />
          <p className="mt-2 text-xs font-semibold text-muted-foreground">Loading services from MongoDB…</p>
        </div>
      ) : services.length === 0 ? (
        <EmptyState message="No individual services found. Click 'Add Service' to create one." />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((s) => (
            <article
              key={s._id}
              className="group overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-40 w-full overflow-hidden bg-slate-100 border-b border-border">
                  {s.image ? (
                    <img
                      src={s.image}
                      alt={s.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full bg-navy/5 flex items-center justify-center text-gold">
                      <Icon name="layers" className="w-8 h-8" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <StatusPill value={s.status} />
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-navy/80 backdrop-blur-xs text-gold px-2.5 py-1 rounded-md border border-gold/30">
                      {s.category || (s as any).categoryName || "General"}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h2 className="text-base font-bold text-navy group-hover:text-gold transition-colors">
                    {s.name}
                  </h2>
                  <span className="text-[11px] font-mono text-muted-foreground block mb-2">/{s.slug}</span>

                  <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                    {s.shortDescription || s.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">Starting Rate</span>
                      <p className="text-sm font-bold text-navy">
                        {s.startingPrice ? formatINR(s.startingPrice) : "Custom"}{" "}
                        <span className="text-[11px] font-normal text-muted-foreground">/{s.priceNote}</span>
                      </p>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-gold/10 text-gold font-bold">
                      {s.pricingType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: View, Edit, Delete */}
              <div className="p-4 pt-3 bg-mist/40 border-t border-border flex items-center justify-between gap-2">
                <button
                  type="button"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-white border border-border shadow-xs hover:bg-navy hover:text-white text-navy transition-all"
                  onClick={() => setViewing(s)}
                >
                  <Icon name="eye" className="w-3.5 h-3.5 text-gold" /> View
                </button>

                <button
                  type="button"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-gold/10 hover:bg-gold hover:text-white text-gold border border-gold/30 transition-all"
                  onClick={() => openEdit(s)}
                >
                  <Icon name="sliders" className="w-3.5 h-3.5" /> Edit
                </button>

                <button
                  type="button"
                  className="p-1.5 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive hover:text-white transition-all shadow-xs"
                  onClick={() => handleDelete(s._id, s.name)}
                  title="Delete Service"
                >
                  <Icon name="x" className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* View Service Detail Modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl my-8 rounded-2xl bg-card p-6 shadow-lift border border-border max-h-[90vh] overflow-y-auto animate-in fade-in">
            <div className="flex items-start justify-between pb-3 border-b border-border mb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gold block mb-1">
                  Category: {viewing.category || (viewing as any).categoryName || "General"}
                </span>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-lg font-bold text-navy">{viewing.name}</h2>
                  <StatusPill value={viewing.status} />
                </div>
                <span className="text-xs font-mono text-muted-foreground">URL Slug: /{viewing.slug}</span>
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
                  <span className="text-muted-foreground block text-[11px]">Starting Price</span>
                  <span className="font-bold text-navy text-sm">
                    {viewing.startingPrice ? formatINR(viewing.startingPrice) : "Custom Rate"}
                  </span>
                  <span className="text-[11px] text-muted-foreground block">{viewing.priceNote}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Pricing Model</span>
                  <span className="font-bold text-gold text-sm">{viewing.pricingType}</span>
                </div>
              </div>

              <div>
                <p className="font-bold text-navy mb-1">Service Description</p>
                <p className="text-muted-foreground leading-relaxed bg-mist/30 p-3 rounded-xl border border-border/50">
                  {viewing.description || viewing.shortDescription}
                </p>
              </div>

              {viewing.features?.length ? (
                <div>
                  <p className="font-bold text-navy mb-1.5">Key Deliverables & Specifications</p>
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
                  href="/services"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-base btn-secondary text-xs py-2 px-3.5 inline-flex items-center gap-1.5"
                >
                  <Icon name="file" className="w-3.5 h-3.5 text-gold" /> View on Live Website ↗
                </a>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const s = viewing;
                      setViewing(null);
                      openEdit(s);
                    }}
                    className="btn-base btn-accent text-xs py-2 px-4 inline-flex items-center gap-1.5"
                  >
                    <Icon name="sliders" className="w-3.5 h-3.5" /> Edit Service
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
                {isCreating ? "Add Individual Service" : `Edit Service: ${editing?.name}`}
              </h2>
              <button onClick={closeModal} className="p-1 text-muted-foreground hover:text-navy">
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy mb-1">Service Name *</label>
                  <input
                    type="text"
                    required
                    className="field text-xs"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g., Armed Security Escort"
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Category Association *</label>
                  <select
                    className="field text-xs"
                    value={formData.category}
                    onChange={(e) => handleCategorySelect(e.target.value)}
                  >
                    {categories.map((c) => (
                      <option key={c._id || c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
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
                    <option value="users">users (Bouncers/Manpower)</option>
                    <option value="layers">layers (Facility Mgmt)</option>
                    <option value="droplet">droplet (Tank/Garden)</option>
                    <option value="video">video (CCTV)</option>
                    <option value="roller">roller (Painting/Plumbing)</option>
                    <option value="gear">gear (Repairs)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-navy mb-1">Short Description *</label>
                <input
                  type="text"
                  required
                  className="field text-xs"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Summary for cards and overviews"
                />
              </div>

              <div>
                <label className="block font-bold text-navy mb-1">Full Description</label>
                <textarea
                  rows={3}
                  className="field text-xs"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <ImageUpload
                label="Service Image (Cloudinary)"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                folder="diamond_facility/services"
              />

              <div>
                <label className="block font-bold text-navy mb-1">
                  Features & Scope (One per line)
                </label>
                <textarea
                  rows={4}
                  className="field text-xs font-mono"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder={"Gun-licensed trained guards\nVIP escort capability\nImmediate dispatch"}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-navy mb-1">Starting Price (₹)</label>
                  <input
                    type="number"
                    className="field text-xs"
                    value={formData.startingPrice || ""}
                    onChange={(e) => setFormData({ ...formData, startingPrice: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Price Note</label>
                  <input
                    type="text"
                    className="field text-xs"
                    value={formData.priceNote}
                    onChange={(e) => setFormData({ ...formData, priceNote: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Pricing Model</label>
                  <select
                    className="field text-xs"
                    value={formData.pricingType}
                    onChange={(e) => setFormData({ ...formData, pricingType: e.target.value })}
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
                      Saving…
                    </>
                  ) : (
                    "Save Service"
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

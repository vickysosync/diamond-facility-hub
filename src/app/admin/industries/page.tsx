"use client";

import { useEffect, useState } from "react";
import AdminLayout, { EmptyState, StatusPill, Toast, useToast } from "@/components/admin/AdminLayout";
import ImageUpload from "@/components/admin/ImageUpload";
import Icon from "@/components/ui/Icon";

interface Industry {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  description: string;
  servicesOffered: string[];
  keyHighlights: string[];
  status: "Active" | "Inactive";
  sortOrder: number;
}

const emptyIndustry: Omit<Industry, "_id"> = {
  name: "",
  slug: "",
  icon: "building",
  image: "",
  description: "",
  servicesOffered: [],
  keyHighlights: [],
  status: "Active",
  sortOrder: 1,
};

export default function AdminIndustriesPage() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Industry | null>(null);
  const [viewing, setViewing] = useState<Industry | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState(emptyIndustry);
  const [highlightsInput, setHighlightsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [toastMessage, showToast] = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [indRes, catRes] = await Promise.all([
        fetch("/api/industries"),
        fetch("/api/service-categories"),
      ]);
      const indData = await indRes.json();
      const catData = await catRes.json();

      if (Array.isArray(indData)) setIndustries(indData);
      if (Array.isArray(catData)) setCategories(catData);
    } catch (err) {
      console.error("Failed to load industries:", err);
      showToast("Error loading industries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreate = () => {
    setFormData({
      ...emptyIndustry,
      sortOrder: industries.length + 1,
    });
    setHighlightsInput("");
    setIsCreating(true);
    setEditing(null);
    setViewing(null);
  };

  const openEdit = (ind: Industry) => {
    setEditing(ind);
    setViewing(null);
    setFormData({
      name: ind.name,
      slug: ind.slug,
      icon: ind.icon || "building",
      image: ind.image || "",
      description: ind.description || "",
      servicesOffered: ind.servicesOffered || [],
      keyHighlights: ind.keyHighlights || [],
      status: ind.status || "Active",
      sortOrder: ind.sortOrder || 1,
    });
    setHighlightsInput((ind.keyHighlights || []).join("\n"));
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

  const toggleServiceOffer = (svcName: string) => {
    setFormData((prev) => {
      const exists = prev.servicesOffered.includes(svcName);
      return {
        ...prev,
        servicesOffered: exists
          ? prev.servicesOffered.filter((s) => s !== svcName)
          : [...prev.servicesOffered, svcName],
      };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) {
      showToast("Industry name and slug are required.");
      return;
    }

    setSaving(true);
    try {
      const keyHighlights = highlightsInput
        .split("\n")
        .map((h) => h.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        keyHighlights,
      };

      if (isCreating) {
        const res = await fetch("/api/industries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create industry");
        showToast("Industry created successfully!");
      } else if (editing) {
        const res = await fetch(`/api/industries/${editing._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update industry");
        showToast("Industry updated successfully!");
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
    if (!confirm(`Are you sure you want to delete industry "${name}"?`)) return;
    try {
      const res = await fetch(`/api/industries/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      showToast("Industry deleted.");
      loadData();
    } catch (err: any) {
      showToast(err?.message || "Failed to delete.");
    }
  };

  return (
    <AdminLayout
      title="Target Industries Management"
      description="Sectors and facility packages catered to by Diamond Integrated Facility Services LLP"
      actions={
        <button
          onClick={openCreate}
          className="btn-base btn-accent text-xs flex items-center gap-1.5 py-2 px-3.5"
        >
          <Icon name="plus" className="w-3.5 h-3.5" /> Add Industry
        </button>
      }
    >
      <Toast message={toastMessage} />

      {loading ? (
        <div className="py-20 text-center">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent inline-block" />
          <p className="mt-2 text-xs font-semibold text-muted-foreground">Loading target industries…</p>
        </div>
      ) : industries.length === 0 ? (
        <EmptyState message="No target industries added yet. Click 'Add Industry'." />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {industries.map((ind) => (
            <article
              key={ind._id}
              className="group overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {ind.image ? (
                  <div className="relative h-36 w-full overflow-hidden bg-navy/5 border-b border-border">
                    <img
                      src={
                        typeof ind.image === "object"
                          ? (ind.image as any)?.secure_url
                          : ind.image && ind.image !== "/images/facility.jpg"
                          ? ind.image
                          : `/images/industries/${ind.slug}.jpg`
                      }
                      alt={ind.name}
                      loading="lazy"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/facility.jpg";
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      <StatusPill value={ind.status} />
                    </div>
                  </div>
                ) : null}

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold/10 text-gold border border-gold/20 shadow-xs">
                        <Icon name={ind.icon || "building"} className="h-5 w-5" />
                      </span>
                      <div>
                        <h2 className="text-base font-bold text-navy group-hover:text-gold transition-colors">
                          {ind.name}
                        </h2>
                        <span className="text-[11px] font-mono text-muted-foreground">/{ind.slug}</span>
                      </div>
                    </div>
                    {!ind.image && <StatusPill value={ind.status} />}
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                    {ind.description}
                  </p>

                  {ind.servicesOffered?.length ? (
                    <div className="mt-4 pt-3 border-t border-border/60">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Coverage Packages ({ind.servicesOffered.length})
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {ind.servicesOffered.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-navy/30 font-medium text-navy border border-border/50"
                          >
                            {s}
                          </span>
                        ))}
                        {ind.servicesOffered.length > 3 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-gold/10 text-gold font-bold">
                            +{ind.servicesOffered.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Action Buttons: View, Edit, Delete */}
              <div className="p-4 pt-3 bg-mist/40 border-t border-border flex items-center justify-between gap-2">
                <button
                  type="button"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-white border border-border shadow-xs hover:bg-navy hover:text-white text-navy transition-all"
                  onClick={() => setViewing(ind)}
                >
                  <Icon name="eye" className="w-3.5 h-3.5 text-gold" /> View
                </button>

                <button
                  type="button"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-gold/10 hover:bg-gold hover:text-white text-gold border border-gold/30 transition-all"
                  onClick={() => openEdit(ind)}
                >
                  <Icon name="sliders" className="w-3.5 h-3.5" /> Edit
                </button>

                <button
                  type="button"
                  className="p-1.5 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive hover:text-white transition-all shadow-xs"
                  onClick={() => handleDelete(ind._id, ind.name)}
                  title="Delete Industry"
                >
                  <Icon name="x" className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* View Detail Modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl my-8 rounded-2xl bg-card p-6 shadow-lift border border-border max-h-[90vh] overflow-y-auto animate-in fade-in">
            <div className="flex items-start justify-between pb-3 border-b border-border mb-4">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold border border-gold/30">
                  <Icon name={viewing.icon || "building"} className="h-6 w-6" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-lg font-bold text-navy">{viewing.name}</h2>
                    <StatusPill value={viewing.status} />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">URL Slug: /{viewing.slug}</span>
                </div>
              </div>
              <button onClick={() => setViewing(null)} className="p-1 text-muted-foreground hover:text-navy">
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            {viewing.image && (
              <div className="mb-4 rounded-xl overflow-hidden border border-border max-h-56 bg-navy/5">
                <img
                  src={typeof viewing.image === "object" ? (viewing.image as any)?.secure_url : (viewing.image || `/images/industries/${viewing.slug}.jpg`)}
                  alt={viewing.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/facility.jpg";
                  }}
                />
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div>
                <p className="font-bold text-navy mb-1">Description</p>
                <p className="text-muted-foreground leading-relaxed bg-mist/50 p-3 rounded-xl border border-border/50">
                  {viewing.description}
                </p>
              </div>

              {viewing.servicesOffered?.length ? (
                <div>
                  <p className="font-bold text-navy mb-1.5">Suitable Service Packages</p>
                  <div className="flex flex-wrap gap-1.5">
                    {viewing.servicesOffered.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-lg bg-navy/5 text-navy font-semibold border border-border"
                      >
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {viewing.keyHighlights?.length ? (
                <div>
                  <p className="font-bold text-navy mb-1.5">Key Highlights & Protocols</p>
                  <ul className="space-y-1 bg-mist/40 p-3 rounded-xl border border-border/50">
                    {viewing.keyHighlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-gold font-bold">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
                <a
                  href="/industries"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-base btn-secondary text-xs py-2 px-3.5 inline-flex items-center gap-1.5"
                >
                  <Icon name="file" className="w-3.5 h-3.5 text-gold" /> View on Live Website ↗
                </a>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const ind = viewing;
                      setViewing(null);
                      openEdit(ind);
                    }}
                    className="btn-base btn-accent text-xs py-2 px-4 inline-flex items-center gap-1.5"
                  >
                    <Icon name="sliders" className="w-3.5 h-3.5" /> Edit Industry
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
                {isCreating ? "Add Target Industry" : `Edit Industry: ${editing?.name}`}
              </h2>
              <button onClick={closeModal} className="p-1 text-muted-foreground hover:text-navy">
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy mb-1">Industry Name *</label>
                  <input
                    type="text"
                    required
                    className="field text-xs"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g., IT Parks & Corporate Offices"
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Icon Key</label>
                  <select
                    className="field text-xs"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  >
                    <option value="building">building (Offices / IT)</option>
                    <option value="home">home (Societies / Residential)</option>
                    <option value="factory">factory (Manufacturing / Plants)</option>
                    <option value="store">store (Retail / Malls)</option>
                    <option value="school">school (Education)</option>
                    <option value="box">box (Logistics / Warehouses)</option>
                    <option value="shield">shield (High Security)</option>
                  </select>
                </div>
              </div>

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
                <label className="block font-bold text-navy mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  className="field text-xs"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tailored facility coverage details for this sector..."
                />
              </div>

              <ImageUpload
                label="Industry Banner Image (Cloudinary)"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                folder="diamond_facility/industries"
              />

              <div>
                <label className="block font-bold text-navy mb-1.5">
                  Select Associated Service Offerings
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-border rounded-xl bg-mist/40">
                  {categories.map((cat) => {
                    const checked = formData.servicesOffered.includes(cat.name);
                    return (
                      <label
                        key={cat._id || cat.name}
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer border text-xs transition-colors ${
                          checked
                            ? "bg-gold/15 border-gold/40 text-navy font-bold"
                            : "bg-white border-border text-muted-foreground hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleServiceOffer(cat.name)}
                          className="rounded text-gold focus:ring-gold"
                        />
                        <span className="truncate">{cat.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-navy mb-1">
                  Key Highlights / Compliance Requirements (One per line)
                </label>
                <textarea
                  rows={3}
                  className="field text-xs font-mono"
                  value={highlightsInput}
                  onChange={(e) => setHighlightsInput(e.target.value)}
                  placeholder={"Visitor NDA & Badging\n24/7 Server Room Fire & Security Guarding\nESIC & PF Compliant Staff"}
                />
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
                    "Save Industry"
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

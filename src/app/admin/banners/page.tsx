"use client";

import { useEffect, useState } from "react";
import AdminLayout, { EmptyState, StatusPill, Toast, useToast } from "@/components/admin/AdminLayout";
import ImageUpload from "@/components/admin/ImageUpload";
import Icon from "@/components/ui/Icon";

interface Banner {
  _id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  placement: "home_hero" | "services_hero" | "contact_cta" | "promo_popup";
  active: boolean;
  sortOrder: number;
}

const emptyBanner: Omit<Banner, "_id"> = {
  title: "",
  subtitle: "",
  ctaText: "Get an Instant Quote",
  ctaLink: "/pricing-estimator",
  imageUrl: "/images/hero.jpg",
  placement: "home_hero",
  active: true,
  sortOrder: 1,
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [viewing, setViewing] = useState<Banner | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState(emptyBanner);
  const [saving, setSaving] = useState(false);
  const [toastMessage, showToast] = useToast();

  const loadBanners = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/banners");
      const data = await res.json();
      if (Array.isArray(data)) setBanners(data);
    } catch (err) {
      console.error("Failed to load banners:", err);
      showToast("Error loading banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const openCreate = () => {
    setFormData({
      ...emptyBanner,
      sortOrder: banners.length + 1,
    });
    setIsCreating(true);
    setEditing(null);
    setViewing(null);
  };

  const openEdit = (b: Banner) => {
    setEditing(b);
    setFormData({
      title: b.title,
      subtitle: b.subtitle || "",
      ctaText: b.ctaText || "Get an Instant Quote",
      ctaLink: b.ctaLink || "/pricing-estimator",
      imageUrl: b.imageUrl || "",
      placement: b.placement || "home_hero",
      active: !!b.active,
      sortOrder: b.sortOrder || 1,
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
    if (!formData.title.trim()) {
      showToast("Banner title is required.");
      return;
    }

    setSaving(true);
    try {
      if (isCreating) {
        const res = await fetch("/api/banners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create banner");
        showToast("Banner created successfully!");
      } else if (editing) {
        const res = await fetch(`/api/banners/${editing._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update banner");
        showToast("Banner updated!");
      }

      closeModal();
      loadBanners();
    } catch (err: any) {
      showToast(err?.message || "Operation failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete banner "${title}"?`)) return;
    try {
      const res = await fetch(`/api/banners/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      showToast("Banner deleted.");
      if (viewing && viewing._id === id) setViewing(null);
      loadBanners();
    } catch (err: any) {
      showToast(err?.message || "Failed to delete.");
    }
  };

  const getPlacementLabel = (p: string) => {
    switch (p) {
      case "home_hero": return "Homepage Hero";
      case "services_hero": return "Services Header";
      case "contact_cta": return "Contact CTA";
      case "promo_popup": return "Promo Callout";
      default: return p;
    }
  };

  return (
    <AdminLayout
      title="Banners & Hero Management"
      description="Control promotional banners, hero headlines, CTA buttons and campaign visuals across the website"
      actions={
        <button
          onClick={openCreate}
          className="btn-base btn-accent text-xs flex items-center gap-1.5 py-2 px-3.5 shadow-sm"
        >
          <Icon name="plus" className="w-3.5 h-3.5" /> Add New Banner
        </button>
      }
    >
      <Toast message={toastMessage} />

      {loading ? (
        <div className="py-20 text-center">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent inline-block" />
          <p className="mt-2 text-xs font-semibold text-muted-foreground">Loading banners from database…</p>
        </div>
      ) : banners.length === 0 ? (
        <EmptyState message="No banners found. Click 'Add New Banner' to create one." />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {banners.map((b) => (
            <article 
              key={b._id} 
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs hover:shadow-card transition-all duration-200 flex flex-col justify-between group hover:border-gold/30"
            >
              <div>
                <div className="relative h-44 w-full bg-navy overflow-hidden">
                  {b.imageUrl ? (
                    <img 
                      src={b.imageUrl} 
                      alt={b.title} 
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      loading="lazy" 
                    />
                  ) : (
                    <div className="h-full w-full bg-linear-to-br from-navy to-navy-800 flex items-center justify-center text-white/40">
                      <Icon name="layers" className="w-10 h-10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-navy/80 backdrop-blur-xs text-gold border border-gold/40 px-2.5 py-1 rounded-full shadow-xs">
                      {getPlacementLabel(b.placement)}
                    </span>
                  </div>
                  
                  <div className="absolute top-3 right-3">
                    <StatusPill value={b.active ? "Active" : "Inactive"} />
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h2 className="text-sm font-bold text-white leading-snug drop-shadow-xs line-clamp-1">
                      {b.title}
                    </h2>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-xs text-muted-foreground line-clamp-2 min-h-[32px]">
                    {b.subtitle || "No subtitle configured"}
                  </p>

                  {b.ctaText && (
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] bg-surface-subtle p-2 rounded-lg border border-border/60">
                      <span className="text-muted-foreground font-semibold">CTA Button:</span>
                      <span className="font-bold text-navy truncate">
                        {b.ctaText} → <span className="text-gold underline">{b.ctaLink}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons: View, Edit, Delete */}
              <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-border/60 mt-2">
                <div className="flex items-center gap-1.5 w-full">
                  <button
                    className="flex-1 bg-white border border-border shadow-2xs hover:bg-navy hover:text-white text-navy text-xs font-semibold py-1.5 px-2 rounded-lg inline-flex items-center justify-center gap-1 transition-all"
                    onClick={() => setViewing(b)}
                    title="View Banner Details"
                  >
                    <Icon name="eye" className="w-3.5 h-3.5" /> View
                  </button>
                  <button
                    className="flex-1 bg-gold/10 hover:bg-gold hover:text-white text-gold border border-gold/30 text-xs font-semibold py-1.5 px-2 rounded-lg inline-flex items-center justify-center gap-1 transition-all"
                    onClick={() => openEdit(b)}
                    title="Edit Banner"
                  >
                    <Icon name="sliders" className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    className="border border-destructive/30 text-destructive hover:bg-destructive hover:text-white text-xs font-semibold p-1.5 rounded-lg inline-flex items-center justify-center transition-all shadow-2xs"
                    onClick={() => handleDelete(b._id, b.title)}
                    title="Delete Banner"
                  >
                    <Icon name="x" className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* View Banner Detail Modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl my-8 rounded-2xl bg-card p-6 shadow-lift border border-border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-gold/10 text-gold">
                  <Icon name="layers" className="w-4 h-4" />
                </span>
                <h2 className="font-display text-base font-bold text-navy">Banner Details</h2>
              </div>
              <button onClick={() => setViewing(null)} className="p-1 text-muted-foreground hover:text-navy rounded-lg hover:bg-surface-subtle">
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {viewing.imageUrl && (
                <div className="relative rounded-xl overflow-hidden border border-border h-48 bg-navy">
                  <img src={viewing.imageUrl} alt={viewing.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-navy/90 text-gold border border-gold/40 px-2.5 py-0.5 rounded-full">
                      {getPlacementLabel(viewing.placement)}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <StatusPill value={viewing.active ? "Active" : "Inactive"} />
                  </div>
                </div>
              )}

              <div>
                <span className="text-[11px] font-bold text-gold uppercase tracking-wider">Headline</span>
                <h3 className="text-lg font-bold text-navy mt-0.5">{viewing.title}</h3>
                {viewing.subtitle && (
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed bg-surface-subtle p-3 rounded-lg border border-border">
                    {viewing.subtitle}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-surface-subtle rounded-xl border border-border">
                <div>
                  <span className="text-muted-foreground font-semibold block text-[11px]">Placement Area:</span>
                  <span className="font-bold text-navy text-xs">{getPlacementLabel(viewing.placement)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground font-semibold block text-[11px]">Sort Display Priority:</span>
                  <span className="font-bold text-navy text-xs">#{viewing.sortOrder || 1}</span>
                </div>
                {viewing.ctaText && (
                  <div className="col-span-2 pt-2 border-t border-border">
                    <span className="text-muted-foreground font-semibold block text-[11px]">Call To Action:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-gold text-white font-bold px-2.5 py-1 rounded text-xs">
                        {viewing.ctaText}
                      </span>
                      <span className="text-muted-foreground">links to</span>
                      <a 
                        href={viewing.ctaLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-gold font-bold underline hover:text-navy"
                      >
                        {viewing.ctaLink} ↗
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                <button
                  onClick={() => {
                    const item = viewing;
                    setViewing(null);
                    openEdit(item);
                  }}
                  className="btn-base btn-secondary py-1.5 px-3 text-xs flex items-center gap-1"
                >
                  <Icon name="sliders" className="w-3.5 h-3.5" /> Edit Banner
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
      )}

      {/* Create / Edit Modal */}
      {(isCreating || editing) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl my-8 rounded-2xl bg-card p-6 shadow-lift border border-border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <h2 className="font-display text-lg font-bold text-navy">
                {isCreating ? "Add Hero Banner" : `Edit Banner: ${editing?.title}`}
              </h2>
              <button onClick={closeModal} className="p-1 text-muted-foreground hover:text-navy">
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-navy mb-1">Banner Title *</label>
                <input
                  type="text"
                  required
                  className="field text-xs"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Integrated Facility Services You Can Trust"
                />
              </div>

              <div>
                <label className="block font-bold text-navy mb-1">Subtitle / Supporting Text</label>
                <textarea
                  rows={2}
                  className="field text-xs"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Comprehensive Security, Housekeeping, Manpower..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    className="field text-xs"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    placeholder="Get an Instant Quote"
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">CTA Destination URL</label>
                  <input
                    type="text"
                    className="field text-xs"
                    value={formData.ctaLink}
                    onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                    placeholder="/pricing-estimator"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy mb-1">Placement Location</label>
                  <select
                    className="field text-xs"
                    value={formData.placement}
                    onChange={(e: any) => setFormData({ ...formData, placement: e.target.value })}
                  >
                    <option value="home_hero">Homepage Hero Banner</option>
                    <option value="services_hero">Services Page Header</option>
                    <option value="contact_cta">Bottom Contact CTA</option>
                    <option value="promo_popup">Promotional Callout</option>
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

              <ImageUpload
                label="Banner Background / Visual (Cloudinary)"
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                folder="diamond_facility/banners"
              />

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-navy">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded text-gold focus:ring-gold"
                  />
                  Activate and display this banner on website
                </label>
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
                    "Save Banner"
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

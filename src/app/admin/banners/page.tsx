"use client";

import { useEffect, useState } from "react";
import AdminLayout, { EmptyState, StatusPill, Toast, useToast } from "@/components/admin/AdminLayout";
import ImageUpload from "@/components/admin/ImageUpload";
import Icon from "@/components/ui/Icon";

interface Banner {
  _id: string;
  title: string;
  highlightedTitle?: string;
  badge?: string;
  subtitle?: string;
  description?: string;
  image?: any;
  imageUrl?: string;
  placement: string;
  serviceCategory?: string;
  ctaText?: string;
  ctaLink?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  status: "Active" | "Inactive";
  sortOrder: number;
}

const emptyBanner: Omit<Banner, "_id"> = {
  title: "",
  highlightedTitle: "",
  badge: "",
  subtitle: "",
  description: "",
  image: "/images/hero/slide-security.webp",
  placement: "home_hero",
  serviceCategory: "Security Guard Services",
  ctaText: "Get Free Instant Quote",
  ctaLink: "/pricing-estimator",
  primaryCtaText: "Get Free Instant Quote",
  primaryCtaLink: "/pricing-estimator",
  secondaryCtaText: "Explore Services",
  secondaryCtaLink: "/services",
  status: "Active",
  sortOrder: 1,
};

function getBannerImage(b: any): string {
  if (!b) return "/images/hero.jpg";
  if (typeof b.image === "string" && b.image.trim()) return b.image;
  if (b.image && typeof b.image === "object" && b.image.secure_url) return b.image.secure_url;
  if (typeof b.imageUrl === "string" && b.imageUrl.trim()) return b.imageUrl;
  return "/images/hero.jpg";
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlacement, setSelectedPlacement] = useState<string>("All");
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
      title: b.title || "",
      highlightedTitle: b.highlightedTitle || "",
      badge: b.badge || "",
      subtitle: b.subtitle || "",
      description: b.description || "",
      image: getBannerImage(b),
      placement: b.placement || "home_hero",
      serviceCategory: b.serviceCategory || "",
      ctaText: b.ctaText || b.primaryCtaText || "Get Free Quote",
      ctaLink: b.ctaLink || b.primaryCtaLink || "/pricing-estimator",
      primaryCtaText: b.primaryCtaText || b.ctaText || "Get Free Instant Quote",
      primaryCtaLink: b.primaryCtaLink || b.ctaLink || "/pricing-estimator",
      secondaryCtaText: b.secondaryCtaText || "Explore Services",
      secondaryCtaLink: b.secondaryCtaLink || "/services",
      status: b.status || "Active",
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
      const payload = {
        ...formData,
        imageUrl: formData.image,
      };

      if (isCreating) {
        const res = await fetch("/api/banners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create banner");
        showToast("Banner created successfully!");
      } else if (editing) {
        const res = await fetch(`/api/banners/${editing._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update banner");
        showToast("Banner updated successfully!");
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
      case "home_hero":
        return "Homepage Hero Slide";
      case "page_about":
        return "About Page Header";
      case "page_services":
        return "Services Page Header";
      case "page_industries":
        return "Industries Page Header";
      case "page_portfolio":
        return "Portfolio Page Header";
      case "page_gallery":
        return "Gallery Page Header";
      default:
        return p;
    }
  };

  const filteredBanners =
    selectedPlacement === "All"
      ? banners
      : selectedPlacement === "Hero Slides"
      ? banners.filter((b) => b.placement === "home_hero")
      : selectedPlacement === "Page Headers"
      ? banners.filter((b) => b.placement !== "home_hero")
      : banners.filter((b) => b.placement === selectedPlacement);

  return (
    <AdminLayout
      title="Banners & Hero Management"
      description="Control promotional banners, hero sliders, page headers, CTA buttons and visuals across the website"
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

      {/* Filter Tabs */}
      <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-border/80 pb-4">
        {["All", "Hero Slides", "Page Headers"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedPlacement(tab)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              selectedPlacement === tab
                ? "bg-gold text-white shadow-sm"
                : "bg-surface-subtle text-muted-foreground hover:bg-mist hover:text-navy"
            }`}
          >
            {tab}
            <span className="ml-1.5 rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">
              {tab === "All"
                ? banners.length
                : tab === "Hero Slides"
                ? banners.filter((b) => b.placement === "home_hero").length
                : banners.filter((b) => b.placement !== "home_hero").length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent inline-block" />
          <p className="mt-2 text-xs font-semibold text-muted-foreground">Loading banners from database…</p>
        </div>
      ) : filteredBanners.length === 0 ? (
        <EmptyState message="No banners found in this category. Click 'Add New Banner' to create one." />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredBanners.map((b) => {
            const imgUrl = getBannerImage(b);
            return (
              <article
                key={b._id}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs hover:shadow-card transition-all duration-200 flex flex-col justify-between group hover:border-gold/40"
              >
                <div>
                  <div className="relative h-48 w-full bg-navy overflow-hidden">
                    <img
                      src={imgUrl}
                      alt={b.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-navy/90 backdrop-blur-xs text-gold border border-gold/40 px-2.5 py-1 rounded-full shadow-xs">
                        {getPlacementLabel(b.placement)}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <StatusPill value={b.status || "Active"} />
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      {b.badge && (
                        <p className="text-[10px] font-semibold text-gold/90 line-clamp-1 mb-0.5">
                          {b.badge}
                        </p>
                      )}
                      <h2 className="text-sm font-bold text-white leading-snug drop-shadow-xs line-clamp-1">
                        {b.title} {b.highlightedTitle && <span className="text-gold">{b.highlightedTitle}</span>}
                      </h2>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-xs text-muted-foreground line-clamp-2 min-h-[32px]">
                      {b.description || b.subtitle || "No description configured"}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-[11px] bg-surface-subtle p-2 rounded-lg border border-border/60">
                      <span className="text-muted-foreground font-semibold">Priority Order:</span>
                      <span className="font-bold text-navy">#{b.sortOrder || 1}</span>
                    </div>

                    {b.primaryCtaText && (
                      <div className="mt-2 flex items-center gap-1.5 text-[11px] bg-surface-subtle p-2 rounded-lg border border-border/60">
                        <span className="text-muted-foreground font-semibold">CTA:</span>
                        <span className="font-bold text-navy truncate">
                          {b.primaryCtaText} → <span className="text-gold underline">{b.primaryCtaLink}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
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
            );
          })}
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
              <div className="relative rounded-xl overflow-hidden border border-border h-48 bg-navy">
                <img src={getBannerImage(viewing)} alt={viewing.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-navy/90 text-gold border border-gold/40 px-2.5 py-0.5 rounded-full">
                    {getPlacementLabel(viewing.placement)}
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <StatusPill value={viewing.status || "Active"} />
                </div>
              </div>

              <div>
                {viewing.badge && (
                  <span className="text-[11px] font-bold text-gold uppercase tracking-wider block">
                    {viewing.badge}
                  </span>
                )}
                <h3 className="text-lg font-bold text-navy mt-0.5">
                  {viewing.title} {viewing.highlightedTitle && <span className="text-gold">{viewing.highlightedTitle}</span>}
                </h3>
                {(viewing.description || viewing.subtitle) && (
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed bg-surface-subtle p-3 rounded-lg border border-border">
                    {viewing.description || viewing.subtitle}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-surface-subtle rounded-xl border border-border">
                <div>
                  <span className="text-muted-foreground font-semibold block text-[11px]">Placement Area:</span>
                  <span className="font-bold text-navy text-xs">{getPlacementLabel(viewing.placement)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground font-semibold block text-[11px]">Display Priority:</span>
                  <span className="font-bold text-navy text-xs">#{viewing.sortOrder || 1}</span>
                </div>
                {viewing.primaryCtaText && (
                  <div className="col-span-2 pt-2 border-t border-border">
                    <span className="text-muted-foreground font-semibold block text-[11px]">Primary CTA Button:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-gold text-white font-bold px-2.5 py-1 rounded text-xs">
                        {viewing.primaryCtaText}
                      </span>
                      <span className="text-muted-foreground">links to</span>
                      <a href={viewing.primaryCtaLink} target="_blank" rel="noreferrer" className="text-gold font-bold underline hover:text-navy">
                        {viewing.primaryCtaLink} ↗
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
                <button onClick={() => setViewing(null)} className="btn-base btn-primary py-1.5 px-4 text-xs">
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
                {isCreating ? "Add New Banner" : `Edit Banner: ${editing?.title}`}
              </h2>
              <button onClick={closeModal} className="p-1 text-muted-foreground hover:text-navy">
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy mb-1">Placement Location *</label>
                  <select
                    className="field text-xs"
                    value={formData.placement}
                    onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
                  >
                    <option value="home_hero">Homepage Hero Slide</option>
                    <option value="page_about">About Page Header</option>
                    <option value="page_services">Services Page Header</option>
                    <option value="page_industries">Industries Page Header</option>
                    <option value="page_portfolio">Portfolio Page Header</option>
                    <option value="page_gallery">Gallery Page Header</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Display Sort Priority</label>
                  <input
                    type="number"
                    className="field text-xs"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-navy mb-1">Badge / Eyebrow Text (Small Top Text)</label>
                <input
                  type="text"
                  className="field text-xs"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="e.g., 24/7 Manned Security • Police-Verified"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy mb-1">Main Heading *</label>
                  <input
                    type="text"
                    required
                    className="field text-xs"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Complete Facility Services."
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Highlighted (Gold) Heading</label>
                  <input
                    type="text"
                    className="field text-xs"
                    value={formData.highlightedTitle}
                    onChange={(e) => setFormData({ ...formData, highlightedTitle: e.target.value })}
                    placeholder="e.g., One Trusted Partner."
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-navy mb-1">Description / Subtitle</label>
                <textarea
                  rows={3}
                  className="field text-xs"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                      subtitle: e.target.value,
                    })
                  }
                  placeholder="Official provider of Security Guarding, Housekeeping..."
                />
              </div>

              {/* Image Upload Component */}
              <ImageUpload
                label="Banner Image (Upload or select)"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                folder="diamond_facility/banners"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy mb-1">Primary CTA Text</label>
                  <input
                    type="text"
                    className="field text-xs"
                    value={formData.primaryCtaText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        primaryCtaText: e.target.value,
                        ctaText: e.target.value,
                      })
                    }
                    placeholder="Get Free Instant Quote"
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Primary CTA Link</label>
                  <input
                    type="text"
                    className="field text-xs"
                    value={formData.primaryCtaLink}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        primaryCtaLink: e.target.value,
                        ctaLink: e.target.value,
                      })
                    }
                    placeholder="/pricing-estimator"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy mb-1">Secondary CTA Text</label>
                  <input
                    type="text"
                    className="field text-xs"
                    value={formData.secondaryCtaText}
                    onChange={(e) => setFormData({ ...formData, secondaryCtaText: e.target.value })}
                    placeholder="Explore Services"
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Secondary CTA Link</label>
                  <input
                    type="text"
                    className="field text-xs"
                    value={formData.secondaryCtaLink}
                    onChange={(e) => setFormData({ ...formData, secondaryCtaLink: e.target.value })}
                    placeholder="/services"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-bold text-navy mb-1">Status</label>
                  <select
                    className="field text-xs"
                    value={formData.status}
                    onChange={(e: any) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Active">Active (Visible)</option>
                    <option value="Inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                <button type="button" onClick={closeModal} className="btn-base btn-secondary py-2 px-4 text-xs">
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

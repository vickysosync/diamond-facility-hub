"use client";

import { useEffect, useState } from "react";
import AdminLayout, { Toast, useToast } from "@/components/admin/AdminLayout";
import Icon from "@/components/ui/Icon";

export default function AdminContentCMSPage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, showToast] = useToast();

  const loadContent = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/content");
      const data = await res.json();
      if (data && !data.error) setContent(data);
    } catch (err) {
      console.error("Failed to load CMS content:", err);
      showToast("Error loading CMS content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update content");
      showToast("Website CMS content updated successfully!");
    } catch (err: any) {
      showToast(err?.message || "Failed to save CMS content");
    } finally {
      setSaving(false);
    }
  };

  const updateHero = (key: string, value: any) => {
    setContent((prev: any) => ({
      ...prev,
      hero: { ...(prev?.hero || {}), [key]: value },
    }));
  };

  const updateAbout = (key: string, value: any) => {
    setContent((prev: any) => ({
      ...prev,
      about: { ...(prev?.about || {}), [key]: value },
    }));
  };

  const updateStats = (index: number, field: string, value: any) => {
    setContent((prev: any) => {
      const stats = [...(prev?.stats || [])];
      stats[index] = { ...stats[index], [field]: value };
      return { ...prev, stats };
    });
  };

  return (
    <AdminLayout
      title="CMS Website Content Editor"
      description="Manage the public website copy, hero messaging, About Us section, and verified statistics"
    >
      <Toast message={toastMessage} />

      {loading && !content ? (
        <div className="py-20 text-center">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent inline-block" />
          <p className="mt-2 text-xs font-semibold text-muted-foreground">Loading CMS content from MongoDB…</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6 max-w-4xl text-xs">
          {/* Hero Section Copy */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-base font-bold text-navy pb-3 border-b border-border flex items-center gap-2">
              <Icon name="layers" className="w-4 h-4 text-gold" /> Homepage Hero Copy
            </h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="block font-bold text-navy mb-1">Hero Eyebrow Tagline</label>
                <input
                  type="text"
                  className="field text-xs"
                  value={content?.hero?.tagline || ""}
                  onChange={(e) => updateHero("tagline", e.target.value)}
                />
              </div>
              <div>
                <label className="block font-bold text-navy mb-1">Main Heading</label>
                <input
                  type="text"
                  className="field text-xs"
                  value={content?.hero?.heading || ""}
                  onChange={(e) => updateHero("heading", e.target.value)}
                />
              </div>
              <div>
                <label className="block font-bold text-navy mb-1">Hero Subheading</label>
                <textarea
                  rows={2}
                  className="field text-xs"
                  value={content?.hero?.subheading || ""}
                  onChange={(e) => updateHero("subheading", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy mb-1">Primary CTA Button</label>
                  <input
                    type="text"
                    className="field text-xs"
                    value={content?.hero?.primaryCta || ""}
                    onChange={(e) => updateHero("primaryCta", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Secondary CTA Button</label>
                  <input
                    type="text"
                    className="field text-xs"
                    value={content?.hero?.secondaryCta || ""}
                    onChange={(e) => updateHero("secondaryCta", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* About Section Copy */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-base font-bold text-navy pb-3 border-b border-border flex items-center gap-2">
              <Icon name="building" className="w-4 h-4 text-gold" /> About Us & Company Mission
            </h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="block font-bold text-navy mb-1">About Section Title</label>
                <input
                  type="text"
                  className="field text-xs"
                  value={content?.about?.title || ""}
                  onChange={(e) => updateAbout("title", e.target.value)}
                />
              </div>
              <div>
                <label className="block font-bold text-navy mb-1">About Story / Overview</label>
                <textarea
                  rows={4}
                  className="field text-xs"
                  value={content?.about?.description || ""}
                  onChange={(e) => updateAbout("description", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy mb-1">Our Mission</label>
                  <textarea
                    rows={3}
                    className="field text-xs"
                    value={content?.about?.mission || ""}
                    onChange={(e) => updateAbout("mission", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Our Vision</label>
                  <textarea
                    rows={3}
                    className="field text-xs"
                    value={content?.about?.vision || ""}
                    onChange={(e) => updateAbout("vision", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Key Statistics Counters */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-base font-bold text-navy pb-3 border-b border-border flex items-center gap-2">
              <Icon name="chart" className="w-4 h-4 text-gold" /> Live Metrics & Verified Counters
            </h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(content?.stats || []).map((st: any, idx: number) => (
                <div key={idx} className="p-3 bg-mist/60 border border-border rounded-xl space-y-2">
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase">Metric Value</label>
                    <input
                      type="text"
                      className="field text-xs font-mono font-bold text-gold"
                      value={st.value}
                      onChange={(e) => updateStats(idx, "value", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase">Metric Label</label>
                    <input
                      type="text"
                      className="field text-xs"
                      value={st.label}
                      onChange={(e) => updateStats(idx, "label", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Save Button Bar */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="btn-base btn-accent py-2.5 px-6 text-sm flex items-center gap-2"
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Updating CMS…
                </>
              ) : (
                <>
                  <Icon name="check" className="w-4 h-4" /> Save All CMS Content
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </AdminLayout>
  );
}

"use client";

import { useEffect, useState } from "react";
import AdminLayout, { EmptyState, StatusPill, Toast, useToast } from "@/components/admin/AdminLayout";
import ImageUpload from "@/components/admin/ImageUpload";
import Icon from "@/components/ui/Icon";

interface Project {
  _id: string;
  title: string;
  slug: string;
  category: string;
  serviceCategorySlug?: string;
  client: string;
  location: string;
  serviceType: string;
  description: string;
  scopeOfWork: string[];
  results: string[];
  year: string;
  status: "Completed" | "Ongoing";
  image: string;
  featured: boolean;
  sortOrder: number;
}

const emptyProject: Omit<Project, "_id"> = {
  title: "",
  slug: "",
  category: "Security Guard Services",
  serviceCategorySlug: "security-guard-services",
  client: "",
  location: "Pune, Maharashtra",
  serviceType: "Corporate Security & Access Control",
  description: "",
  scopeOfWork: [],
  results: [],
  year: "2026",
  status: "Completed",
  image: "/images/hero.jpg",
  featured: false,
  sortOrder: 1,
};

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [viewing, setViewing] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState(emptyProject);
  const [scopeInput, setScopeInput] = useState("");
  const [resultsInput, setResultsInput] = useState("");
  const [filter, setFilter] = useState("All");
  const [saving, setSaving] = useState(false);
  const [toastMessage, showToast] = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [projRes, catRes] = await Promise.all([
        fetch("/api/portfolio"),
        fetch("/api/service-categories"),
      ]);
      const projData = await projRes.json();
      const catData = await catRes.json();

      if (Array.isArray(projData)) setProjects(projData);
      if (Array.isArray(catData)) setCategories(catData);
    } catch (err) {
      console.error("Failed to load portfolio:", err);
      showToast("Error loading portfolio projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreate = () => {
    const defaultCat = categories[0]?.name || "Security Guard Services";
    const defaultCatSlug = categories[0]?.slug || "security-guard-services";
    setFormData({
      ...emptyProject,
      category: defaultCat,
      serviceCategorySlug: defaultCatSlug,
      sortOrder: projects.length + 1,
    });
    setScopeInput("");
    setResultsInput("");
    setIsCreating(true);
    setEditing(null);
    setViewing(null);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setViewing(null);
    setFormData({
      title: p.title,
      slug: p.slug,
      category: p.category || categories[0]?.name || "Security Guard Services",
      serviceCategorySlug: p.serviceCategorySlug || "",
      client: p.client || "",
      location: p.location || "Pune",
      serviceType: p.serviceType || "",
      description: p.description || "",
      scopeOfWork: p.scopeOfWork || [],
      results: p.results || [],
      year: p.year || "2026",
      status: p.status || "Completed",
      image: p.image || "",
      featured: p.featured || false,
      sortOrder: p.sortOrder || 1,
    });
    setScopeInput((p.scopeOfWork || []).join("\n"));
    setResultsInput((p.results || []).join("\n"));
    setIsCreating(false);
  };

  const closeModal = () => {
    setEditing(null);
    setIsCreating(false);
    setViewing(null);
  };

  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData((prev) => ({
      ...prev,
      title,
      slug: isCreating ? slug : prev.slug,
    }));
  };

  const handleCategorySelect = (catName: string) => {
    const found = categories.find((c) => c.name === catName);
    setFormData((prev) => ({
      ...prev,
      category: catName,
      serviceCategorySlug: found ? found.slug : "",
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.slug.trim()) {
      showToast("Project title and slug are required.");
      return;
    }

    setSaving(true);
    try {
      const scopeOfWork = scopeInput
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const results = resultsInput
        .split("\n")
        .map((r) => r.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        scopeOfWork,
        results,
      };

      if (isCreating) {
        const res = await fetch("/api/portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create project");
        showToast("Portfolio project created!");
      } else if (editing) {
        const res = await fetch(`/api/portfolio/${editing._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update project");
        showToast("Portfolio project updated!");
      }

      closeModal();
      loadData();
    } catch (err: any) {
      showToast(err?.message || "Operation failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete project "${title}"?`)) return;
    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      showToast("Project deleted.");
      loadData();
    } catch (err: any) {
      showToast(err?.message || "Failed to delete.");
    }
  };

  const filteredProjects = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <AdminLayout
      title="Portfolio Projects Management"
      description="Live showcase of client deployments, case studies and facility contracts"
      actions={
        <button
          onClick={openCreate}
          className="btn-base btn-accent text-xs flex items-center gap-1.5 py-2 px-3.5"
        >
          <Icon name="plus" className="w-3.5 h-3.5" /> Add Project
        </button>
      }
    >
      <Toast message={toastMessage} />

      {/* Category Filter Pills */}
      <div className="mb-5 flex flex-wrap gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilter("All")}
          className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
            filter === "All"
              ? "border-gold bg-gold text-white shadow-xs"
              : "border-border bg-card text-navy hover:border-gold/60"
          }`}
        >
          All ({projects.length})
        </button>
        {categories.map((c) => {
          const count = projects.filter((p) => p.category === c.name).length;
          return (
            <button
              key={c._id || c.name}
              onClick={() => setFilter(c.name)}
              className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
                filter === c.name
                  ? "border-gold bg-gold text-white shadow-xs"
                  : "border-border bg-card text-navy hover:border-gold/60"
              }`}
            >
              {c.name} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent inline-block" />
          <p className="mt-2 text-xs font-semibold text-muted-foreground">Loading portfolio from MongoDB…</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState message="No portfolio projects found in this category." />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((p) => (
            <article
              key={p._id}
              className="group overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-40 w-full overflow-hidden bg-slate-100 border-b border-border">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full bg-navy/5 flex items-center justify-center text-gold">
                      <Icon name="file" className="w-8 h-8" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <StatusPill value={p.status} />
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-navy/85 backdrop-blur-xs text-gold px-2.5 py-1 rounded-md border border-gold/30">
                      {p.category}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h2 className="text-base font-bold text-navy group-hover:text-gold transition-colors">
                    {p.title}
                  </h2>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>📍 {p.location}</span>
                    <span>•</span>
                    <span>🗓 {p.year}</span>
                    {p.client && (
                      <>
                        <span>•</span>
                        <span className="font-semibold text-navy truncate max-w-[120px]">{p.client}</span>
                      </>
                    )}
                  </div>

                  <p className="mt-2.5 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons: View, Edit, Delete */}
              <div className="p-4 pt-3 bg-mist/40 border-t border-border flex items-center justify-between gap-2">
                <button
                  type="button"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-white border border-border shadow-xs hover:bg-navy hover:text-white text-navy transition-all"
                  onClick={() => setViewing(p)}
                >
                  <Icon name="eye" className="w-3.5 h-3.5 text-gold" /> View
                </button>

                <button
                  type="button"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-gold/10 hover:bg-gold hover:text-white text-gold border border-gold/30 transition-all"
                  onClick={() => openEdit(p)}
                >
                  <Icon name="sliders" className="w-3.5 h-3.5" /> Edit
                </button>

                <button
                  type="button"
                  className="p-1.5 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive hover:text-white transition-all shadow-xs"
                  onClick={() => handleDelete(p._id, p.title)}
                  title="Delete Project"
                >
                  <Icon name="x" className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* View Project Detail Modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl my-8 rounded-2xl bg-card p-6 shadow-lift border border-border max-h-[90vh] overflow-y-auto animate-in fade-in">
            <div className="flex items-start justify-between pb-3 border-b border-border mb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gold block mb-1">
                  {viewing.category}
                </span>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-lg font-bold text-navy">{viewing.title}</h2>
                  <StatusPill value={viewing.status} />
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>📍 {viewing.location}</span>
                  <span>•</span>
                  <span>🗓 {viewing.year}</span>
                  {viewing.client && (
                    <>
                      <span>•</span>
                      <span className="font-semibold text-navy">Client: {viewing.client}</span>
                    </>
                  )}
                </div>
              </div>
              <button onClick={() => setViewing(null)} className="p-1 text-muted-foreground hover:text-navy">
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            {viewing.image && (
              <div className="mb-4 rounded-xl overflow-hidden border border-border max-h-60 bg-navy/5">
                <img src={viewing.image} alt={viewing.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div>
                <p className="font-bold text-navy mb-1">Project Summary & Challenge</p>
                <p className="text-muted-foreground leading-relaxed bg-mist/30 p-3 rounded-xl border border-border/50">
                  {viewing.description}
                </p>
              </div>

              {viewing.scopeOfWork?.length ? (
                <div>
                  <p className="font-bold text-navy mb-1.5">Scope of Work & Deployments</p>
                  <ul className="space-y-1 bg-mist/40 p-3 rounded-xl border border-border/50">
                    {viewing.scopeOfWork.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-navy">
                        <span className="text-gold font-bold">✓</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {viewing.results?.length ? (
                <div>
                  <p className="font-bold text-navy mb-1.5">Key Deliverables & Results</p>
                  <ul className="space-y-1 bg-navy/5 p-3 rounded-xl border border-border/50">
                    {viewing.results.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-gold font-bold">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
                <a
                  href="/portfolio"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-base btn-secondary text-xs py-2 px-3.5 inline-flex items-center gap-1.5"
                >
                  <Icon name="file" className="w-3.5 h-3.5 text-gold" /> View on Live Portfolio ↗
                </a>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const p = viewing;
                      setViewing(null);
                      openEdit(p);
                    }}
                    className="btn-base btn-accent text-xs py-2 px-4 inline-flex items-center gap-1.5"
                  >
                    <Icon name="sliders" className="w-3.5 h-3.5" /> Edit Project
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
                {isCreating ? "Add Portfolio Project" : `Edit Project: ${editing?.title}`}
              </h2>
              <button onClick={closeModal} className="p-1 text-muted-foreground hover:text-navy">
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-navy mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  className="field text-xs"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g., Corporate Campus Security & Access Management"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy mb-1">Service Category *</label>
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
                <div>
                  <label className="block font-bold text-navy mb-1">Client / Sector</label>
                  <input
                    type="text"
                    className="field text-xs"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    placeholder="e.g., Tech Mahindra Hinjewadi / IT Park"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-navy mb-1">Location</label>
                  <input
                    type="text"
                    className="field text-xs"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Hinjewadi, Pune"
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Year</label>
                  <input
                    type="text"
                    className="field text-xs"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2026"
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Status</label>
                  <select
                    className="field text-xs"
                    value={formData.status}
                    onChange={(e: any) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Completed">Completed</option>
                    <option value="Ongoing">Ongoing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-navy mb-1">Service Type Summary</label>
                <input
                  type="text"
                  className="field text-xs"
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  placeholder="24/7 Security & CCTV Monitoring"
                />
              </div>

              <div>
                <label className="block font-bold text-navy mb-1">Project Description</label>
                <textarea
                  rows={3}
                  className="field text-xs"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <ImageUpload
                label="Project Cover Image (Cloudinary)"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                folder="diamond_facility/portfolio"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy mb-1">
                    Scope of Work (One per line)
                  </label>
                  <textarea
                    rows={3}
                    className="field text-xs font-mono"
                    value={scopeInput}
                    onChange={(e) => setScopeInput(e.target.value)}
                    placeholder={"Access control gates\n12-guard shift rotation\nVisitor logging system"}
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">
                    Delivered Results (One per line)
                  </label>
                  <textarea
                    rows={3}
                    className="field text-xs font-mono"
                    value={resultsInput}
                    onChange={(e) => setResultsInput(e.target.value)}
                    placeholder={"Zero security breaches\n100% compliance SLA\nSatisfied client rating"}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-navy">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded text-gold focus:ring-gold"
                  />
                  Feature on Homepage Hero/Showcase
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
                    "Save Project"
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

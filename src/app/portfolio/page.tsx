"use client";

import { useEffect, useMemo, useState } from "react";
import SiteLayout, { PageHeader, useQuote } from "@/components/site/SiteLayout";
import Icon from "@/components/ui/Icon";
import Modal from "@/components/ui/Modal";
import { CTABanner, SectionTitle } from "@/components/site/Sections";

const statusTone: Record<string, string> = {
  Completed: "bg-emerald-500/15 text-emerald-700 border border-emerald-500/30",
  Ongoing: "bg-blue-500/15 text-blue-700 border border-blue-500/30",
  "In Progress": "bg-amber-500/15 text-amber-700 border border-amber-500/30",
};

export default function PortfolioPage() {
  const { openQuote } = useQuote();
  const [projects, setProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [active, setActive] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
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
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const list = useMemo(
    () => (category === "All" ? projects : projects.filter((p) => p.category === category)),
    [projects, category],
  );

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Proven Deployments"
        title="Facility Operations Delivered Across Pune & Maharashtra"
        subtitle="Explore our verified facility management contracts, security deployments, pest eradication projects, and civil upkeep case studies."
      />

      <section className="section-y bg-background">
        <div className="container-x">
          <SectionTitle
            eyebrow="Case Studies"
            title="Projects & Client Deployments"
            subtitle="Filter by service division to review executed scope of work and verified deliverables."
          />

          {/* Category Dropdown Filter */}
          <div className="mt-8 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/70 pb-5">
            <div>
              <h2 className="font-display text-xl font-bold text-navy">Deployments & Case Studies</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Showing {list.length} of {projects.length} verified operations
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <label htmlFor="portfolio-category-filter" className="text-xs sm:text-sm font-bold text-navy whitespace-nowrap">
                Filter by Category
              </label>
              <div className="relative flex-1 sm:w-64">
                <select
                  id="portfolio-category-filter"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-border bg-white px-4 py-2.5 pr-10 text-xs sm:text-sm font-semibold text-navy shadow-xs focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold cursor-pointer transition-all hover:border-gold/60"
                >
                  <option value="All">All Categories ({projects.length})</option>
                  {categories.map((c) => {
                    const count = projects.filter((p) => p.category === c.name).length;
                    return (
                      <option key={c._id || c.name} value={c.name}>
                        {c.name} ({count})
                      </option>
                    );
                  })}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-navy">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <span className="h-7 w-7 animate-spin rounded-full border-2 border-gold border-t-transparent inline-block" />
              <p className="mt-2 text-xs font-semibold text-navy">Loading portfolio showcase from MongoDB…</p>
            </div>
          ) : list.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-12 text-center">
              <Icon name="inbox" className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-3 text-sm font-semibold text-navy">No projects listed under this category yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Contact our facility team for specific case studies and client references.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p) => (
                <article
                  key={p._id || p.id}
                  className="card-lift group overflow-hidden rounded-2xl border border-border bg-card shadow-card flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                      <img
                        src={p.image || "/images/hero.jpg"}
                        alt={`${p.title} in ${p.location}`}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-navy/90 px-3 py-1 text-[11px] font-bold text-gold backdrop-blur">
                        {p.category}
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
                        <span className={`rounded-full px-2.5 py-0.5 ${statusTone[p.status] ?? "bg-muted text-navy"}`}>
                          {p.status}
                        </span>
                        <span className="text-muted-foreground font-mono">{p.year}</span>
                      </div>
                      <h3 className="mt-3 text-base font-bold leading-snug text-navy">{p.title}</h3>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Icon name="pin" className="h-3.5 w-3.5 shrink-0 text-gold" />
                        {p.location}
                      </p>
                      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {p.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <button
                      className="btn-base btn-ghost-navy w-full text-xs font-bold"
                      onClick={() => setActive(p)}
                    >
                      View Case Study Details
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Project Details Modal */}
      <Modal open={!!active} onClose={() => setActive(null)} title={active?.title ?? ""}>
        {active && (
          <div className="space-y-4 text-xs">
            <img
              src={active.image || "/images/hero.jpg"}
              alt={`${active.title} project photograph`}
              className="aspect-[16/9] w-full rounded-xl object-cover border border-border"
            />
            <dl className="grid gap-3 sm:grid-cols-2 bg-mist/50 p-4 rounded-xl border border-border">
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Service Category
                </dt>
                <dd className="mt-0.5 text-xs font-bold text-navy">{active.category}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Client / Sector
                </dt>
                <dd className="mt-0.5 text-xs font-bold text-navy">{active.client || "Confidential Facility"}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Location & Year
                </dt>
                <dd className="mt-0.5 text-xs font-semibold text-navy">{active.location} ({active.year})</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Contract Status
                </dt>
                <dd className="mt-0.5">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusTone[active.status] || "bg-muted"}`}>
                    {active.status}
                  </span>
                </dd>
              </div>
            </dl>

            <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {active.description}
            </p>

            {active.scopeOfWork?.length ? (
              <div>
                <h4 className="font-bold text-navy mb-2">Scope of Operations Executed:</h4>
                <ul className="space-y-1">
                  {active.scopeOfWork.map((s: string) => (
                    <li key={s} className="flex items-center gap-2 text-navy-700">
                      <Icon name="check" className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
              <button
                className="btn-base btn-accent text-xs font-bold"
                onClick={() => {
                  const services = [active.category];
                  setActive(null);
                  openQuote({ services });
                }}
              >
                Request Similar Facility Scope
              </button>
              <button className="btn-base btn-secondary text-xs" onClick={() => setActive(null)}>
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      <CTABanner />
    </SiteLayout>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import SiteLayout, { PageHeader, useQuote } from "@/components/site/SiteLayout";
import Icon from "@/components/ui/Icon";
import InView from "@/components/ui/InView";
import Modal from "@/components/ui/Modal";
import { CTABanner, SectionTitle } from "@/components/site/Sections";

const statusConfig: Record<string, { label: string; tone: string; dot: string }> = {
  Completed: {
    label: "Completed",
    tone: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
    dot: "bg-emerald-500",
  },
  Ongoing: {
    label: "Ongoing",
    tone: "bg-blue-500/10 text-blue-700 border-blue-500/30",
    dot: "bg-blue-500",
  },
  "In Progress": {
    label: "In Progress",
    tone: "bg-amber-500/10 text-amber-700 border-amber-500/30",
    dot: "bg-amber-500",
  },
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
        if (Array.isArray(catData)) setCategories(catData.filter((c: any) => c.status !== "Inactive"));
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
        placement="page_portfolio"
        eyebrow="Proven Deployments & Track Record"
        title="Facility Operations Delivered Across Pune & Maharashtra"
        highlightedTitle="Facility Operations Delivered"
        subtitle="Explore our verified facility management contracts, security deployments, mechanized cleaning turnarounds, and preventative upkeep case studies."
        image="/images/headers/portfolio-header.webp"
        imageAlt="Proven Facility Operations and Verified Case Studies Delivered Across Pune"
        ctaText="Discuss Your Facility"
        ctaAction={() => openQuote()}
        secondaryCtaText="View Field Gallery"
        secondaryCtaLink="/gallery"
      />

      <section className="section-y bg-background relative overflow-hidden">
        <div className="container-x">
          <InView direction="up">
            <SectionTitle
              eyebrow="Case Studies"
              title="Projects & Client Deployments"
              subtitle="Filter by service division to review executed scope of work and verified deliverables."
            />
          </InView>

          {/* Category Dropdown & Active Filter Bar */}
          <InView direction="up" delay={100}>
            <div className="mt-8 mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 sm:gap-4 border-b border-slate-200/80 pb-4 sm:pb-5">
              <div>
                <h2 className="font-display text-lg sm:text-xl font-extrabold text-navy">
                  Deployments & Case Studies
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                  Showing {list.length} of {projects.length} verified operations across Pune & PCMC
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <label htmlFor="portfolio-category-filter" className="text-xs font-bold text-navy whitespace-nowrap">
                  Filter by Category:
                </label>
                <div className="relative w-full sm:w-64">
                  <select
                    id="portfolio-category-filter"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-10 text-xs sm:text-sm font-semibold text-navy shadow-xs focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold cursor-pointer transition-all hover:border-gold/60"
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
          </InView>

          {loading ? (
            <div className="py-20 text-center">
              <span className="h-7 w-7 animate-spin rounded-full border-2 border-gold border-t-transparent inline-block" />
              <p className="mt-2 text-xs font-semibold text-navy">Loading portfolio showcase from database…</p>
            </div>
          ) : list.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-card p-8 sm:p-12 text-center">
              <Icon name="inbox" className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-3 text-sm font-semibold text-navy">No deployments listed under &quot;{category}&quot; yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Contact our facility team for specific case studies and client references.
              </p>
              <button
                onClick={() => setCategory("All")}
                className="mt-3 text-xs font-bold text-gold hover:underline"
              >
                Reset to all categories
              </button>
            </div>
          ) : (
            <div className="mt-6 sm:mt-8 grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p, idx) => {
                const status = statusConfig[p.status] || {
                  label: p.status || "Ongoing",
                  tone: "bg-blue-500/10 text-blue-700 border-blue-500/30",
                  dot: "bg-blue-500",
                };

                return (
                  <InView key={p._id || p.id} direction="up" delay={(idx % 3) * 100}>
                    <article className="card-border-beam group h-full">
                      <div className="card-border-beam-inner flex flex-col justify-between h-full">
                        <div>
                          {/* Image Banner */}
                          <div className="relative aspect-[16/10] w-full overflow-hidden bg-navy/5 border-b border-border/60">
                            <img
                              src={p.image || "/images/hero.jpg"}
                              alt={`${p.title} in ${p.location}`}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />
                            <span className="absolute left-3 top-3 rounded-lg bg-navy/90 px-2.5 py-1 text-[10px] sm:text-[11px] font-bold text-gold backdrop-blur-md border border-gold/40 shadow-sm max-w-[80%] truncate">
                              {p.category}
                            </span>
                          </div>

                          {/* Body Content */}
                          <div className="p-4 sm:p-5">
                            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold">
                              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 border ${status.tone} shadow-2xs text-[10px]`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${status.dot} animate-pulse`} />
                                {status.label}
                              </span>
                              <span className="text-slate-400 font-mono text-xs">{p.year}</span>
                            </div>

                            <h3 className="mt-3 font-display text-sm sm:text-base font-bold leading-snug text-navy group-hover:text-gold transition-colors">
                              {p.title}
                            </h3>

                            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                              <Icon name="pin" className="h-3.5 w-3.5 shrink-0 text-gold" />
                              <span>{p.location}</span>
                            </p>

                            <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                              {p.description}
                            </p>
                          </div>
                        </div>

                        {/* Action CTA Button */}
                        <div className="p-4 sm:p-5 pt-0">
                          <button
                            className="btn-base btn-live-navy w-full text-xs font-bold py-2.5 rounded-xl shadow-2xs flex items-center justify-center gap-2 group/btn border border-slate-200"
                            onClick={() => setActive(p)}
                          >
                            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none animate-[shimmer-sweep_4s_infinite]" />
                            <span className="relative z-10">View Case Study Details</span>
                            <Icon
                              name="arrow"
                              className="relative z-10 h-3.5 w-3.5 text-gold transition-transform duration-300 group-hover/btn:translate-x-1"
                            />
                          </button>
                        </div>
                      </div>
                    </article>
                  </InView>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Project Details Modal */}
      <Modal open={!!active} onClose={() => setActive(null)} title={active?.title ?? ""}>
        {active && (
          <div className="space-y-4 text-xs">
            <div className="relative overflow-hidden rounded-xl border border-gold/30 shadow-md">
              <img
                src={active.image || "/images/hero.jpg"}
                alt={`${active.title} project photograph`}
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
            
            <dl className="grid gap-2.5 sm:gap-3 grid-cols-1 sm:grid-cols-2 bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200">
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
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold border ${statusConfig[active.status]?.tone || "bg-muted"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${statusConfig[active.status]?.dot || "bg-navy"} animate-pulse`} />
                    {active.status}
                  </span>
                </dd>
              </div>
            </dl>

            <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {active.description}
            </p>

            {active.scopeOfWork?.length ? (
              <div className="p-3.5 rounded-xl bg-gold/5 border border-gold/20">
                <h4 className="font-bold text-navy mb-2 flex items-center gap-1.5">
                  <Icon name="check" className="w-3.5 h-3.5 text-gold" />
                  Scope of Operations Executed:
                </h4>
                <ul className="space-y-1.5">
                  {active.scopeOfWork.map((s: string) => (
                    <li key={s} className="flex items-center gap-2 text-navy-700 font-medium">
                      <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-600">
                        <Icon name="check" className="w-2.5 h-2.5" strokeWidth={3} />
                      </span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 pt-3.5 border-t border-slate-200">
              <button
                className="btn-base btn-ghost-navy text-xs font-semibold px-4 py-2 text-center"
                onClick={() => setActive(null)}
              >
                Close
              </button>
              <button
                className="btn-base btn-live-gold text-xs font-bold px-6 py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 group w-full sm:w-auto"
                onClick={() => {
                  const services = [active.category];
                  setActive(null);
                  openQuote({ services });
                }}
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none animate-[shimmer-sweep_3.5s_infinite]" />
                <span className="relative z-10">Request Similar Scope</span>
                <Icon name="arrow" className="relative z-10 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}
      </Modal>

      <InView direction="up">
        <CTABanner />
      </InView>
    </SiteLayout>
  );
}

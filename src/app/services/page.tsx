"use client";

import { useEffect, useState } from "react";
import SiteLayout, { PageHeader, useQuote } from "@/components/site/SiteLayout";
import InView from "@/components/ui/InView";
import { CTABanner, HowItWorks, ServiceCard } from "@/components/site/Sections";

export default function ServicesPage() {
  const { openQuote } = useQuote();
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        setLoading(true);
        const res = await fetch("/api/service-categories");
        const data = await res.json();
        if (Array.isArray(data)) {
          const active = data.filter((c) => c.status !== "Inactive");
          setCategories(active);
        }
      } catch (err) {
        console.error("Failed to load services:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, []);

  const filteredCategories = selectedCategory === "All"
    ? categories
    : categories.filter((c) => c.name === selectedCategory);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Integrated Service Divisions"
        title="Comprehensive Facility Management Solutions"
        highlightedTitle="Facility Management Solutions"
        subtitle="From armed security & mechanized housekeeping to waterproofing, plumbing, CCTV surveillance and complete facility maintenance contracts — single-point accountability for Pune & PCMC."
        image="/images/headers/services-header.png"
        imageAlt="Comprehensive Facility Management Solutions and Service Divisions in Pune"
        ctaText="Instant Cost Estimator"
        ctaLink="/pricing-estimator"
        secondaryCtaText="Request Custom Proposal"
        secondaryCtaAction={() => openQuote()}
      />

      <section className="section-y bg-mist relative overflow-hidden">
        <div className="container-x">
          {/* Category Dropdown & Active Counter Filter */}
          <InView direction="up">
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 sm:gap-4 border-b border-slate-200/80 pb-4 sm:pb-5">
              <div>
                <h2 className="font-display text-lg sm:text-xl font-extrabold text-navy">
                  Service Catalog
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                  Showing {filteredCategories.length} of {categories.length} service divisions in Pune & PCMC
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <label htmlFor="service-category-filter" className="text-xs font-bold text-navy whitespace-nowrap">
                  Filter by Category:
                </label>
                <div className="relative w-full sm:w-64">
                  <select
                    id="service-category-filter"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-10 text-xs sm:text-sm font-semibold text-navy shadow-xs focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold cursor-pointer transition-all hover:border-gold/60"
                  >
                    <option value="All">All Categories ({categories.length})</option>
                    {categories.map((c) => (
                      <option key={c._id || c.slug} value={c.name}>
                        {c.name}
                      </option>
                    ))}
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
              <p className="mt-2 text-xs font-semibold text-navy">Loading official service catalog…</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCategories.map((cat, idx) => (
                <InView key={cat._id || cat.slug} direction="up" delay={(idx % 4) * 80}>
                  <ServiceCard
                    service={{
                      id: cat._id,
                      slug: cat.slug,
                      name: cat.name,
                      short: cat.shortDescription,
                      icon: cat.icon || "layers",
                      image: cat.image || "/images/hero.jpg",
                      features: cat.features || [],
                      startingPrice: cat.startingPrice || 0,
                      priceNote: cat.priceNote || "per contract",
                      cta: "Get Service Quote",
                    }}
                  />
                </InView>
              ))}
            </div>
          )}

          {!loading && filteredCategories.length === 0 && (
            <div className="text-center py-16">
              <p className="text-sm font-semibold text-navy">No service divisions found for &quot;{selectedCategory}&quot;.</p>
              <button
                onClick={() => setSelectedCategory("All")}
                className="mt-3 text-xs font-bold text-gold hover:underline"
              >
                Reset to all categories
              </button>
            </div>
          )}
        </div>
      </section>

      <InView direction="up">
        <HowItWorks />
      </InView>

      <InView direction="up">
        <CTABanner />
      </InView>
    </SiteLayout>
  );
}

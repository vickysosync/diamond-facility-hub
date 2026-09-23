"use client";

import { useEffect, useState } from "react";
import SiteLayout, { PageHeader } from "@/components/site/SiteLayout";
import { CTABanner, HowItWorks, ServiceCard } from "@/components/site/Sections";

export default function ServicesPage() {
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
        subtitle="From armed security & housekeeping to waterproofing, plumbing, CCTV and complete facility contracts — single-point accountability for Pune & PCMC."
      />
      <section className="section-y bg-mist">
        <div className="container-x">
          {/* Category Dropdown Filter */}
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/70 pb-5">
            <div>
              <h2 className="font-display text-xl font-bold text-navy">Service Catalog</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Showing {filteredCategories.length} of {categories.length} service divisions
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <label htmlFor="service-category-filter" className="text-xs sm:text-sm font-bold text-navy whitespace-nowrap">
                Filter by Category
              </label>
              <div className="relative flex-1 sm:w-64">
                <select
                  id="service-category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-border bg-white px-4 py-2.5 pr-10 text-xs sm:text-sm font-semibold text-navy shadow-xs focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold cursor-pointer transition-all hover:border-gold/60"
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

          {loading ? (
            <div className="py-20 text-center">
              <span className="h-7 w-7 animate-spin rounded-full border-2 border-gold border-t-transparent inline-block" />
              <p className="mt-2 text-xs font-semibold text-navy">Loading official service catalog…</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCategories.map((cat) => (
                <ServiceCard
                  key={cat._id || cat.slug}
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
              ))}
            </div>
          )}

          {!loading && filteredCategories.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-10">
              No services found for the selected category.
            </p>
          )}
        </div>
      </section>
      <HowItWorks />
      <CTABanner />
    </SiteLayout>
  );
}

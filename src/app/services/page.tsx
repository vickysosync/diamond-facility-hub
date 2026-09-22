"use client";

import { useEffect, useState } from "react";
import SiteLayout, { PageHeader } from "@/components/site/SiteLayout";
import { CTABanner, HowItWorks, ServiceCard } from "@/components/site/Sections";

export default function ServicesPage() {
  const [categories, setCategories] = useState<any[]>([]);
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

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Integrated Service Divisions"
        title="11 Core Facility Management Solutions"
        subtitle="From armed security & housekeeping to waterproofing, plumbing, CCTV and complete facility contracts — single-point accountability for Pune & PCMC."
      />
      <section className="section-y bg-mist">
        <div className="container-x">
          {loading ? (
            <div className="py-20 text-center">
              <span className="h-7 w-7 animate-spin rounded-full border-2 border-gold border-t-transparent inline-block" />
              <p className="mt-2 text-xs font-semibold text-navy">Loading official service catalog…</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categories.map((cat) => (
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

          {!loading && categories.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              No active services available at the moment. Please contact our facility desk.
            </p>
          )}
        </div>
      </section>
      <HowItWorks />
      <CTABanner />
    </SiteLayout>
  );
}

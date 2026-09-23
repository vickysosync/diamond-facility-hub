"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import SiteLayout, { useQuote } from "@/components/site/SiteLayout";
import Icon from "@/components/ui/Icon";
import { formatINR } from "@/data/mock";
import { CTABanner, HowItWorks } from "@/components/site/Sections";

function ServiceNotFound() {
  return (
    <SiteLayout>
      <div className="container-x py-24 text-center">
        <h1 className="text-2xl font-extrabold text-navy">Service category not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">This service line is not available or has been moved.</p>
        <Link href="/services" className="btn-base btn-navy mt-6">
          ← View All Service Divisions
        </Link>
      </div>
    </SiteLayout>
  );
}

export default function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { openQuote } = useQuote();

  const [category, setCategory] = useState<any>(null);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch("/api/service-categories");
        const data = await res.json();
        if (Array.isArray(data)) {
          setAllCategories(data);
          const found = data.find((c: any) => c.slug === slug);
          setCategory(found || null);
        }
      } catch (err) {
        console.error("Failed to load service detail:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <SiteLayout>
        <div className="container-x py-24 text-center">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent inline-block" />
          <p className="mt-3 text-sm font-semibold text-navy">Loading service specifications…</p>
        </div>
      </SiteLayout>
    );
  }

  if (!category) return <ServiceNotFound />;

  const others = allCategories.filter((s) => s.slug !== slug);

  return (
    <SiteLayout>
      <section className="relative isolate overflow-hidden bg-navy">
        <img
          src={category.image || "/images/hero.jpg"}
          alt={`${category.name} in Pune by Diamond Integrated Facility Services`}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/85 to-navy/60" />
        <div className="container-x relative py-16 lg:py-24">
          <div className="flex items-center gap-2">
            <Link href="/services" className="text-xs font-bold uppercase tracking-[0.16em] text-gold hover:underline">
              ← All Service Divisions
            </Link>
          </div>
          <h1 className="mt-4 max-w-3xl text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            {category.name}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white sm:text-base">
            {category.shortDescription}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              className="btn-base btn-accent font-bold"
              onClick={() => openQuote({ services: [category.name] })}
            >
              Get Custom Quote <Icon name="arrow" className="w-4 h-4" />
            </button>
            <Link href="/contact" className="btn-base btn-outline-light">
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>

      <section className="section-y bg-background">
        <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div>
            <h2 className="text-2xl font-extrabold text-navy">Service Scope & Operations</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base whitespace-pre-wrap">
              {category.description || category.shortDescription}
            </p>

            <h3 className="text-lg font-bold text-navy mt-10">Offerings & Capabilities Included</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(category.features || []).map((f: string) => (
                <div key={f} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card">
                  <Icon name="check" className="h-4 w-4 shrink-0 text-emerald-600" strokeWidth={3} />
                  <span className="text-xs font-semibold text-navy">{f}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 rounded-2xl bg-mist border border-border">
              <h3 className="text-base font-bold text-navy flex items-center gap-2">
                <Icon name="shield" className="w-5 h-5 text-gold" /> SLA & Compliance Guarantee
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                All personnel deployed under {category.name} undergo police background verification, statutory ESIC/PF compliance, site-specific safety protocol briefings, and regular performance audits by Diamond operations supervisors.
              </p>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">Standard Pricing</p>
              <p className="font-display text-3xl font-extrabold text-navy mt-1">
                {category.startingPrice ? formatINR(category.startingPrice) : "Custom Assessment"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{category.priceNote}</p>
              <button
                className="btn-base btn-accent mt-5 w-full font-bold"
                onClick={() => openQuote({ services: [category.name] })}
              >
                Request Quotation
              </button>
              <p className="mt-3 text-[11px] text-muted-foreground leading-relaxed">
                Transparent SLA contracts for residential societies, commercial IT parks, manufacturing plants and institutions.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-display text-xs font-bold uppercase tracking-widest text-navy mb-3">
                All Service Divisions
              </h3>
              <ul className="space-y-1 max-h-96 overflow-y-auto pr-1">
                {others.map((o) => (
                  <li key={o._id || o.slug}>
                    <Link
                      href={`/services/${o.slug}`}
                      className="flex items-center gap-2.5 rounded-lg p-2 text-xs font-semibold text-navy hover:bg-gold/10 hover:text-gold transition-colors"
                    >
                      <Icon name={o.icon || "layers"} className="h-3.5 w-3.5 text-gold shrink-0" />
                      <span className="truncate">{o.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <HowItWorks />
      <CTABanner />
    </SiteLayout>
  );
}

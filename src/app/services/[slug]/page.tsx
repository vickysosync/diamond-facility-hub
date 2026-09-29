"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import SiteLayout, { PageHeader, useQuote } from "@/components/site/SiteLayout";
import Icon from "@/components/ui/Icon";
import InView from "@/components/ui/InView";
import { CTABanner, HowItWorks } from "@/components/site/Sections";

function ServiceNotFound() {
  return (
    <SiteLayout>
      <div className="container-x py-20 sm:py-28 text-center">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gold/15 text-gold border border-gold/30">
          <Icon name="layers" className="h-7 w-7" />
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-navy">Service Category Not Found</h1>
        <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
          The requested service division may have been updated or moved. Please explore our full service catalog below.
        </p>
        <Link href="/services" className="btn-base btn-live-navy mt-6 inline-flex items-center gap-2 text-xs sm:text-sm font-bold px-6 py-3 rounded-xl shadow-md">
          <span>← View All Service Divisions</span>
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
          setAllCategories(data.filter((c: any) => c.status !== "Inactive"));
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
          <p className="mt-3 text-xs sm:text-sm font-semibold text-navy">Loading service specifications…</p>
        </div>
      </SiteLayout>
    );
  }

  if (!category) return <ServiceNotFound />;

  const others = allCategories.filter((s) => s.slug !== slug);

  return (
    <SiteLayout>
      {/* Universal 3D Responsive PageHeader */}
      <PageHeader
        eyebrow="Diamond Facility Service Division"
        title={category.name}
        subtitle={category.shortDescription}
        image={category.image || "/images/headers/services-header.webp"}
        imageAlt={`${category.name} in Pune by Diamond Integrated Facility Services`}
        ctaText="Request Service Quote"
        ctaAction={() => openQuote({ services: [category.name] })}
        secondaryCtaText="All Service Divisions"
        secondaryCtaLink="/services"
      />

      {/* Main Service Scope & Pricing Section */}
      <section className="section-y bg-background relative overflow-hidden">
        <div className="container-x grid gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          {/* Left Column: Scope & Offerings */}
          <InView direction="up">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gold">
                <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                <span>Scope of Work & Protocol</span>
              </div>

              <h2 className="mt-3 font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-navy tracking-tight">
                Service Scope & Operations
              </h2>
              <p className="mt-3 sm:mt-4 text-xs sm:text-base leading-relaxed text-muted-foreground whitespace-pre-wrap font-normal">
                {category.description || category.shortDescription}
              </p>

              {/* Offerings & Capabilities Grid */}
              <h3 className="font-display text-base sm:text-lg font-bold text-navy mt-8 sm:mt-10 flex items-center gap-2">
                <Icon name="check" className="h-4 w-4 text-gold" strokeWidth={3} />
                Offerings & Capabilities Included
              </h3>

              <div className="mt-4 grid gap-2.5 sm:gap-3 sm:grid-cols-2">
                {(category.features || []).map((f: string) => (
                  <div
                    key={f}
                    className="card-3d flex items-start gap-2.5 sm:gap-3 rounded-xl border border-slate-200/85 bg-white p-3.5 sm:p-4 shadow-xs transition-all duration-300 hover:border-gold/50"
                  >
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/20">
                      <Icon name="check" className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-navy leading-snug">{f}</span>
                  </div>
                ))}
              </div>

              {/* SLA & Statutory Compliance Card */}
              <div className="card-3d mt-8 sm:mt-10 p-5 sm:p-6 rounded-2xl bg-white border border-gold/40 shadow-sm relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-gold before:to-transparent">
                <h3 className="font-display text-sm sm:text-base font-bold text-navy flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-gold/15 text-gold border border-gold/30">
                    <Icon name="shield" className="w-4 h-4 text-gold" />
                  </span>
                  SLA & Statutory Compliance Guarantee
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  All workforce deployed under <strong className="text-navy">{category.name}</strong> undergo police background verification, statutory ESIC/PF enrollment, site-specific safety briefings, and scheduled supervisor audits across Pune & PCMC.
                </p>
              </div>
            </div>
          </InView>

          {/* Right Column: Pricing & Quick Navigation Sidebar */}
          <InView direction="up" delay={150}>
            <aside className="space-y-5 sm:space-y-6">
              {/* Pricing Estimator 3D Card */}
              <div className="card-3d relative rounded-2xl border border-gold/40 bg-navy p-5 sm:p-6 text-white shadow-xl before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-gold before:to-transparent">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] sm:text-[11px] uppercase tracking-widest text-gold font-bold">Commercial Package</p>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                    Transparent SLA
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-xs text-slate-300">Commercial Scope</p>
                  <p className="font-display text-2xl sm:text-3xl font-extrabold text-gold tracking-tight mt-0.5">
                    Custom Assessment
                  </p>
                  <p className="text-[11px] text-slate-300 mt-1">Tailored to site requirements & SLA</p>
                </div>

                <button
                  className="btn-base btn-live-gold mt-5 w-full text-xs sm:text-sm font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 group"
                  onClick={() => openQuote({ services: [category.name] })}
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none animate-[shimmer-sweep_3.5s_infinite]" />
                  <span className="relative z-10">Request Quotation</span>
                  <Icon name="arrow" className="relative z-10 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>

                <p className="mt-3.5 text-[10.5px] sm:text-[11px] text-slate-300 text-center leading-relaxed">
                  Tailored packages for residential societies, commercial IT parks, industrial campuses and institutions across Pune.
                </p>
              </div>

              {/* Other Service Divisions Navigation Card */}
              <div className="card-3d relative rounded-2xl border border-slate-200/85 bg-white p-5 sm:p-6 shadow-sm">
                <h3 className="font-display text-xs font-bold uppercase tracking-widest text-navy mb-3 flex items-center justify-between pb-2 border-b border-border">
                  <span>Other Service Divisions</span>
                  <span className="text-[10px] text-gold font-mono font-bold">({others.length})</span>
                </h3>
                <ul className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                  {others.map((o) => (
                    <li key={o._id || o.slug}>
                      <Link
                        href={`/services/${o.slug}`}
                        className="flex items-center justify-between gap-2.5 rounded-xl p-2.5 text-xs font-semibold text-navy hover:bg-gold/10 hover:text-gold transition-colors group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-navy text-gold text-[10px]">
                            <Icon name={o.icon || "layers"} className="h-3.5 w-3.5" />
                          </span>
                          <span className="truncate">{o.name}</span>
                        </div>
                        <Icon name="arrow" className="h-3 w-3 text-muted-foreground group-hover:text-gold group-hover:translate-x-1 transition-all shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </InView>
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

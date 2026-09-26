"use client";

import SiteLayout, { PageHeader } from "@/components/site/SiteLayout";
import Icon from "@/components/ui/Icon";
import InView from "@/components/ui/InView";
import { useApp } from "@/store/AppStore";
import { CTABanner, HowItWorks, SectionTitle, WhyChooseUs } from "@/components/site/Sections";

export default function AboutPage() {
  const { company } = useApp();
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="About Diamond Integrated Services"
        title="Integrated Facility Services Built Around Your Needs"
        highlightedTitle="Facility Services"
        subtitle={company.businessDescription || "Integrated facility management and commercial property support services across Pune and PCMC, backed by verified personnel, statutory compliance and flexible service packages."}
        image="/images/headers/about-header.png"
        imageAlt="Diamond Integrated Facility Services Leadership and Field Operations in Pune"
        ctaText="Request Service Proposal"
        secondaryCtaText="Explore Services"
        secondaryCtaLink="/services"
      />

      <section className="section-y relative overflow-hidden">
        <div className="container-x grid items-start gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
          <InView direction="up">
            <div>
              <SectionTitle eyebrow="Who we are" title="One Partner. Every Facility Service." />
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">{company.about}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Working with a single integrated partner removes the coordination burden of managing
                several vendors. Scope, scheduling, supervision and reporting stay with one team, so
                accountability is always clear.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  ["Professional service approach", "briefcase"],
                  ["Reliable workforce", "users"],
                  ["Safety-focused operations", "shield"],
                  ["Flexible service packages", "sliders"],
                  ["B2B-focused solutions", "layers"],
                  ["Responsive customer support", "headset"],
                ].map(([label, icon]) => (
                  <div
                    key={label}
                    className="card-3d group flex items-center gap-3 rounded-xl border border-slate-200/85 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-md"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gold/15 text-gold border border-gold/30 group-hover:scale-110 transition-transform">
                      <Icon name={icon} className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-semibold text-navy group-hover:text-navy-800">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </InView>

          <InView direction="up" delay={150}>
            <aside className="space-y-6">
              <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-navy shadow-lg">
                <img
                  src="/images/facility.jpg"
                  alt="Facility management staff coordinating services at a commercial property"
                  loading="lazy"
                  className="h-64 w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
              </div>

              <div className="card-3d relative rounded-2xl border border-gold/40 bg-navy p-6 text-white shadow-xl before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-gold before:to-transparent">
                <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
                  Company Highlights
                </h3>
                <ul className="mt-4 space-y-3 text-sm">
                  {[
                    ["Service lines", "Core Divisions (Security, Housekeeping, Pest Control, Manpower, Tank Cleaning, CCTV, Civil Upkeep)"],
                    ["Client types", "Commercial, Residential, Industrial, Institutional, IT Parks"],
                    ["Service region", "Pune, PCMC & Maharashtra"],
                    ["Engagement", "One-time, monthly, quarterly and annual AMC contracts"],
                  ].map(([k, v]) => (
                    <li key={k} className="border-b border-white/12 pb-3 last:border-0">
                      <p className="text-[11px] uppercase tracking-widest text-gold font-bold">{k}</p>
                      <p className="mt-1 text-slate-200 text-xs sm:text-sm">{v}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </InView>
        </div>
      </section>

      <InView direction="up">
        <WhyChooseUs />
      </InView>

      <InView direction="up">
        <HowItWorks />
      </InView>

      <InView direction="up">
        <CTABanner />
      </InView>
    </SiteLayout>
  );
}

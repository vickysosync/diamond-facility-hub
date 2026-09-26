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

      {/* Main Who We Are Story Section */}
      <section className="section-y relative overflow-hidden">
        <div className="container-x grid items-start gap-8 sm:gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
          {/* Left Column: Mission & Core Value Propositions */}
          <InView direction="up">
            <div>
              <SectionTitle eyebrow="Who We Are" title="One Partner. Every Facility Service." />
              <p className="mt-4 sm:mt-5 text-xs sm:text-base leading-relaxed text-muted-foreground font-normal">
                {company.about || "Diamond Integrated Facility Services LLP provides full-spectrum facility management including 24/7 Security Guarding, Housekeeping, Property Management, Pest Control, Manpower Supply, Tank Cleaning, CCTV and Technical Civil Maintenance across Pune & PCMC."}
              </p>
              <p className="mt-3 sm:mt-4 text-xs sm:text-base leading-relaxed text-muted-foreground font-normal">
                Working with a single integrated partner removes the coordination burden of managing multiple contractors. Scope, scheduling, supervision and reporting stay with one dedicated team, ensuring total operational accountability and single-invoice simplicity.
              </p>

              {/* 6 Responsive Interactive Feature Micro-Cards */}
              <div className="mt-6 sm:mt-8 grid gap-2.5 sm:gap-3.5 sm:grid-cols-2">
                {[
                  ["Professional Service Approach", "briefcase"],
                  ["Reliable Verified Workforce", "users"],
                  ["Safety-Focused Operations", "shield"],
                  ["Flexible Contract Packages", "sliders"],
                  ["B2B Institutional Solutions", "layers"],
                  ["24/7 Rapid Response Support", "headset"],
                ].map(([label, icon]) => (
                  <div
                    key={label}
                    className="card-3d group flex items-center gap-3 rounded-xl border border-slate-200/85 bg-white p-3 sm:p-4 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-md"
                  >
                    <span className="grid h-8 w-8 sm:h-9 sm:w-9 shrink-0 place-items-center rounded-lg bg-gold/15 text-gold border border-gold/30 group-hover:scale-110 transition-transform">
                      <Icon name={icon} className="h-4 w-4" />
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-navy group-hover:text-navy-800 transition-colors">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </InView>

          {/* Right Column: Framed Visual & 3D Glass Highlights Card */}
          <InView direction="up" delay={150}>
            <aside className="space-y-4 sm:space-y-6">
              {/* Framed Architectural / Operations Visual */}
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-gold/30 bg-navy shadow-lg group">
                <img
                  src="/images/facility.jpg"
                  alt="Facility management staff coordinating services at a commercial property"
                  loading="lazy"
                  className="h-56 sm:h-64 lg:h-72 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
                
                {/* Floating Credential Pill */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 rounded-full border border-gold/50 bg-[#0a1019]/85 px-3 py-1 sm:px-3.5 sm:py-1.5 text-[9.5px] sm:text-[11px] font-bold uppercase tracking-wide sm:tracking-wider text-gold shadow-lg backdrop-blur-md flex items-center gap-1.5 sm:gap-2">
                  <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
                  <span>Registered LLP • Pune HQ</span>
                </div>
              </div>

              {/* 3D Glassmorphic Highlights Box */}
              <div className="card-3d relative rounded-2xl border border-gold/40 bg-navy p-4.5 sm:p-6 text-white shadow-xl before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-gold before:to-transparent">
                <h3 className="font-display text-sm sm:text-base font-bold text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
                    Company Highlights
                  </span>
                  <span className="text-[10px] font-mono text-gold font-bold">LLPIN: ACJ-3232</span>
                </h3>

                <ul className="mt-4 space-y-3">
                  {[
                    ["Service Lines", "11 Core Divisions (Security, Housekeeping, Pest Control, Manpower, Tank Cleaning, CCTV, Civil Upkeep)"],
                    ["Client Types", "Commercial IT Parks, Residential Societies, Industrial Plants, Retail & Healthcare"],
                    ["Service Region", "Pune, PCMC, Chakan, Talegaon, Hinjewadi & Maharashtra"],
                    ["Engagement Models", "Comprehensive AMC, Monthly Retainers, On-Demand Deep Cleaning & Turnkey Projects"],
                  ].map(([k, v]) => (
                    <li key={k} className="border-b border-white/10 pb-2.5 last:border-0 last:pb-0">
                      <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-gold font-bold">{k}</p>
                      <p className="mt-0.5 text-slate-200 text-xs sm:text-sm leading-relaxed">{v}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </InView>
        </div>
      </section>

      {/* Leadership & Statutory Governance Trust Block */}
      <section className="section-y bg-gradient-to-b from-mist via-slate-50 to-mist relative overflow-hidden">
        <div className="container-x">
          <InView direction="up">
            <SectionTitle
              eyebrow="Governance & Leadership"
              title="Built on Statutory Integrity and Executive Oversight"
              subtitle="Every Diamond engagement is managed under formal Service Level Agreements, certified workforce records, and transparent compliance reporting."
              center
            />
          </InView>

          <div className="mt-8 sm:mt-12 grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Executive Leadership",
                subtitle: "Direct Operations Oversight",
                desc: "Headed by Managing Director Umesh Patil, our executive team maintains direct oversight across all residential and commercial sites in Pune.",
                icon: "users",
                badge: "Director: Umesh Patil",
              },
              {
                title: "100% Statutory Compliance",
                subtitle: "Zero Client Liability",
                desc: "Full statutory compliance including ESIC, EPFO, GST registration, police-verified guarding personnel, and strict labor code standards.",
                icon: "shield",
                badge: "ESIC • EPFO • PSARA Compliant",
              },
              {
                title: "24/7 Control Room & SLA",
                subtitle: "Structured Escalation Matrix",
                desc: "Continuous control room monitoring, dedicated site supervisors, rapid emergency backup, and monthly technical audit reports.",
                icon: "clock",
                badge: "24/7 Response Hotline",
              },
            ].map((card, idx) => (
              <InView key={card.title} direction="up" delay={idx * 100}>
                <div className="card-border-beam h-full group">
                  <div className="card-border-beam-inner p-5 sm:p-6 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="grid h-11 w-11 sm:h-12 sm:w-12 place-items-center rounded-xl bg-navy text-gold shadow-md border border-gold/30 transition-transform duration-300 group-hover:scale-110">
                          <Icon name={card.icon} className="h-5 w-5 sm:h-6 sm:w-6" />
                        </span>
                        <span className="text-[10px] font-mono font-bold text-gold bg-gold/10 px-2.5 py-1 rounded-full border border-gold/25">
                          {card.badge}
                        </span>
                      </div>

                      <h3 className="mt-4 font-display text-base sm:text-lg font-bold text-navy group-hover:text-navy-800 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-xs font-semibold text-gold mt-0.5">{card.subtitle}</p>
                      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground font-normal">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </InView>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <InView direction="up">
        <WhyChooseUs />
      </InView>

      {/* Structured Onboarding Steps */}
      <InView direction="up">
        <HowItWorks />
      </InView>

      {/* Call to Action Banner */}
      <InView direction="up">
        <CTABanner />
      </InView>
    </SiteLayout>
  );
}

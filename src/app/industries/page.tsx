"use client";

import SiteLayout, { PageHeader, useQuote } from "@/components/site/SiteLayout";
import Icon from "@/components/ui/Icon";
import InView from "@/components/ui/InView";
import { CTABanner, IndustriesGrid, SectionTitle, WhyChooseUs } from "@/components/site/Sections";

export default function IndustriesPage() {
  const { openQuote } = useQuote();

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Specialized Sector Coverage"
        title="Tailored Facility Support for Every Type of Property"
        highlightedTitle="Every Type of Property"
        subtitle="Each sector operates under unique access protocols, hygiene mandates, and shift cycles. Our operational plans are custom-engineered for how your facility actually functions across Pune & PCMC."
        image="/images/headers/industries-header.png"
        imageAlt="Tailored Facility Support for Commercial, Healthcare, Manufacturing and Residential Properties"
        ctaText="Request Custom Scope"
        ctaAction={() => openQuote()}
        secondaryCtaText="Explore Case Studies"
        secondaryCtaLink="/portfolio"
      />

      {/* Main Industries Directory Section */}
      <section className="section-y relative overflow-hidden">
        <div className="container-x">
          <InView direction="up">
            <SectionTitle
              eyebrow="Sectors We Cover"
              title="Industries We Serve Across Maharashtra"
              subtitle="From single-office corporate premises to multi-tower residential societies, industrial plants, and healthcare campuses."
            />
          </InView>

          <InView direction="up" delay={100}>
            <div className="mt-8 sm:mt-12">
              <IndustriesGrid />
            </div>
          </InView>
        </div>
      </section>

      {/* Sector SLA & Compliance Protocols Section */}
      <section className="section-y bg-gradient-to-b from-mist via-slate-50 to-mist relative overflow-hidden">
        <div className="container-x">
          <InView direction="up">
            <SectionTitle
              eyebrow="Specialized Protocols"
              title="Site-Specific Operational Frameworks"
              subtitle="Every property type receives dedicated operational manuals, verified workforce uniforms, and tailored escalation protocols."
              center
            />
          </InView>

          <div className="mt-8 sm:mt-12 grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "IT Parks & Commercial",
                icon: "building",
                points: ["Turnstile & visitor badge control", "Day & night mechanized cleaning", "CCTV 24/7 central surveillance", "Restroom hygiene audits"],
                tag: "Corporate SLA",
              },
              {
                title: "Residential Societies",
                icon: "users",
                points: ["Gatekeeper & vehicle log tracking", "Water tank 6-stage sanitization", "Garden & landscape upkeep", "Society maintenance reporting"],
                tag: "Community Care",
              },
              {
                title: "Industrial & Plants",
                icon: "shield",
                points: ["Armed & perimeter guarding", "Heavy machinery floor scrubbing", "Fire safety & emergency drill", "100% statutory ESIC / PF compliance"],
                tag: "Industrial Grade",
              },
              {
                title: "Healthcare & Retail",
                icon: "check",
                points: ["Hospital-grade disinfectant protocols", "Crowd & queue management", "Touchpoint sanitization cycles", "Biomedical waste management"],
                tag: "Hygiene Certified",
              },
            ].map((p, idx) => (
              <InView key={p.title} direction="up" delay={idx * 80}>
                <div className="card-border-beam h-full group">
                  <div className="card-border-beam-inner p-5 sm:p-6 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy text-gold shadow-md border border-gold/30 group-hover:scale-110 transition-transform">
                          <Icon name={p.icon} className="h-5 w-5" />
                        </span>
                        <span className="text-[9.5px] font-mono font-bold text-gold bg-gold/10 px-2 py-0.5 rounded-full border border-gold/25">
                          {p.tag}
                        </span>
                      </div>

                      <h3 className="mt-4 font-display text-base sm:text-lg font-bold text-navy group-hover:text-navy-800 transition-colors">
                        {p.title}
                      </h3>

                      <ul className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                        {p.points.map((pt) => (
                          <li key={pt} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
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

      {/* Call to Action Banner */}
      <InView direction="up">
        <CTABanner />
      </InView>
    </SiteLayout>
  );
}

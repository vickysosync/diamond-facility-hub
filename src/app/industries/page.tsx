"use client";

import SiteLayout, { PageHeader } from "@/components/site/SiteLayout";
import InView from "@/components/ui/InView";
import { CTABanner, IndustriesGrid, SectionTitle, WhyChooseUs } from "@/components/site/Sections";

export default function IndustriesPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Specialized Sector Coverage"
        title="Tailored Facility Support for Every Type of Property"
        highlightedTitle="Every Type of Property"
        subtitle="Each sector operates under unique access protocols, hygiene mandates, and shift cycles. Our operational plans are custom-engineered for how your facility actually functions."
        image="/images/headers/industries-header.png"
        imageAlt="Tailored Facility Support for Commercial, Healthcare, Manufacturing and Residential Properties"
        ctaText="Request Custom Scope"
        secondaryCtaText="Explore Case Studies"
        secondaryCtaLink="/portfolio"
      />

      <section className="section-y relative overflow-hidden">
        <div className="container-x">
          <InView direction="up">
            <SectionTitle
              eyebrow="Sectors we cover"
              title="Industries We Serve"
              subtitle="From single-office premises to multi-tower societies and industrial plants."
            />
          </InView>
          <InView direction="up" delay={100}>
            <div className="mt-10">
              <IndustriesGrid />
            </div>
          </InView>
        </div>
      </section>

      <InView direction="up">
        <WhyChooseUs />
      </InView>

      <InView direction="up">
        <CTABanner />
      </InView>
    </SiteLayout>
  );
}

"use client";

import SiteLayout, { PageHeader } from "@/components/site/SiteLayout";
import { CTABanner, IndustriesGrid, SectionTitle, WhyChooseUs } from "@/components/site/Sections";

export default function IndustriesPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Industries"
        title="Facility Support for Every Type of Property"
        subtitle="Each sector has different access rules, hygiene standards and working hours. Our service plans are shaped around how your facility actually runs."
      />

      <section className="section-y">
        <div className="container-x">
          <SectionTitle
            eyebrow="Sectors we cover"
            title="Industries We Serve"
            subtitle="From single-office premises to multi-tower societies and industrial plants."
          />
          <div className="mt-9">
            <IndustriesGrid />
          </div>
        </div>
      </section>

      <section className="section-y bg-mist">
        <div className="container-x">
          <SectionTitle
            center
            eyebrow="Why Diamond"
            title="Why Businesses Choose Diamond"
            subtitle="A single accountable partner across every facility requirement."
          />
          <div className="mt-9">
            <WhyChooseUs />
          </div>
        </div>
      </section>

      <CTABanner />
    </SiteLayout>
  );
}

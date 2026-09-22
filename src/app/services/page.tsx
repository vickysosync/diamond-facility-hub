"use client";

import SiteLayout, { PageHeader } from "@/components/site/SiteLayout";
import { useApp } from "@/store/AppStore";
import { CTABanner, HowItWorks, ServiceCard } from "@/components/site/Sections";

export default function ServicesPage() {
  const { services } = useApp();
  const active = services.filter((s) => s.status === "Active");

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Our Services"
        title="Facility Services for Every Type of Property"
        subtitle="Four core service lines, delivered by trained teams and coordinated through a single point of contact."
      />
      <section className="section-y">
        <div className="container-x grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {active.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
        {active.length === 0 && (
          <p className="container-x text-center text-sm text-muted-foreground">
            No active services right now. Please check back soon.
          </p>
        )}
      </section>
      <HowItWorks />
      <CTABanner />
    </SiteLayout>
  );
}

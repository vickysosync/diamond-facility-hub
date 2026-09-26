"use client";

import SiteLayout, { PageHeader } from "@/components/site/SiteLayout";
import Estimator from "@/components/site/Estimator";
import Icon from "@/components/ui/Icon";
import { CTABanner, HowItWorks, SectionTitle } from "@/components/site/Sections";

const notes = [
  {
    icon: "sliders",
    title: "Scope-based pricing",
    text: "Rates change with deployment hours, site conditions and access constraints.",
  },
  {
    icon: "layers",
    title: "Bundle advantage",
    text: "Combining services under one contract reduces coordination and overall cost.",
  },
  {
    icon: "file",
    title: "Written proposal",
    text: "Every enquiry receives a documented scope and transparent commercial breakdown.",
  },
];

export default function PricingEstimatorPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Instant Commercial Estimator"
        title="Estimate Your Facility Service Cost in Seconds"
        highlightedTitle="Facility Service Cost"
        subtitle="Select your required service divisions and facility square footage to calculate an immediate transparent pricing breakdown."
      />

      <section className="section-y">
        <div className="container-x">
          <Estimator />
        </div>
      </section>

      <section className="section-y bg-mist">
        <div className="container-x">
          <SectionTitle
            center
            eyebrow="Good to know"
            title="How Our Pricing Works"
            subtitle="Indicative figures help you plan. Final pricing follows a site assessment."
          />
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {notes.map((n) => (
              <div key={n.title} className="card-lift rounded-2xl border border-border bg-card p-6 shadow-card">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-royal/10 text-royal">
                  <Icon name={n.icon} />
                </span>
                <h3 className="mt-4 text-base font-bold text-navy">{n.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{n.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />
      <CTABanner />
    </SiteLayout>
  );
}

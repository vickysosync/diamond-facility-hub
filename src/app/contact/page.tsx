"use client";

import SiteLayout, { PageHeader } from "@/components/site/SiteLayout";
import InView from "@/components/ui/InView";
import { CTABanner, ContactDetails, ContactForm, SectionTitle } from "@/components/site/Sections";

export default function ContactPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Direct Facility Helpdesk"
        title="Talk Directly With Our Operations Team"
        highlightedTitle="Operations Team"
        subtitle="Share your facility square footage, sector type, and required services. We deliver documented proposals and instant site audits across Pune & PCMC."
      />

      <section className="section-y relative overflow-hidden">
        <div className="container-x">
          <InView direction="up">
            <SectionTitle
              eyebrow="Get in touch"
              title="Enquiries & Service Coordination"
              subtitle="Reach us during business hours or send a message at any time."
            />
          </InView>
          <div className="mt-9 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
            <InView direction="up">
              <ContactDetails />
            </InView>
            <InView direction="up" delay={150}>
              <ContactForm />
            </InView>
          </div>
        </div>
      </section>

      <InView direction="up">
        <CTABanner />
      </InView>
    </SiteLayout>
  );
}

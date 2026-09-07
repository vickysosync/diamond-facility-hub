import { createFileRoute } from "@tanstack/react-router";
import SiteLayout, { PageHeader } from "@/components/site/SiteLayout.jsx";
import { CTABanner, ContactDetails, ContactForm, SectionTitle } from "@/components/site/Sections.jsx";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | Diamond Integrated Facility Services LLP, Pune" },
      {
        name: "description",
        content:
          "Contact Diamond Integrated Facility Services LLP in Kalewadi, Pune for security, pest control, water tank cleaning and painting service enquiries.",
      },
      { property: "og:title", content: "Contact Diamond Integrated Facility Services LLP" },
      {
        property: "og:description",
        content: "Call 6598522321 or send an enquiry for a customised facility service estimate.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Contact"
        title="Talk to Our Facility Services Team"
        subtitle="Share your facility type, size and the services you need. We will respond with a scope and estimate."
      />

      <section className="section-y">
        <div className="container-x">
          <SectionTitle
            eyebrow="Get in touch"
            title="Enquiries & Service Coordination"
            subtitle="Reach us during business hours or send a message at any time."
          />
          <div className="mt-9 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
            <ContactDetails />
            <ContactForm />
          </div>
        </div>
      </section>

      <CTABanner />
    </SiteLayout>
  );
}

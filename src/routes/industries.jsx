import { createFileRoute } from "@tanstack/react-router";
import SiteLayout, { PageHeader } from "@/components/site/SiteLayout.jsx";
import { CTABanner, IndustriesGrid, SectionTitle, WhyChooseUs } from "@/components/site/Sections.jsx";

export const Route = createFileRoute("/industries")({
  head: () => ({
    meta: [
      { title: "Industries We Serve | Facility Management Services Pune" },
      {
        name: "description",
        content:
          "Facility services for corporate offices, residential societies, industrial units, warehouses, schools, hospitals, retail and hospitality across Pune.",
      },
      { property: "og:title", content: "Industries We Serve | Diamond Integrated Facility Services" },
      {
        property: "og:description",
        content:
          "Security, pest control, tank cleaning and painting programmes tailored to each facility type.",
      },
    ],
  }),
  component: IndustriesPage,
});

function IndustriesPage() {
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

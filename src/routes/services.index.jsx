import { createFileRoute } from "@tanstack/react-router";
import SiteLayout, { PageHeader } from "@/components/site/SiteLayout.jsx";
import { useApp } from "@/store/AppStore.jsx";
import { CTABanner, HowItWorks, ServiceCard } from "@/components/site/Sections.jsx";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Facility Services in Pune | Security, Pest Control, Tank Cleaning, Painting" },
      {
        name: "description",
        content:
          "Explore Diamond's facility services in Pune: security guard deployment, pest control, water tank cleaning and interior or exterior painting.",
      },
      { property: "og:title", content: "Our Facility Services | Diamond, Pune" },
      {
        property: "og:description",
        content: "Security, pest control, water tank cleaning and painting services for B2B facilities.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
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

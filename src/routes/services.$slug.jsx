import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import SiteLayout from "@/components/site/SiteLayout.jsx";
import Icon from "@/components/ui/Icon.jsx";
import { useApp } from "@/store/AppStore.jsx";
import { services as seedServices, formatINR } from "@/data/mock.jsx";
import { CTABanner, HowItWorks } from "@/components/site/Sections.jsx";
import { useQuote } from "@/components/site/SiteLayout.jsx";

export const Route = createFileRoute("/services/$slug")({
  head: ({ params }) => {
    const s = seedServices.find((x) => x.slug === params.slug);
    const title = s ? `${s.name} in Pune | Diamond Integrated Facility Services` : "Service | Diamond";
    const description = s ? s.short : "Facility service details.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ServiceDetail,
  notFoundComponent: ServiceNotFound,
});

function ServiceNotFound() {
  return (
    <SiteLayout>
      <div className="container-x py-24 text-center">
        <h1 className="text-2xl font-extrabold text-navy">Service not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">This service is not available.</p>
        <Link to="/services" className="btn-base btn-navy mt-6">
          View all services
        </Link>
      </div>
    </SiteLayout>
  );
}

function ServiceDetail() {
  const { slug } = Route.useParams();
  const { services } = useApp();
  const service = services.find((s) => s.slug === slug);
  const { openQuote } = useQuote();

  if (!service) return <ServiceNotFound />;

  const others = services.filter((s) => s.slug !== slug);

  return (
    <SiteLayout>
      <section className="relative isolate overflow-hidden">
        <img src={service.image} alt={`${service.name} in Pune`} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/85 to-navy/55" />
        <div className="container-x relative py-16 lg:py-24">
          <Link to="/services" className="text-xs font-bold uppercase tracking-[0.16em] text-safety">
            ← All Services
          </Link>
          <h1 className="mt-4 max-w-3xl text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            {service.name}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">{service.short}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button className="btn-base btn-accent" onClick={() => openQuote({ services: [service.name] })}>
              {service.cta}
            </button>
            <Link to="/pricing-estimator" className="btn-base btn-outline-light">
              Estimate Cost
            </Link>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div>
            <h2 className="text-2xl font-extrabold text-navy">What's included</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {service.description}
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {service.features.map((f) => (
                <div key={f} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card">
                  <Icon name="check" className="h-4 w-4 shrink-0 text-success" strokeWidth={3} />
                  <span className="text-sm font-semibold text-navy">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Starting from</p>
              <p className="font-display text-3xl font-extrabold text-navy">
                {formatINR(service.startingPrice)}
              </p>
              <p className="text-xs text-muted-foreground">{service.priceNote}</p>
              <button
                className="btn-base btn-accent mt-5 w-full"
                onClick={() => openQuote({ services: [service.name] })}
              >
                Request Quote
              </button>
              <p className="mt-3 text-xs text-muted-foreground">
                Indicative pricing. Final cost depends on site inspection and scope.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-display text-sm font-bold uppercase tracking-widest text-navy">
                Other Services
              </h3>
              <ul className="mt-4 space-y-2">
                {others.map((o) => (
                  <li key={o.id}>
                    <Link
                      to="/services/$slug"
                      params={{ slug: o.slug }}
                      className="flex items-center gap-3 rounded-lg p-2 text-sm font-semibold text-navy-700 transition-colors hover:bg-muted hover:text-royal"
                    >
                      <Icon name={o.icon} className="h-4 w-4 text-safety" />
                      {o.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <HowItWorks />
      <CTABanner />
    </SiteLayout>
  );
}

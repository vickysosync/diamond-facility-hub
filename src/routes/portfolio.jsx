import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import SiteLayout, { PageHeader, useQuote } from "@/components/site/SiteLayout.jsx";
import Icon from "@/components/ui/Icon.jsx";
import Modal from "@/components/ui/Modal.jsx";
import { useApp } from "@/store/AppStore.jsx";
import { portfolioCategories } from "@/data/mock.jsx";
import { CTABanner, SectionTitle } from "@/components/site/Sections.jsx";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio | Facility Services Projects in Pune | Diamond" },
      {
        name: "description",
        content:
          "Selected security, pest control, water tank cleaning, painting and integrated facility management projects delivered across Pune and Pimpri-Chinchwad.",
      },
      { property: "og:title", content: "Our Facility Services Portfolio | Diamond" },
      {
        property: "og:description",
        content: "Project examples across security, pest control, tank cleaning and painting.",
      },
    ],
  }),
  component: PortfolioPage,
});

const statusTone = {
  Completed: "bg-success/12 text-success",
  Ongoing: "bg-royal/12 text-royal",
  "In Progress": "bg-safety/15 text-safety-dark",
};

function PortfolioPage() {
  const { portfolio } = useApp();
  const { openQuote } = useQuote();
  const [category, setCategory] = useState("All");
  const [active, setActive] = useState(null);

  const list = useMemo(
    () => (category === "All" ? portfolio : portfolio.filter((p) => p.category === category)),
    [portfolio, category],
  );

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Portfolio"
        title="Facility Work Delivered Across Pune"
        subtitle="A snapshot of recent deployments and service contracts. Demonstration content shown with representative imagery."
      />

      <section className="section-y">
        <div className="container-x">
          <SectionTitle
            eyebrow="Our work"
            title="Projects & Deployments"
            subtitle="Filter by service category to see relevant examples."
          />

          <div className="mt-7 flex flex-wrap gap-2">
            {portfolioCategories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={`rounded-full border px-4 py-2 text-xs font-bold transition-colors sm:text-sm ${
                  category === c
                    ? "border-navy bg-navy text-white"
                    : "border-border bg-card text-navy-700 hover:border-royal hover:text-royal"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {list.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-12 text-center">
              <Icon name="inbox" className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-3 text-sm font-semibold text-navy">No projects in this category yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try another category or get in touch to discuss your requirement.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p) => (
                <article
                  key={p.id}
                  className="card-lift group overflow-hidden rounded-2xl border border-border bg-card shadow-card"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <img
                      src={p.image}
                      alt={`${p.title} — ${p.serviceType} in ${p.location}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-navy/85 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
                      {p.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
                      <span className={`rounded-full px-2.5 py-1 ${statusTone[p.status] ?? "bg-muted text-navy"}`}>
                        {p.status}
                      </span>
                      <span className="text-muted-foreground">{p.year}</span>
                    </div>
                    <h3 className="mt-3 text-base font-bold leading-snug text-navy">{p.title}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Icon name="pin" className="h-3.5 w-3.5 shrink-0 text-safety" />
                      {p.location}
                    </p>
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {p.description}
                    </p>
                    <button
                      className="btn-base btn-ghost-navy mt-5 w-full"
                      onClick={() => setActive(p)}
                    >
                      View Project Details
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Modal open={!!active} onClose={() => setActive(null)} title={active?.title ?? ""}>
        {active && (
          <div className="space-y-5">
            <img
              src={active.image}
              alt={`${active.title} project photograph`}
              className="aspect-[16/9] w-full rounded-xl object-cover"
            />
            <dl className="grid gap-4 sm:grid-cols-2">
              {[
                ["Category", active.category],
                ["Service Type", active.serviceType],
                ["Client / Industry", active.client],
                ["Location", active.location],
                ["Year", active.year],
                ["Status", active.status],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-navy">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="text-sm leading-relaxed text-muted-foreground">{active.description}</p>
            <div className="flex flex-wrap gap-2">
              <button
                className="btn-base btn-accent"
                onClick={() => {
                  const services = [active.category];
                  setActive(null);
                  openQuote({ services });
                }}
              >
                Request Similar Service
              </button>
              <button className="btn-base btn-ghost-navy" onClick={() => setActive(null)}>
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      <CTABanner />
    </SiteLayout>
  );
}

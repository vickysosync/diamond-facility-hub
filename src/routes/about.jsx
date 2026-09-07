import { createFileRoute } from "@tanstack/react-router";
import SiteLayout, { PageHeader } from "@/components/site/SiteLayout.jsx";
import Icon from "@/components/ui/Icon.jsx";
import { useApp } from "@/store/AppStore.jsx";
import facility from "@/assets/facility.jpg";
import { CTABanner, HowItWorks, SectionTitle, WhyChooseUs } from "@/components/site/Sections.jsx";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us | Diamond Integrated Facility Services LLP, Pune" },
      {
        name: "description",
        content:
          "Diamond Integrated Facility Services LLP is a Pune-based integrated facility management partner for commercial, residential, industrial and institutional clients.",
      },
      { property: "og:title", content: "About Diamond Integrated Facility Services LLP" },
      {
        property: "og:description",
        content: "Integrated facility management and property support services across Pune.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { company } = useApp();
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="About Us"
        title="Integrated Facility Services Built Around Your Needs"
        subtitle={company.businessDescription}
      />

      <section className="section-y">
        <div className="container-x grid items-start gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <SectionTitle eyebrow="Who we are" title="One Partner. Every Facility Service." />
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">{company.about}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Working with a single integrated partner removes the coordination burden of managing
              several vendors. Scope, scheduling, supervision and reporting stay with one team, so
              accountability is always clear.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                ["Professional service approach", "briefcase"],
                ["Reliable workforce", "users"],
                ["Safety-focused operations", "shield"],
                ["Flexible service packages", "sliders"],
                ["B2B-focused solutions", "layers"],
                ["Responsive customer support", "headset"],
              ].map(([label, icon]) => (
                <div key={label} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-royal/10 text-royal">
                    <Icon name={icon} className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-semibold text-navy">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-5">
            <img
              src={facility}
              alt="Facility management staff coordinating services at a commercial property"
              loading="lazy"
              className="h-64 w-full rounded-2xl object-cover shadow-lift"
            />
            <div className="gradient-navy rounded-2xl p-6 text-white shadow-lift">
              <h3 className="font-display text-base font-bold text-white">Company Highlights</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {[
                  ["Service lines", "Security, Pest Control, Tank Cleaning, Painting"],
                  ["Client types", "Commercial, Residential, Industrial, Institutional"],
                  ["Service region", company.city],
                  ["Engagement", "One-time, monthly, quarterly and annual contracts"],
                ].map(([k, v]) => (
                  <li key={k} className="border-b border-white/12 pb-3 last:border-0">
                    <p className="text-[11px] uppercase tracking-widest text-safety">{k}</p>
                    <p className="mt-1 text-white/85">{v}</p>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <WhyChooseUs />
      <HowItWorks />
      <CTABanner />
    </SiteLayout>
  );
}

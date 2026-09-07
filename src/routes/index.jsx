import { createFileRoute, Link } from "@tanstack/react-router";
import SiteLayout, { useQuote } from "@/components/site/SiteLayout.jsx";
import Icon from "@/components/ui/Icon.jsx";
import { useApp } from "@/store/AppStore.jsx";
import hero from "@/assets/hero.jpg";
import facility from "@/assets/facility.jpg";
import {
  CTABanner,
  ContactDetails,
  ContactForm,
  HowItWorks,
  IndustriesGrid,
  SectionTitle,
  ServiceCard,
  Testimonials,
  WhyChooseUs,
} from "@/components/site/Sections.jsx";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Diamond Integrated Facility Services LLP | Facility Management Pune" },
      {
        name: "description",
        content:
          "Security, pest control, water tank cleaning and painting services in Pune for commercial, residential, industrial and institutional facilities.",
      },
      { property: "og:title", content: "Diamond Integrated Facility Services LLP | Pune" },
      {
        property: "og:description",
        content:
          "One trusted partner for security, pest control, tank cleaning and painting across Pune and Pimpri-Chinchwad.",
      },
    ],
  }),
  component: HomePage,
});

const stats = [
  { value: "4+", label: "Core Services" },
  { value: "B2B", label: "Facility Solutions" },
  { value: "24/7", label: "Residential & Commercial" },
  { value: "Pro", label: "Professional Service Team" },
];

function Hero() {
  const { openQuote } = useQuote();
  return (
    <section className="relative isolate overflow-hidden">
      <img
        src={hero}
        alt="Professional facility management and security team at a commercial building in Pune"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/85 to-navy/60" />
      <div className="container-x relative py-20 lg:py-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white/85">
          Professional • Reliable • Responsive
        </span>
        <h1 className="mt-6 max-w-3xl text-3xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
          Complete Facility Services. <span className="text-safety">One Trusted Partner.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-lg">
          Reliable security, pest control, tank cleaning and painting solutions for commercial,
          residential, industrial and institutional facilities.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button className="btn-base btn-accent" onClick={() => openQuote()}>
            Get Free Quote <Icon name="arrow" className="h-4 w-4" />
          </button>
          <Link to="/services" className="btn-base btn-outline-light">
            Explore Services
          </Link>
        </div>
        <dl className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              style={{ animationDelay: `${i * 90}ms` }}
              className="animate-in fade-in slide-in-from-bottom-4 rounded-2xl border border-white/15 bg-white/8 p-5 backdrop-blur duration-700"
            >
              <dt className="font-display text-2xl font-extrabold text-safety">{s.value}</dt>
              <dd className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/70">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function AboutBlock() {
  const { company } = useApp();
  return (
    <section className="section-y">
      <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionTitle
            eyebrow="About Diamond"
            title="Integrated Facility Services Built Around Your Needs"
            subtitle={company.about}
          />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              "Professional service approach",
              "Reliable workforce",
              "Safety-focused operations",
              "Flexible service packages",
              "B2B-focused solutions",
              "Responsive customer support",
            ].map((item) => (
              <li key={item} className="flex gap-2 text-sm font-medium text-navy-700">
                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-success" strokeWidth={3} />
                {item}
              </li>
            ))}
          </ul>
          <Link to="/about" className="btn-base btn-navy mt-8">
            More About Us <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
        <div className="relative">
          <img
            src={facility}
            alt="Integrated facility management team supporting a corporate property"
            loading="lazy"
            className="h-80 w-full rounded-3xl object-cover shadow-lift sm:h-[26rem]"
          />
          <div className="gradient-navy absolute -bottom-6 left-4 right-4 rounded-2xl p-5 text-white shadow-lift sm:left-8 sm:right-8">
            <p className="text-xs uppercase tracking-widest text-safety">Company Highlights</p>
            <div className="mt-3 grid grid-cols-3 gap-3 text-center">
              {[
                ["4", "Service Lines"],
                ["10", "Industries"],
                ["Pune", "Service Region"],
              ].map(([v, l]) => (
                <div key={l}>
                  <p className="font-display text-lg font-extrabold">{v}</p>
                  <p className="text-[11px] text-white/60">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomePage() {
  const { services } = useApp();
  const active = services.filter((s) => s.status === "Active");

  return (
    <SiteLayout>
      <Hero />
      <AboutBlock />

      <section className="section-y bg-mist">
        <div className="container-x">
          <SectionTitle
            eyebrow="Our Services"
            title="Facility Services Delivered End to End"
            subtitle="Four core service lines managed by one accountable partner."
            center
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {active.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x">
          <SectionTitle
            eyebrow="Industries"
            title="Industries We Serve"
            subtitle="Service programmes tailored to how each type of facility actually operates."
            center
          />
          <div className="mt-12">
            <IndustriesGrid limit={5} />
          </div>
          <div className="mt-8 text-center">
            <Link to="/industries" className="btn-base btn-ghost-navy">
              View All Industries <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <HowItWorks />
      <Testimonials />
      <CTABanner />

      <section className="section-y">
        <div className="container-x grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div>
            <SectionTitle eyebrow="Contact" title="Talk to Our Facility Team" />
            <div className="mt-8">
              <ContactDetails />
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </SiteLayout>
  );
}

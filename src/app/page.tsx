"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteLayout, { useQuote } from "@/components/site/SiteLayout";
import Icon from "@/components/ui/Icon";
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
} from "@/components/site/Sections";

const stats = [
  { value: "11", label: "Core Service Divisions" },
  { value: "500+", label: "Verified Workforce" },
  { value: "24/7", label: "Control Room Response" },
  { value: "100%", label: "Statutory ESIC & PF Compliance" },
];

function Hero() {
  const { openQuote } = useQuote();
  return (
    <section className="relative isolate overflow-hidden bg-navy">
      <img
        src="/images/hero.jpg"
        alt="Professional facility management and security team at a commercial building in Pune"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/85 to-navy/60" />
      <div className="container-x relative py-20 lg:py-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-gold shadow-sm">
          Professional • Reliable • 100% Compliant
        </span>
        <h1 className="mt-6 max-w-3xl text-3xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
          Complete Facility Services. <span className="text-gold">One Trusted Partner.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white sm:text-lg">
          Official provider of Security Guarding, Housekeeping, Property Management, Pest Eradication, Tank Sanitization, Manpower, CCTV and Technical Civil Upkeep across Pune & PCMC.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button className="btn-base btn-accent font-bold" onClick={() => openQuote()}>
            Get Free Instant Quote <Icon name="arrow" className="h-4 w-4" />
          </button>
          <Link href="/services" className="btn-base btn-outline-light">
            Explore All Services
          </Link>
        </div>
        <dl className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              style={{ animationDelay: `${i * 90}ms` }}
              className="animate-in fade-in slide-in-from-bottom-4 rounded-2xl border border-white/15 bg-white/8 p-5 backdrop-blur duration-700"
            >
              <dt className="font-display text-2xl sm:text-3xl font-extrabold text-gold">{s.value}</dt>
              <dd className="mt-1 text-xs font-semibold uppercase tracking-wider text-white">
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
  return (
    <section className="section-y">
      <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionTitle
            eyebrow="About Diamond Integrated Facility Services"
            title="Comprehensive Facility Management Built Around Your Operations"
            subtitle="Headed by Director Umesh Patil, Diamond Integrated Facility Services LLP provides full-spectrum facility management including 24/7 Security Guarding, Housekeeping, Property Management, Pest Control, Manpower Supply, Tank Cleaning, CCTV and Technical Civil Maintenance."
          />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              "Specialized Service Divisions",
              "Police-Verified Trained Workforce",
              "100% Statutory ESIC & PF Compliance",
              "Flexible Service Contract Packages",
              "Dedicated Operations Site Supervisors",
              "24/7 Control Room & Rapid Response",
            ].map((item) => (
              <li key={item} className="flex gap-2 text-sm font-medium text-navy-700">
                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={3} />
                {item}
              </li>
            ))}
          </ul>
          <Link href="/about" className="btn-base btn-navy mt-8 text-xs font-bold">
            Learn More About Our Team <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
        <div className="relative">
          <img
            src="/images/facility.jpg"
            alt="Integrated facility management team supporting a corporate property in Pune"
            loading="lazy"
            className="h-80 w-full rounded-3xl object-cover shadow-lift sm:h-[26rem]"
          />
          <div className="bg-navy absolute -bottom-6 left-4 right-4 rounded-2xl p-5 text-white shadow-lift sm:left-8 sm:right-8 border border-gold/40">
            <p className="text-xs uppercase tracking-widest text-gold font-extrabold">Corporate Highlights</p>
            <div className="mt-3 grid grid-cols-3 gap-3 text-center">
              {[
                ["Full Scope", "Service Lines"],
                ["Pune & PCMC", "Headquartered"],
                ["Umesh Patil", "Managing Director"],
              ].map(([v, l]) => (
                <div key={l}>
                  <p className="font-display text-sm sm:text-base font-extrabold text-gold">{v}</p>
                  <p className="text-xs font-medium text-white">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCats() {
      try {
        setLoading(true);
        const res = await fetch("/api/service-categories");
        const data = await res.json();
        if (Array.isArray(data)) {
          setCategories(data.filter((c) => c.status !== "Inactive"));
        }
      } catch (e) {
        console.error("Failed to load categories on homepage:", e);
      } finally {
        setLoading(false);
      }
    }
    loadCats();
  }, []);

  return (
    <SiteLayout>
      <Hero />
      <AboutBlock />

      <section className="section-y bg-mist">
        <div className="container-x">
          <SectionTitle
            eyebrow="Core Service Lines"
            title="Integrated Facility Services Delivered End to End"
            subtitle="From security guarding and housekeeping to tank sanitation, electrical upkeep and waterproofing — single partner accountability."
            center
          />
          
          {loading ? (
            <div className="py-16 text-center">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent inline-block" />
              <p className="mt-2 text-xs font-semibold text-navy">Loading services…</p>
            </div>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categories.slice(0, 8).map((cat) => (
                <ServiceCard
                  key={cat._id || cat.slug}
                  service={{
                    id: cat._id,
                    slug: cat.slug,
                    name: cat.name,
                    short: cat.shortDescription,
                    icon: cat.icon || "layers",
                    image: cat.image || "/images/hero.jpg",
                    features: cat.features || [],
                    startingPrice: cat.startingPrice || 0,
                    priceNote: cat.priceNote || "per contract",
                    cta: "Get Free Quote",
                  }}
                />
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link href="/services" className="btn-base btn-navy text-xs font-bold px-6 py-3">
              Explore All Services <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x">
          <SectionTitle
            eyebrow="Target Sectors"
            title="Industries We Support Across Maharashtra"
            subtitle="Facility management programs customized to the distinct operational realities of each campus."
            center
          />
          <div className="mt-12">
            <IndustriesGrid limit={5} />
          </div>
          <div className="mt-8 text-center">
            <Link href="/industries" className="btn-base btn-ghost-navy text-xs font-bold">
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
            <SectionTitle eyebrow="Head Office" title="Connect With Our Pune Management Team" />
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

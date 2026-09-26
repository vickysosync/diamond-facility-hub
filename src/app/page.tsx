"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteLayout, { useQuote } from "@/components/site/SiteLayout";
import Icon from "@/components/ui/Icon";
import InView from "@/components/ui/InView";
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

import HeroSlider from "@/components/site/HeroSlider";

function AboutBlock() {
  return (
    <section className="section-y relative overflow-hidden bg-gradient-to-b from-transparent via-slate-50/50 to-transparent">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left Column: 3D Animated Information */}
        <InView direction="up">
          <div>
            {/* 3D Eyebrow Pill */}
            <div className="inline-flex items-start sm:items-center gap-2 max-w-full rounded-xl sm:rounded-full border border-gold/40 bg-gold/10 px-3 py-1 sm:px-3.5 sm:py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wide sm:tracking-[0.16em] text-gold shadow-xs backdrop-blur-xs">
              <span className="h-2 w-2 rounded-full bg-gold animate-pulse shadow-[0_0_6px_rgba(217,155,56,0.8)] shrink-0 mt-0.5 sm:mt-0" />
              <span className="break-words">About Diamond Integrated Facility Services</span>
            </div>

            <h2 className="mt-4 font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy tracking-tight leading-tight">
              Comprehensive Facility Management{" "}
              <span className="bg-gradient-to-r from-gold via-brand-accent to-gold-dark bg-clip-text text-transparent">
                Built Around Your Operations
              </span>
            </h2>

            <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground font-normal">
              Headed by Director Umesh Patil, Diamond Integrated Facility Services LLP provides full-spectrum facility management including 24/7 Security Guarding, Housekeeping, Property Management, Pest Control, Manpower Supply, Tank Cleaning, CCTV and Technical Civil Maintenance across Pune & PCMC.
            </p>

            {/* 6 Interactive 3D Frosted Micro-Cards */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "Specialized Service Divisions",
                "Police-Verified Trained Workforce",
                "100% Statutory ESIC & PF Compliance",
                "Flexible Service Contract Packages",
                "Dedicated Operations Site Supervisors",
                "24/7 Control Room & Rapid Response",
              ].map((item, idx) => (
                <div
                  key={item}
                  className="group relative flex items-center gap-3 rounded-xl border border-slate-200/90 bg-white/90 p-3.5 shadow-xs backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:bg-white hover:shadow-[0_10px_20px_-5px_rgba(15,24,36,0.12)]"
                >
                  {/* 3D Indicator Icon */}
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 group-hover:bg-gold/15 group-hover:text-gold group-hover:border-gold/40 group-hover:scale-110 transition-all duration-300">
                    <Icon name="check" className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-navy group-hover:text-navy-800 transition-colors">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* 3D Live Animated CTA Button */}
            <div className="mt-8">
              <Link
                href="/about"
                className="btn-base btn-live-navy text-xs sm:text-sm font-bold px-6 py-3.5 inline-flex items-center justify-center gap-2 group rounded-xl shadow-md w-full sm:w-auto"
              >
                {/* Specular live shimmer sweep */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none animate-[shimmer-sweep_4s_infinite]" />

                <span className="relative z-10">Learn More About Our Team</span>
                <Icon
                  name="arrow"
                  className="relative z-10 h-4 w-4 text-gold transition-transform duration-300 group-hover:translate-x-1.5"
                />
              </Link>
            </div>
          </div>
        </InView>

        {/* Right Column: 3D Floating Image & Glass Highlights Card */}
        <InView direction="up" delay={150}>
          <div className="relative group pb-4 sm:pb-6 lg:pb-0">
            {/* Main 3D Framed Image */}
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-gold/30 bg-navy shadow-[0_25px_50px_-12px_rgba(15,24,36,0.3)] transition-all duration-500 group-hover:border-gold/60 group-hover:shadow-[0_30px_60px_-15px_rgba(217,155,56,0.35)]">
              <img
                src="/images/facility.jpg"
                alt="Integrated facility management team supporting a corporate property in Pune"
                loading="lazy"
                className="h-72 w-full object-cover sm:h-96 md:h-[26rem] lg:h-[28rem] transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />

              {/* Top-Right 3D Floating Verified Badge */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 rounded-full border border-gold/50 bg-[#0a1019]/85 px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-[9.5px] sm:text-[11px] font-bold uppercase tracking-wide sm:tracking-wider text-gold shadow-lg backdrop-blur-md flex items-center gap-1.5 sm:gap-2">
                <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
                <span>Verified & Compliant</span>
              </div>
            </div>

            {/* 3D Floating Glassmorphic Corporate Highlights Card (Responsive: Relative overlap on mobile, Absolute on desktop) */}
            <div className="relative -mt-12 mx-2.5 sm:mx-6 lg:absolute lg:-bottom-6 lg:left-6 lg:right-6 lg:mx-0 lg:mt-0 z-10 rounded-2xl border border-gold/50 bg-[#0a1019]/95 p-3.5 sm:p-5 text-white shadow-[0_20px_45px_rgba(0,0,0,0.55)] backdrop-blur-xl transition-all duration-300 hover:border-gold hover:-translate-y-1 before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-gold before:to-transparent">
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-gold font-extrabold text-center sm:text-left">Corporate Highlights</p>
              <div className="mt-2.5 sm:mt-3 grid grid-cols-3 gap-1 sm:gap-3 text-center divide-x divide-white/10">
                {[
                  ["Full Scope", "Service Lines"],
                  ["Pune & PCMC", "Headquartered"],
                  ["Umesh Patil", "Managing Director"],
                ].map(([v, l]) => (
                  <div key={l} className="px-1">
                    <p className="font-display text-xs sm:text-sm md:text-base font-extrabold text-gold tracking-tight">{v}</p>
                    <p className="text-[9px] sm:text-xs font-medium text-slate-300 mt-0.5 leading-tight">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </InView>
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
      <HeroSlider />
      <AboutBlock />

      {/* Core Services Section with InView 3D Fading */}
      <section className="section-y bg-mist relative overflow-hidden">
        <div className="container-x">
          <InView direction="up">
            <SectionTitle
              eyebrow="Core Service Lines"
              title="Integrated Facility Services Delivered End to End"
              subtitle="From security guarding and housekeeping to tank sanitation, electrical upkeep and waterproofing — single partner accountability."
              center
            />
          </InView>
          
          {loading ? (
            <div className="py-16 text-center">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent inline-block" />
              <p className="mt-2 text-xs font-semibold text-navy">Loading services…</p>
            </div>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categories.slice(0, 8).map((cat, idx) => (
                <InView key={cat._id || cat.slug} direction="up" delay={(idx % 4) * 100}>
                  <ServiceCard
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
                </InView>
              ))}
            </div>
          )}

          <InView direction="up" delay={200}>
            <div className="mt-10 text-center">
              <Link
                href="/services"
                className="btn-base btn-live-navy text-xs sm:text-sm font-bold px-7 py-3.5 inline-flex items-center gap-2 rounded-xl shadow-md group"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none animate-[shimmer-sweep_4s_infinite]" />
                <span className="relative z-10">Explore All Services</span>
                <Icon name="arrow" className="relative z-10 h-4 w-4 text-gold transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </InView>
        </div>
      </section>

      {/* Target Sectors Section with InView 3D Fading */}
      <section className="section-y relative overflow-hidden">
        <div className="container-x">
          <InView direction="up">
            <SectionTitle
              eyebrow="Target Sectors"
              title="Industries We Support Across Maharashtra"
              subtitle="Facility management programs customized to the distinct operational realities of each campus."
              center
            />
          </InView>

          <InView direction="up" delay={100}>
            <div className="mt-12">
              <IndustriesGrid limit={5} />
            </div>
          </InView>

          <InView direction="up" delay={200}>
            <div className="mt-8 text-center">
              <Link
                href="/industries"
                className="btn-base btn-live-navy text-xs sm:text-sm font-bold px-6 py-3 inline-flex items-center gap-2 rounded-xl shadow-md group"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none animate-[shimmer-sweep_4s_infinite]" />
                <span className="relative z-10">View All Industries</span>
                <Icon name="arrow" className="relative z-10 h-4 w-4 text-gold transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </InView>
        </div>
      </section>

      {/* Why Choose Us */}
      <InView direction="up">
        <WhyChooseUs />
      </InView>

      {/* How It Works */}
      <InView direction="up">
        <HowItWorks />
      </InView>

      {/* Verified Client Reviews */}
      <InView direction="up">
        <Testimonials />
      </InView>

      {/* CTA Banner */}
      <InView direction="up">
        <CTABanner />
      </InView>

      {/* Head Office & Direct Contact Form */}
      <section className="section-y relative overflow-hidden">
        <div className="container-x grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <InView direction="up">
            <div>
              <SectionTitle eyebrow="Head Office" title="Connect With Our Pune Management Team" />
              <div className="mt-8">
                <ContactDetails />
              </div>
            </div>
          </InView>

          <InView direction="up" delay={150}>
            <ContactForm />
          </InView>
        </div>
      </section>
    </SiteLayout>
  );
}

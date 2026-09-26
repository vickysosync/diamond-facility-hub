"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { useQuote } from "@/components/site/SiteLayout";

export interface HeroSlideData {
  id: string;
  badge: string;
  title: string;
  highlightedTitle: string;
  description: string;
  image: string;
  serviceCategory?: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
}

export const heroSlides: HeroSlideData[] = [
  {
    id: "security",
    badge: "24/7 Manned Security • Police-Verified • 100% Compliant",
    title: "Complete Facility Services.",
    highlightedTitle: "One Trusted Partner.",
    description:
      "Official provider of Security Guarding, Housekeeping, Property Management, Pest Eradication, Tank Sanitization, Manpower, CCTV and Technical Civil Upkeep across Pune & PCMC.",
    image: "/images/hero/slide-security.png",
    serviceCategory: "Security Guard Services",
    primaryCtaText: "Get Free Instant Quote",
    secondaryCtaText: "Explore All Services",
    secondaryCtaLink: "/services",
  },
  {
    id: "housekeeping",
    badge: "Mechanized Housekeeping • Hygiene Standards • Eco-Safe",
    title: "Impeccable Facility Cleanliness.",
    highlightedTitle: "Zero Compromise.",
    description:
      "Supervisor-monitored corporate housekeeping, daily office cleaning, mechanized floor scrubbing, and hospital-grade deep sanitization for IT parks and societies.",
    image: "/images/hero/slide-housekeeping.png",
    serviceCategory: "Housekeeping Services",
    primaryCtaText: "Book Housekeeping Audit",
    secondaryCtaText: "View Housekeeping Scope",
    secondaryCtaLink: "/services/housekeeping-services",
  },
  {
    id: "facility-mgmt",
    badge: "Single Accountable Partner • B2B & Institutional • SLA-Backed",
    title: "Seamless Property Operations.",
    highlightedTitle: "Built Around Your Campus.",
    description:
      "End-to-end facility operations, multi-vendor coordination, residential society administration, and routine technical condition reporting.",
    image: "/images/hero/slide-facility.png",
    serviceCategory: "Facility Management Solutions",
    primaryCtaText: "Request Facility Proposal",
    secondaryCtaText: "Explore Property Scope",
    secondaryCtaLink: "/services/property-management",
  },
  {
    id: "tank-cleaning",
    badge: "High-Pressure De-Silting • Antibacterial Sanitization",
    title: "Certified Water Tank Cleaning.",
    highlightedTitle: "Pure Hygiene & Green Care.",
    description:
      "6-stage mechanized cleaning for overhead and underground water storage tanks, accompanied by structured garden upkeep and landscape preservation.",
    image: "/images/hero/slide-tank.png",
    serviceCategory: "Tank Cleaning, Gardening and Landscaping etc.",
    primaryCtaText: "Schedule Tank Cleaning",
    secondaryCtaText: "See Sanitization Process",
    secondaryCtaLink: "/services/tank-cleaning-gardening-landscaping",
  },
  {
    id: "cctv-technical",
    badge: "HD/IP Surveillance • 24/7 Control Room • Licensed Technicians",
    title: "Advanced CCTV & Civil Upkeep.",
    highlightedTitle: "Always Protected.",
    description:
      "Turnkey HD surveillance installation, round-the-clock control room monitoring, certified electrical, plumbing, painting, and terrace waterproofing.",
    image: "/images/hero/slide-cctv.png",
    serviceCategory: "CCTV Installation and Maintenance",
    primaryCtaText: "Get Technical Estimate",
    secondaryCtaText: "View Technical Services",
    secondaryCtaLink: "/services/cctv-installation-maintenance",
  },
];

const stats = [
  { value: "11", label: "Core Service Divisions" },
  { value: "500+", label: "Verified Workforce" },
  { value: "24/7", label: "Control Room Response" },
  { value: "100%", label: "Statutory ESIC & PF Compliance" },
];

const SLIDE_DURATION = 6000; // 6 seconds per slide

export default function HeroSlider() {
  const { openQuote } = useQuote();
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % heroSlides.length);
    setProgress(0);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setProgress(0);
  }, []);

  const goToSlide = (index: number) => {
    if (index === current) return;
    setCurrent(index);
    setProgress(0);
  };

  // Continuous Progress Bar Timer & Auto-Switch
  useEffect(() => {
    if (isPaused) return;

    const intervalTime = 50; // Smooth 60fps progress update
    const step = (intervalTime / SLIDE_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((old) => {
        if (old >= 100) {
          nextSlide();
          return 0;
        }
        return old + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    setTouchStart(null);
    setIsPaused(false);
  };

  const activeSlide = heroSlides[current];

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative isolate min-h-[580px] sm:min-h-[640px] lg:min-h-[720px] xl:min-h-[760px] overflow-hidden bg-[#0a1019] select-none"
    >
      {/* Top Gold Continuous Progress Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 h-1 bg-white/10 backdrop-blur-xs">
        <div
          className="h-full bg-gradient-to-r from-gold-light via-gold to-brand-accent shadow-[0_0_12px_rgba(217,155,56,0.8)] transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Layer 0: Multi-Slide Backgrounds with Ken Burns Slow Zoom & Crossfade */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {heroSlides.map((slide, idx) => {
          const isActive = idx === current;
          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className={`h-full w-full object-cover object-[center_20%] sm:object-center transition-transform duration-[6500ms] ease-out ${
                  isActive ? "scale-105 sm:scale-106" : "scale-100"
                }`}
                loading={idx === 0 ? "eager" : "lazy"}
              />

              {/* Ambient Glow behind subject */}
              <div className="absolute top-1/4 right-1/4 h-96 w-96 rounded-full bg-gold/10 blur-3xl pointer-events-none transition-opacity duration-1000" />
            </div>
          );
        })}
      </div>

      {/* Layer 1: Adaptive Gradients (Top clear on mobile, dark on text side) */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-[#0a1019] via-[#0a1019]/70 via-55% to-transparent sm:bg-gradient-to-r sm:from-[#0a1019] sm:via-[#0f1824]/85 sm:to-transparent" />
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-[#0a1019]/40 via-transparent to-transparent sm:from-[#0a1019]/20" />
      <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,rgba(217,155,56,0.15),transparent_60%)]" />

      {/* Layer 2: Foreground Content */}
      <div className="container-x relative z-20 flex flex-col justify-between pt-14 pb-8 sm:pt-20 sm:pb-12 lg:pt-28 lg:pb-16 min-h-[580px] sm:min-h-[640px] lg:min-h-[720px] xl:min-h-[760px]">
        {/* Main Content Area */}
        <div className="max-w-3xl pt-2 sm:pt-0">
          {/* Glass Pill Badge */}
          <div
            key={`badge-${current}`}
            className="animate-in fade-in slide-in-from-bottom-3 duration-500 inline-flex items-start sm:items-center gap-2 max-w-full rounded-xl sm:rounded-full border border-gold/50 bg-navy/80 px-3 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wide sm:tracking-[0.16em] text-amber-300 shadow-[0_4px_20px_rgba(217,155,56,0.25)] backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2 shrink-0 mt-1 sm:mt-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
            </span>
            <span className="break-words leading-relaxed sm:leading-normal">{activeSlide.badge}</span>
          </div>

          {/* Animated Headline */}
          <h1
            key={`title-${current}`}
            className="animate-in fade-in slide-in-from-bottom-4 duration-600 mt-3 sm:mt-5 font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.16] sm:leading-[1.12] text-white tracking-tight drop-shadow-[0_2px_18px_rgba(0,0,0,0.8)]"
          >
            {activeSlide.title}{" "}
            <span className="bg-gradient-to-r from-gold-light via-gold to-brand-accent bg-clip-text text-transparent drop-shadow-sm">
              {activeSlide.highlightedTitle}
            </span>
          </h1>

          {/* Animated Description */}
          <p
            key={`desc-${current}`}
            className="animate-in fade-in slide-in-from-bottom-5 duration-700 mt-2.5 sm:mt-5 max-w-2xl text-xs sm:text-base lg:text-lg leading-relaxed text-slate-100 font-normal drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)] line-clamp-3 sm:line-clamp-none"
          >
            {activeSlide.description}
          </p>

          {/* Action Buttons with Live Animations & Glowing Effects */}
          <div
            key={`btns-${current}`}
            className="animate-in fade-in slide-in-from-bottom-6 duration-700 mt-5 sm:mt-8 flex flex-wrap items-center gap-2.5 sm:gap-3.5"
          >
            <button
              onClick={() =>
                openQuote(
                  activeSlide.serviceCategory
                    ? { services: [activeSlide.serviceCategory] }
                    : undefined
                )
              }
              className="btn-base btn-live-gold font-bold text-xs sm:text-sm px-4.5 py-2.5 sm:px-6 sm:py-3.5 flex items-center gap-2 group rounded-xl shadow-lg"
            >
              {/* Continuous live specular shimmer ray sweep */}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none animate-[shimmer-sweep_3.5s_infinite]" />

              <span className="relative z-10 drop-shadow-sm">{activeSlide.primaryCtaText}</span>
              <Icon
                name="arrow"
                className="relative z-10 h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-1.5"
              />
            </button>

            <Link
              href={activeSlide.secondaryCtaLink}
              className="btn-base btn-live-glass text-xs sm:text-sm px-4 py-2.5 sm:px-5 sm:py-3.5 font-semibold rounded-xl group flex items-center gap-2 shadow-md"
            >
              <span className="relative z-10">{activeSlide.secondaryCtaText}</span>
            </Link>
          </div>
        </div>

        {/* Bottom Section: Stat Metric Cards & Interactive Controls */}
        <div className="mt-8 sm:mt-12 lg:mt-16 space-y-4 sm:space-y-6">
          {/* Interactive Carousel Navigation Bar */}
          <div className="flex items-center justify-between gap-4 pt-3 sm:pt-4 border-t border-white/10">
            {/* Pill Pagination Indicators */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {heroSlides.map((slide, index) => {
                const isActive = index === current;
                return (
                  <button
                    key={slide.id}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}: ${slide.title}`}
                    className={`h-2 sm:h-2.5 rounded-full transition-all duration-500 ease-out cursor-pointer ${
                      isActive
                        ? "w-8 sm:w-10 bg-gradient-to-r from-gold-light via-gold to-brand-accent shadow-[0_0_12px_rgba(217,155,56,0.7)]"
                        : "w-2 sm:w-2.5 bg-white/30 hover:bg-white/60 hover:w-4"
                    }`}
                  />
                );
              })}
            </div>

            {/* Next / Previous Frosted Glass Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={prevSlide}
                aria-label="Previous slide"
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/10 hover:bg-gold/20 border border-white/20 hover:border-gold/60 text-white hover:text-gold flex items-center justify-center backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 shadow-md"
              >
                <svg
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                aria-label="Next slide"
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/10 hover:bg-gold/20 border border-white/20 hover:border-gold/60 text-white hover:text-gold flex items-center justify-center backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 shadow-md"
              >
                <svg
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* 4 Stat Metric Cards with Live Gold Top Line & Hover Sheen (2x2 on mobile, 4-col on desktop) */}
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            {stats.map((s, i) => (
              <div
                key={s.label}
                style={{ animationDelay: `${i * 80}ms` }}
                className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/15 bg-white/[0.07] p-3 sm:p-5 backdrop-blur-md duration-300 transition-all hover:border-gold/60 hover:bg-white/[0.12] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.55)] before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-gold/40 before:to-transparent hover:before:via-gold"
              >
                {/* Specular Highlight Sheen on Hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

                <dt className="font-display text-lg sm:text-2xl lg:text-3xl font-extrabold text-gold tracking-tight group-hover:text-gold-light group-hover:scale-105 transition-all duration-300">
                  {s.value}
                </dt>
                <dd className="mt-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-200 group-hover:text-white transition-colors duration-200 line-clamp-2">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

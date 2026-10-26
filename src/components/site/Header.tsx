"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import { useApp } from "@/store/AppStore";

interface NavItem {
  href: string;
  label: string;
  hasDropdown?: boolean;
  dropdownType?: "services" | "industries";
}

const nav: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services", hasDropdown: true, dropdownType: "services" },
  { href: "/industries", label: "Industries", hasDropdown: true, dropdownType: "industries" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact Us" },
];

const fallbackServices = [
  {
    name: "Security Guard Services",
    slug: "security-guard-services",
    icon: "shield",
    desc: "24/7 static guarding, bouncers & entry monitoring",
  },
  {
    name: "Housekeeping Services",
    slug: "housekeeping-services",
    icon: "sparkles",
    desc: "Daily corporate & residential mechanized cleaning",
  },
  {
    name: "Property Management",
    slug: "property-management",
    icon: "building",
    desc: "End-to-end society administration & vendor ops",
  },
  {
    name: "Pest Control Services",
    slug: "pest-control-services",
    icon: "bug",
    desc: "Eco-certified pest eradication & termite treatments",
  },
  {
    name: "Bouncer Services",
    slug: "bouncer-services",
    icon: "users",
    desc: "VIP escorts, venue security & crowd management",
  },
  {
    name: "Man Power Supply",
    slug: "man-power-supply",
    icon: "briefcase",
    desc: "Skilled & semi-skilled staff with ESIC/PF",
  },
  {
    name: "Tank Cleaning & Gardening",
    slug: "tank-cleaning-gardening-landscaping",
    icon: "droplet",
    desc: "UV tank sanitization, lawn mowing & landscaping",
  },
  {
    name: "Facility Management",
    slug: "facility-management-solutions",
    icon: "layers",
    desc: "Turnkey integrated multi-service contracts",
  },
  {
    name: "CCTV Installation & AMC",
    slug: "cctv-installation-maintenance",
    icon: "video",
    desc: "HD/IP surveillance cameras, NVR & AMC upkeep",
  },
  {
    name: "Plumbing, Electrical, Painting",
    slug: "plumbing-electrical-painting-waterproofing",
    icon: "roller",
    desc: "Civil repairs, wiring, painting & waterproofing",
  },
  {
    name: "Repair & Maintenance",
    slug: "repair-maintenance-services",
    icon: "gear",
    desc: "Routine & on-call structural upkeep across campuses",
  },
  {
    name: "Healthcare Facility Services",
    slug: "healthcare-facility-services",
    icon: "heart",
    desc: "Hospital sanitization, sterile zones & biomedical waste",
  },
  {
    name: "Educational Campus Services",
    slug: "educational-campus-facility-services",
    icon: "school",
    desc: "Student safety guarding, school & campus grounds upkeep",
  },
  {
    name: "IT & ITES Facility Solutions",
    slug: "it-ites-facility-solutions",
    icon: "building",
    desc: "24/7 tech park shifts, server care & access control",
  },
];

const fallbackIndustries = [
  {
    name: "Corporate Offices",
    slug: "corporate-offices",
    icon: "building",
    desc: "Turnstiles, access logs & mechanized cleaning",
  },
  {
    name: "Residential Societies",
    slug: "residential-societies",
    icon: "home",
    desc: "Gatekeeper logs, tank sanitization & society care",
  },
  {
    name: "Commercial Buildings",
    slug: "commercial-buildings",
    icon: "store",
    desc: "Multi-tenant coordination, HVAC & parking discipline",
  },
  {
    name: "Industrial Facilities",
    slug: "industrial-facilities",
    icon: "factory",
    desc: "Perimeter guarding, heavy scrubbing & safety drills",
  },
  {
    name: "Warehouses & Logistics",
    slug: "warehouses",
    icon: "box",
    desc: "24/7 security, rodent control & perimeter audits",
  },
  {
    name: "Schools & Institutions",
    slug: "schools-institutions",
    icon: "school",
    desc: "Safe campus security & hygiene sanitization cycles",
  },
  {
    name: "Hospitals & Healthcare",
    slug: "hospitals-healthcare",
    icon: "cross",
    desc: "Disinfectant protocols, queue control & biomedical care",
  },
  {
    name: "Retail Spaces & Malls",
    slug: "retail-spaces",
    icon: "cart",
    desc: "Customer-facing guards & after-hours cleaning",
  },
  {
    name: "Hospitality & Hotels",
    slug: "hospitality",
    icon: "bed",
    desc: "Guest-area presentation, pest cover & water hygiene",
  },
  {
    name: "Construction Sites",
    slug: "construction-sites",
    icon: "cone",
    desc: "Perimeter guarding & post-handover civil upkeep",
  },
];

export interface HeaderProps {
  onQuote: () => void;
}

export default function Header({ onQuote }: HeaderProps) {
  const { company } = useApp();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<"services" | "industries" | null>(null);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileIndustriesOpen, setMobileIndustriesOpen] = useState(false);

  const [categoriesList, setCategoriesList] = useState<any[]>(fallbackServices);
  const [industriesList, setIndustriesList] = useState<any[]>(fallbackIndustries);

  const desktopNavRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (desktopNavRef.current && !desktopNavRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setOpenDropdown(null);
    setOpen(false);
  }, [pathname]);

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fetch dynamic categories and industries from API
  useEffect(() => {
    async function loadDynamic() {
      try {
        const [resCat, resInd] = await Promise.all([
          fetch("/api/service-categories").then((r) => r.json()).catch(() => []),
          fetch("/api/industries").then((r) => r.json()).catch(() => []),
        ]);
        if (Array.isArray(resCat) && resCat.length > 0) {
          const active = resCat.filter((c: any) => c.status !== "Inactive");
          if (active.length > 0) {
            setCategoriesList(
              active.map((c: any) => ({
                name: c.name,
                slug: c.slug,
                icon: c.icon || "shield",
                desc: c.shortDescription || c.description || "Specialized facility management division",
              }))
            );
          }
        }
        if (Array.isArray(resInd) && resInd.length > 0) {
          const active = resInd.filter((i: any) => i.status !== "Inactive");
          if (active.length > 0) {
            setIndustriesList(
              active.map((i: any) => ({
                name: i.name,
                slug: i.slug || i.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                icon: i.icon || "building",
                desc: i.description || "Site-specific facility operations & trained workforce",
              }))
            );
          }
        }
      } catch (err) {
        // Fallbacks already in place
      }
    }
    loadDynamic();
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-gold/60 before:to-transparent ${
        scrolled
          ? "border-b border-black/[0.08] dark:border-white/10 bg-white/90 dark:bg-[#0a1019]/95 py-2.5 shadow-[0_15px_35px_-10px_rgba(15,24,36,0.16)] backdrop-blur-xl"
          : "border-b border-black/[0.04] dark:border-white/5 bg-white/80 dark:bg-[#0a1019]/85 py-3.5 shadow-sm backdrop-blur-lg"
      }`}
    >
      <div className="container-x flex items-center justify-between gap-4">
        {/* Diamond Logo with 3D Hover Scale */}
        <Link
          href="/"
          className="group relative flex min-w-0 items-center gap-3 py-1 transition-transform duration-300 hover:scale-[1.025]"
          onClick={() => {
            setOpen(false);
            setOpenDropdown(null);
          }}
        >
          <img
            src="/images/logo.png"
            alt="Diamond Security Services & Integrated Facility Solutions"
            className="h-11 sm:h-12 w-auto max-w-[230px] sm:max-w-[290px] object-contain drop-shadow-xs group-hover:brightness-105 transition-all duration-300"
          />
        </Link>

        {/* Desktop Navigation & Actions */}
        <div className="flex items-center gap-3.5">
          {/* Floating 3D Capsule Nav Island Wrapper */}
          <div className="relative hidden xl:block" ref={desktopNavRef}>
            <nav
              className="flex items-center gap-1 rounded-full border border-slate-200/90 dark:border-white/15 bg-slate-100/90 dark:bg-white/[0.08] p-1 shadow-inner backdrop-blur-md"
              aria-label="Main navigation"
            >
              {nav.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                if (item.hasDropdown) {
                  const isDropdownOpen = openDropdown === item.dropdownType;
                  return (
                    <button
                      key={item.href}
                      type="button"
                      onClick={() =>
                        setOpenDropdown((prev) =>
                          prev === item.dropdownType ? null : item.dropdownType!
                        )
                      }
                      aria-expanded={isDropdownOpen}
                      className={`relative flex items-center gap-1.5 rounded-full px-3 2xl:px-4 py-1.5 text-xs 2xl:text-sm font-bold transition-all duration-300 cursor-pointer ${
                        isActive || isDropdownOpen
                          ? "border border-gold/40 bg-white dark:bg-[#0f1824] text-gold font-extrabold shadow-[0_3px_14px_rgba(217,155,56,0.25)] -translate-y-0.5 scale-100"
                          : "text-slate-800 dark:text-white hover:bg-white/70 dark:hover:bg-white/15 hover:text-gold hover:-translate-y-0.5 hover:shadow-xs"
                      }`}
                    >
                      {(isActive || isDropdownOpen) && (
                        <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse shadow-[0_0_6px_rgba(217,155,56,0.8)]" />
                      )}
                      <span>{item.label}</span>
                      <Icon
                        name="chevron"
                        className={`h-3.5 w-3.5 transition-transform duration-300 ${
                          isDropdownOpen ? "rotate-180 text-gold" : "opacity-60"
                        }`}
                      />
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpenDropdown(null)}
                    className={`relative flex items-center gap-1.5 rounded-full px-3 2xl:px-4 py-1.5 text-xs 2xl:text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? "border border-gold/40 bg-white dark:bg-[#0f1824] text-gold font-extrabold shadow-[0_3px_14px_rgba(217,155,56,0.25)] -translate-y-0.5 scale-100"
                        : "text-slate-800 dark:text-white hover:bg-white/70 dark:hover:bg-white/15 hover:text-gold hover:-translate-y-0.5 hover:shadow-xs"
                    }`}
                  >
                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse shadow-[0_0_6px_rgba(217,155,56,0.8)]" />
                    )}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Mega Dropdown Popover */}
            {openDropdown && (
              <div
                className="absolute top-full mt-3.5 left-1/2 -translate-x-1/2 w-[640px] max-w-[calc(100vw-2rem)] rounded-2xl border border-gold/30 bg-white/98 dark:bg-[#0c131f]/98 shadow-[0_25px_60px_-12px_rgba(15,24,36,0.35)] backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-gold/70 before:to-transparent"
                role="menu"
              >
                {openDropdown === "services" && (
                  <div>
                    {/* Header bar */}
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 px-5 py-3.5 bg-slate-50/70 dark:bg-white/[0.03]">
                      <div className="flex items-center gap-2">
                        <span className="grid h-6 w-6 place-items-center rounded-md bg-gold/15 text-gold border border-gold/30">
                          <Icon name="layers" className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-navy dark:text-white">
                          Service Divisions
                        </span>
                        <span className="rounded-full bg-gold/15 border border-gold/30 px-2 py-0.5 text-[10px] font-mono font-bold text-gold">
                          {categoriesList.length} Divisions
                        </span>
                      </div>
                      <Link
                        href="/services"
                        onClick={() => setOpenDropdown(null)}
                        className="group inline-flex items-center gap-1.5 text-xs font-bold text-gold hover:text-gold-light transition-colors"
                      >
                        <span>View All Services</span>
                        <Icon
                          name="arrow"
                          className="h-3 w-3 transition-transform group-hover:translate-x-1"
                        />
                      </Link>
                    </div>

                    {/* 2-Column Grid */}
                    <div className="grid grid-cols-2 gap-1.5 p-3.5 max-h-[380px] overflow-y-auto">
                      {categoriesList.map((srv) => (
                        <Link
                          key={srv.slug}
                          href={`/services/${srv.slug}`}
                          onClick={() => setOpenDropdown(null)}
                          className="group flex items-start gap-2.5 rounded-xl p-2.5 transition-all duration-200 hover:bg-slate-100/80 dark:hover:bg-white/10 hover:border-gold/30 border border-transparent hover:shadow-xs"
                        >
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gold/15 text-gold border border-gold/30 group-hover:bg-gold group-hover:text-navy group-hover:scale-105 transition-all">
                            <Icon name={srv.icon || "shield"} className="h-4 w-4" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-navy dark:text-slate-100 group-hover:text-gold transition-colors truncate">
                              {srv.name}
                            </p>
                            <p className="text-[10.5px] text-muted-foreground line-clamp-1 leading-tight mt-0.5">
                              {srv.desc}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Bottom CTA Footer */}
                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/10 px-5 py-3 bg-slate-50/70 dark:bg-white/[0.03] text-xs">
                      <span className="text-muted-foreground text-[11px]">
                        Need customized multi-service facility management?
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenDropdown(null);
                          onQuote();
                        }}
                        className="btn-base btn-live-gold px-3 py-1.5 text-[11px] font-bold rounded-lg shadow-sm"
                      >
                        Get Free Quote →
                      </button>
                    </div>
                  </div>
                )}

                {openDropdown === "industries" && (
                  <div>
                    {/* Header bar */}
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 px-5 py-3.5 bg-slate-50/70 dark:bg-white/[0.03]">
                      <div className="flex items-center gap-2">
                        <span className="grid h-6 w-6 place-items-center rounded-md bg-gold/15 text-gold border border-gold/30">
                          <Icon name="building" className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-navy dark:text-white">
                          Target Sectors
                        </span>
                        <span className="rounded-full bg-gold/15 border border-gold/30 px-2 py-0.5 text-[10px] font-mono font-bold text-gold">
                          {industriesList.length} Sectors
                        </span>
                      </div>
                      <Link
                        href="/industries"
                        onClick={() => setOpenDropdown(null)}
                        className="group inline-flex items-center gap-1.5 text-xs font-bold text-gold hover:text-gold-light transition-colors"
                      >
                        <span>View All Industries</span>
                        <Icon
                          name="arrow"
                          className="h-3 w-3 transition-transform group-hover:translate-x-1"
                        />
                      </Link>
                    </div>

                    {/* 2-Column Grid */}
                    <div className="grid grid-cols-2 gap-1.5 p-3.5 max-h-[380px] overflow-y-auto">
                      {industriesList.map((ind) => (
                        <Link
                          key={ind.slug}
                          href={`/industries#${ind.slug}`}
                          onClick={() => setOpenDropdown(null)}
                          className="group flex items-start gap-2.5 rounded-xl p-2.5 transition-all duration-200 hover:bg-slate-100/80 dark:hover:bg-white/10 hover:border-gold/30 border border-transparent hover:shadow-xs"
                        >
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gold/15 text-gold border border-gold/30 group-hover:bg-gold group-hover:text-navy group-hover:scale-105 transition-all">
                            <Icon name={ind.icon || "building"} className="h-4 w-4" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-navy dark:text-slate-100 group-hover:text-gold transition-colors truncate">
                              {ind.name}
                            </p>
                            <p className="text-[10.5px] text-muted-foreground line-clamp-1 leading-tight mt-0.5">
                              {ind.desc}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Bottom CTA Footer */}
                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/10 px-5 py-3 bg-slate-50/70 dark:bg-white/[0.03] text-xs">
                      <span className="text-muted-foreground text-[11px]">
                        Site-specific SOPs & verified statutory compliance PAN-India.
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenDropdown(null);
                          onQuote();
                        }}
                        className="btn-base btn-live-gold px-3 py-1.5 text-[11px] font-bold rounded-lg shadow-sm"
                      >
                        Book Site Audit →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>


          {/* 3D Live Animated Call CTA Button */}
          <a
            href="tel:+919689515295"
            title="Call Diamond Facility Services at +91 96895 15295"
            className="btn-base btn-live-gold hidden sm:inline-flex text-xs sm:text-sm px-4 2xl:px-5 py-2.5 rounded-full font-bold items-center gap-2 group shadow-md"
          >
            {/* Live Specular Shimmer Sweep */}
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none animate-[shimmer-sweep_3.5s_infinite]" />

            {/* Live glowing pulse dot */}
            <span className="relative z-10 h-2 w-2 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.95)]" />

            {/* Phone icon */}
            <Icon
              name="phone"
              className="relative z-10 h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
            />

            {/* Phone number */}
            <span className="relative z-10 tracking-tight font-bold drop-shadow-sm whitespace-nowrap">
              +91 96895 15295
            </span>
          </a>

          {/* Mobile 3D Hamburger Toggle Button */}
          <button
            className="rounded-xl border border-slate-200 dark:border-white/15 bg-slate-100/90 dark:bg-white/10 p-2.5 text-navy dark:text-white xl:hidden shadow-xs hover:border-gold/50 hover:text-gold hover:scale-105 active:scale-95 transition-all duration-200 backdrop-blur-md"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <Icon name={open ? "close" : "menu"} className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile 3D Frosted Glass Navigation Drawer */}
      {open && (
        <div className="border-t border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#0a1019]/98 shadow-[0_20px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl xl:hidden animate-in fade-in slide-in-from-top-3 duration-300 max-h-[calc(100vh-80px)] overflow-y-auto">
          <nav
            className="container-x flex flex-col py-4 gap-1.5"
            aria-label="Mobile navigation"
          >
            {nav.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              if (item.hasDropdown && item.dropdownType === "services") {
                return (
                  <div key={item.href} className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => setMobileServicesOpen((prev) => !prev)}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 ${
                        isActive || mobileServicesOpen
                          ? "border border-gold/40 bg-gold/10 text-gold font-extrabold shadow-xs"
                          : "text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 hover:text-gold"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {isActive && (
                          <span className="h-2 w-2 rounded-full bg-gold animate-pulse shadow-[0_0_6px_rgba(217,155,56,0.8)]" />
                        )}
                        <span>{item.label}</span>
                        <span className="rounded-full bg-gold/20 text-gold text-[10px] px-1.5 py-0.5 font-bold">
                          {categoriesList.length}
                        </span>
                      </span>
                      <Icon
                        name="chevron"
                        className={`h-4 w-4 transition-transform duration-200 ${
                          mobileServicesOpen ? "rotate-180 text-gold" : "opacity-60"
                        }`}
                      />
                    </button>

                    {mobileServicesOpen && (
                      <div className="mt-1 ml-3 border-l-2 border-gold/30 pl-2.5 py-1 flex flex-col gap-1 animate-in fade-in duration-200">
                        <Link
                          href="/services"
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-bold text-gold hover:bg-gold/10 transition-colors"
                        >
                          <span>Explore All Services Overview →</span>
                        </Link>
                        {categoriesList.map((srv) => (
                          <Link
                            key={srv.slug}
                            href={`/services/${srv.slug}`}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-gold transition-colors"
                          >
                            <span className="grid h-6 w-6 shrink-0 place-items-center rounded bg-gold/15 text-gold border border-gold/30">
                              <Icon name={srv.icon || "shield"} className="h-3.5 w-3.5" />
                            </span>
                            <span className="truncate">{srv.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              if (item.hasDropdown && item.dropdownType === "industries") {
                return (
                  <div key={item.href} className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => setMobileIndustriesOpen((prev) => !prev)}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 ${
                        isActive || mobileIndustriesOpen
                          ? "border border-gold/40 bg-gold/10 text-gold font-extrabold shadow-xs"
                          : "text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 hover:text-gold"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {isActive && (
                          <span className="h-2 w-2 rounded-full bg-gold animate-pulse shadow-[0_0_6px_rgba(217,155,56,0.8)]" />
                        )}
                        <span>{item.label}</span>
                        <span className="rounded-full bg-gold/20 text-gold text-[10px] px-1.5 py-0.5 font-bold">
                          {industriesList.length}
                        </span>
                      </span>
                      <Icon
                        name="chevron"
                        className={`h-4 w-4 transition-transform duration-200 ${
                          mobileIndustriesOpen ? "rotate-180 text-gold" : "opacity-60"
                        }`}
                      />
                    </button>

                    {mobileIndustriesOpen && (
                      <div className="mt-1 ml-3 border-l-2 border-gold/30 pl-2.5 py-1 flex flex-col gap-1 animate-in fade-in duration-200">
                        <Link
                          href="/industries"
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-bold text-gold hover:bg-gold/10 transition-colors"
                        >
                          <span>Explore All Industries Overview →</span>
                        </Link>
                        {industriesList.map((ind) => (
                          <Link
                            key={ind.slug}
                            href={`/industries#${ind.slug}`}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-gold transition-colors"
                          >
                            <span className="grid h-6 w-6 shrink-0 place-items-center rounded bg-gold/15 text-gold border border-gold/30">
                              <Icon name={ind.icon || "building"} className="h-3.5 w-3.5" />
                            </span>
                            <span className="truncate">{ind.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? "border border-gold/40 bg-gold/10 text-gold font-extrabold shadow-xs"
                      : "text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 hover:text-gold"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {isActive && (
                      <span className="h-2 w-2 rounded-full bg-gold animate-pulse shadow-[0_0_6px_rgba(217,155,56,0.8)]" />
                    )}
                    <span>{item.label}</span>
                  </span>
                  <Icon name="arrow" className="h-4 w-4 opacity-50" />
                </Link>
              );
            })}

            {/* Mobile 3D Live Call CTA Button */}
            <a
              href="tel:+919689515295"
              onClick={() => setOpen(false)}
              className="btn-base btn-live-gold mt-3 w-full py-3 rounded-full text-sm font-bold flex items-center justify-center gap-2.5 shadow-md"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none animate-[shimmer-sweep_3.5s_infinite]" />
              <span className="relative z-10 h-2 w-2 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.95)]" />
              <Icon name="phone" className="relative z-10 h-4 w-4" />
              <span className="relative z-10 font-bold tracking-tight">+91 96895 15295</span>
            </a>

          </nav>
        </div>
      )}
    </header>
  );
}

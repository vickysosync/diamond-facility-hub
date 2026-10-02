"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { useQuote } from "@/components/site/SiteLayout";

export default function Footer() {
  const [company, setCompany] = useState<any>(null);
  const { openQuote } = useQuote();

  useEffect(() => {
    async function loadCompany() {
      try {
        const res = await fetch("/api/company");
        const data = await res.json();
        if (data && !data.error) {
          setCompany(data);
        }
      } catch (e) {}
    }
    loadCompany();
  }, []);

  const linkedinUrl = company?.socialLinks?.linkedin || "https://www.linkedin.com";
  const instagramUrl = company?.socialLinks?.instagram || "https://www.instagram.com";
  const whatsappNumber = (company?.whatsapp || company?.primaryPhone || "919689515295").replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hello%20Diamond%20Facility%20Services%2C%20I%20have%20an%20inquiry.`;

  return (
    <footer className="relative overflow-hidden bg-navy text-white border-t border-gold/30 before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-gold/50 before:to-transparent before:z-10">
      {/* Ambient Lighting & Glows */}
      <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_15%_20%,rgba(217,155,56,0.3),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-15 [background:radial-gradient(circle_at_85%_80%,rgba(23,34,48,0.8),transparent_50%)] pointer-events-none" />

      <div className="container-x relative z-10 grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-12 text-xs">
        {/* Column 1: Brand & Credential Profile (lg:col-span-4) */}
        <div className="space-y-4 lg:col-span-4">
          <Link
            href="/"
            className="inline-flex items-center rounded-full bg-white px-4 py-2 sm:px-5 sm:py-2.5 shadow-xl border border-gold/40 transition-all duration-300 hover:scale-105 hover:border-gold hover:shadow-gold/30"
          >
            <img
              src="/images/logo.png"
              alt="Diamond Security Services & Integrated Facility Solutions"
              className="h-10 sm:h-11 w-auto max-w-[240px] object-contain"
            />
          </Link>

          <p className="text-slate-200 leading-relaxed text-xs sm:text-[13px] font-normal">
            <strong className="text-white font-semibold">Diamond Security Services & Integrated Facility Solutions:</strong> Delivering 24/7 Security Guarding, Housekeeping, Property Management, Pest Control, Manpower Supply, Tank Sanitization, CCTV and Technical Civil Upkeep Pan-India.
          </p>

          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-navy-800/80 px-3.5 py-1.5 text-[11px] font-mono text-slate-200 shadow-sm backdrop-blur-xs">
            <span className="h-2 w-2 rounded-full bg-gold animate-pulse shadow-[0_0_6px_rgba(217,155,56,0.8)]" />
            <span><strong className="text-amber-300 font-bold">Director:</strong> {company?.directorName || company?.director || "Umesh Patil"} • LLPIN Registered</span>
          </div>

          {/* Social Media 3D Action Buttons */}
          <div className="pt-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-300 mb-2.5">
              Connect With Operations
            </p>
            <div className="flex items-center gap-2.5">
              {/* LinkedIn */}
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
                className="group relative grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-slate-100 border border-white/20 shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:bg-[#0077b5] hover:border-[#0077b5] hover:shadow-[0_8px_20px_rgba(0,119,181,0.5)] active:scale-95"
              >
                <svg className="h-4 w-4 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram"
                className="group relative grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-slate-100 border border-white/20 shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:border-pink-500 hover:shadow-[0_8px_20px_rgba(220,39,67,0.5)] active:scale-95"
              >
                <svg className="h-4 w-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Chat"
                title="Chat on WhatsApp"
                className="group relative grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-slate-100 border border-white/20 shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:bg-[#25D366] hover:border-[#25D366] hover:shadow-[0_8px_20px_rgba(37,211,102,0.5)] active:scale-95"
              >
                <svg className="h-4 w-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </a>

              {/* Quick Quote Mini-CTA Button */}
              <button
                type="button"
                onClick={() => openQuote()}
                className="btn-base btn-live-gold ml-1 px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider rounded-xl shadow-md"
              >
                <span>Get Quote</span>
                <Icon name="arrow" className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Column 2: Quick Navigation (lg:col-span-2) */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_6px_rgba(217,155,56,0.8)]" />
            <h3 className="font-display text-xs font-bold uppercase tracking-widest text-amber-300">
              Navigation
            </h3>
          </div>
          <ul className="space-y-2.5">
            {[
              ["/", "Home"],
              ["/about", "About Us & Vision"],
              ["/services", "Service Divisions"],
              ["/industries", "Industries We Serve"],
              ["/portfolio", "Portfolio & Case Studies"],
              ["/gallery", "Field Gallery"],
              ["/contact", "Contact & Office"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link
                  href={to}
                  className="group flex items-center gap-1.5 text-slate-200 hover:text-amber-300 transition-all duration-200 text-xs font-medium"
                >
                  <span className="text-gold/60 text-[10px] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-gold">
                    ›
                  </span>
                  <span className="group-hover:translate-x-0.5 transition-transform duration-200">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Core Divisions Directory (lg:col-span-3) */}
        <div className="lg:col-span-3">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_6px_rgba(217,155,56,0.8)]" />
            <h3 className="font-display text-xs font-bold uppercase tracking-widest text-amber-300">
              Core Divisions
            </h3>
          </div>
          <ul className="space-y-1.5 text-[11px]">
            {[
              ["security-guard-services", "Security Guard Services"],
              ["housekeeping-services", "Housekeeping Services"],
              ["property-management", "Property Management"],
              ["pest-control-services", "Pest Control Services"],
              ["bouncer-services", "Bouncer Services"],
              ["man-power-supply", "Man Power Supply"],
              ["tank-cleaning-gardening-landscaping", "Tank Cleaning & Gardening"],
              ["facility-management-solutions", "Facility Management Solutions"],
              ["cctv-installation-maintenance", "CCTV Installation & AMC"],
              ["plumbing-electrical-painting-waterproofing", "Civil, Electrical & Waterproofing"],
              ["repair-maintenance-services", "Repair & Maintenance"],
            ].map(([slug, name]) => (
              <li key={slug}>
                <Link
                  href={`/services/${slug}`}
                  className="group flex items-center gap-1.5 text-slate-200 hover:text-amber-300 transition-all duration-200 truncate font-normal"
                >
                  <span className="h-1 w-1 rounded-full bg-gold/50 transition-colors group-hover:bg-gold shrink-0" />
                  <span className="truncate group-hover:translate-x-0.5 transition-transform duration-200">{name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: 3D Head Office Panel / Micro-Island (lg:col-span-3) */}
        <div className="lg:col-span-3">
          <div className="footer-card-3d p-4.5 sm:p-5 relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-gold/50 before:to-transparent">
            <div className="flex items-center gap-2 mb-3.5">
              <span className="grid h-6 w-6 place-items-center rounded-lg bg-gold/15 text-gold border border-gold/30">
                <Icon name="pin" className="h-3.5 w-3.5 text-gold" />
              </span>
              <h3 className="font-display text-xs font-bold uppercase tracking-widest text-amber-300">
                Head Office Pune
              </h3>
            </div>

            <ul className="space-y-3 text-xs">
              {/* Phone numbers */}
              <li className="flex items-start gap-2.5">
                <Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                <div className="space-y-0.5">
                  <a
                    href="tel:02045355544"
                    className="hover:text-amber-300 block font-mono font-bold text-white transition-colors"
                  >
                    020 45355544 <span className="text-[10px] font-normal text-slate-300">(Landline)</span>
                  </a>
                  <a
                    href="tel:+919689515295"
                    className="hover:text-amber-300 block font-mono text-slate-200 transition-colors"
                  >
                    +91 9689515295
                  </a>
                  <a
                    href="tel:+919970046704"
                    className="hover:text-amber-300 block font-mono text-slate-200 transition-colors"
                  >
                    +91 9970046704
                  </a>
                </div>
              </li>

              {/* Email */}
              <li className="flex items-center gap-2.5 pt-1">
                <Icon name="mail" className="h-4 w-4 shrink-0 text-amber-300" />
                <a
                  href="mailto:info@diamondifs.com"
                  className="break-all hover:text-amber-300 font-mono text-slate-200 transition-colors"
                >
                  info@diamondifs.com
                </a>
              </li>

              {/* Address */}
              <li className="flex items-start gap-2.5 pt-1">
                <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                <span className="leading-relaxed text-slate-200 text-[11px]">
                  Office No-A2, Sai Pritam Nagari, Chhatrapati Chowk, Rahatani-Kalewadi Link Road, Rahatani, Pune, Maharashtra - 411017
                </span>
              </li>
            </ul>

            {/* Quick Call Action */}
            <div className="mt-4 pt-3 border-t border-white/10">
              <a
                href="tel:+919689515295"
                className="btn-base btn-live-glass w-full py-2 text-xs font-semibold justify-center gap-1.5"
              >
                <Icon name="phone" className="h-3.5 w-3.5 text-gold" />
                <span>Call Hotline Now</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar with 3D Status Badge */}
      <div className="border-t border-white/10 bg-navy-800/90 backdrop-blur-md">
        <div className="container-x flex flex-col gap-2.5 py-4 text-[11px] text-slate-200 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-slate-300 font-medium">
            © 2026 Diamond Integrated Facility Services LLP. All Rights Reserved.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-navy px-3 py-0.5 text-[11px] font-semibold text-emerald-300 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span>Registered Facility Partner • Pan-India Coverage</span>
          </div>
        </div>
      </div>
    </footer>
  );
}


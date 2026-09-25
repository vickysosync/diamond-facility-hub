"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";

export default function Footer() {
  const [company, setCompany] = useState<any>(null);

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
    <footer className="bg-navy text-white border-t border-gold/20">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4 text-xs">
        {/* Brand Column */}
        <div className="space-y-4">
          <Link href="/" className="inline-block rounded-2xl bg-white p-2.5 shadow-md border border-white/20 transition-transform hover:scale-105">
            <img
              src="/images/logo.png"
              alt="Diamond Integrated Facility Services LLP"
              className="h-11 w-auto max-w-[250px] object-contain"
            />
          </Link>
          <p className="text-white leading-relaxed">
            Professional Integrated Facility Management partner delivering 24/7 Security Guarding, Housekeeping, Property Management, Pest Control, Manpower Supply, Tank Sanitization, CCTV and Technical Civil Upkeep in Pune & PCMC.
          </p>
          <div className="pt-2 text-[11px] text-white/80 space-y-0.5 font-mono">
            <p><span className="text-gold font-bold">Director:</span> {company?.directorName || company?.director || "Umesh Patil"}</p>
            <p>LLPIN / Registered Facility Solutions</p>
          </div>

          {/* Social Media / Multimedia Icons */}
          <div className="pt-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gold mb-2.5">Connect With Us</p>
            <div className="flex items-center gap-2.5">
              {/* LinkedIn */}
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-gold hover:text-white transition-all duration-200 border border-white/15 shadow-sm hover:scale-105"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
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
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-gold hover:text-white transition-all duration-200 border border-white/15 shadow-sm hover:scale-105"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* WhatsApp / Chat */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Chat"
                title="Chat on WhatsApp"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-[#25D366] hover:text-white transition-all duration-200 border border-white/15 shadow-sm hover:scale-105"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div>
          <h3 className="font-display text-xs font-bold uppercase tracking-widest text-gold mb-4">Navigation</h3>
          <ul className="space-y-2.5">
            {[
              ["/", "Home"],
              ["/about", "About Us & Vision"],
              ["/services", "Service Divisions"],
              ["/industries", "Industries We Serve"],
              ["/portfolio", "Portfolio & Case Studies"],
              // ["/pricing-estimator", "Online Cost Estimator"], // Disabled (Preserved, can be re-enabled anytime)
              ["/gallery", "Operations Photo Gallery"],
              ["/contact", "Contact & Head Office"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link href={to} className="transition-colors text-white hover:text-gold">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Core Divisions */}
        <div>
          <h3 className="font-display text-xs font-bold uppercase tracking-widest text-gold mb-4">Core Divisions</h3>
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
                  className="transition-colors text-white hover:text-gold block truncate"
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Details */}
        <div>
          <h3 className="font-display text-xs font-bold uppercase tracking-widest text-gold mb-4">Head Office Pune</h3>
          <ul className="space-y-3">
            <li className="flex gap-2.5">
              <Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <div>
                <a href="tel:02045355544" className="hover:text-gold block font-mono font-bold text-white">
                  020 45355544 <span className="text-[10px] font-normal text-white/70">(Landline)</span>
                </a>
                <a href="tel:+919689515295" className="hover:text-gold block font-mono text-white">
                  +91 9689515295
                </a>
                <a href="tel:+919970046704" className="hover:text-gold block font-mono text-white">
                  +91 9970046704
                </a>
              </div>
            </li>
            <li className="flex gap-2.5">
              <Icon name="mail" className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a href="mailto:info@diamondifs.com" className="break-all hover:text-gold font-mono text-white">
                info@diamondifs.com
              </a>
            </li>
            <li className="flex gap-2.5">
              <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span className="leading-relaxed text-white">
                Office No-A2, Sai Pritam Nagari, Chhatrapati Chowk, Rahatani-Kalewadi Link Road, Rahatani, Pune, Maharashtra, India - 411017
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 bg-navy/90">
        <div className="container-x flex flex-col gap-2 py-4 text-[11px] text-white sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Diamond Integrated Facility Services LLP. All Rights Reserved.</p>
          <p className="text-white/80">Registered Facility Partner • Pune, PCMC & Maharashtra</p>
        </div>
      </div>
    </footer>
  );
}

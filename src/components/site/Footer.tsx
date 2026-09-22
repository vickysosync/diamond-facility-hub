"use client";

import Link from "next/link";
import Icon from "@/components/ui/Icon";

export default function Footer() {
  return (
    <footer className="bg-navy text-white/80 border-t border-gold/20">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4 text-xs">
        {/* Brand Column */}
        <div className="space-y-4">
          <Link href="/" className="inline-block">
            <img
              src="/images/logo-white.png"
              alt="Diamond Integrated Facility Services LLP"
              className="h-12 w-auto max-w-[260px] object-contain"
            />
          </Link>
          <p className="text-white/70 leading-relaxed">
            Professional Integrated Facility Management partner delivering 24/7 Security Guarding, Housekeeping, Property Management, Pest Control, Manpower Supply, Tank Sanitization, CCTV and Technical Civil Upkeep in Pune & PCMC.
          </p>
          <div className="pt-2 text-[11px] text-white/50 space-y-0.5 font-mono">
            <p><span className="text-gold font-bold">Director:</span> Umesh Patil</p>
            <p>LLPIN / Registered Facility Solutions</p>
          </div>
        </div>

        {/* Quick Navigation */}
        <div>
          <h3 className="font-display text-xs font-bold uppercase tracking-widest text-gold mb-4">Navigation</h3>
          <ul className="space-y-2.5">
            {[
              ["/", "Home"],
              ["/about", "About Us & Vision"],
              ["/services", "11 Service Divisions"],
              ["/industries", "Industries We Serve"],
              ["/portfolio", "Portfolio & Case Studies"],
              ["/pricing-estimator", "Online Cost Estimator"],
              ["/gallery", "Operations Photo Gallery"],
              ["/contact", "Contact & Head Office"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link href={to} className="transition-colors hover:text-gold">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Core 11 Divisions */}
        <div>
          <h3 className="font-display text-xs font-bold uppercase tracking-widest text-gold mb-4">11 Core Divisions</h3>
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
                  className="transition-colors text-white/75 hover:text-gold block truncate"
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
                <a href="tel:02045355544" className="hover:text-gold block font-mono font-bold">
                  020 45355544 <span className="text-[10px] font-normal text-white/50">(Landline)</span>
                </a>
                <a href="tel:+919689515295" className="hover:text-gold block font-mono">
                  +91 9689515295
                </a>
                <a href="tel:+919970046704" className="hover:text-gold block font-mono">
                  +91 9970046704
                </a>
              </div>
            </li>
            <li className="flex gap-2.5">
              <Icon name="mail" className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a href="mailto:info@diamondifs.com" className="break-all hover:text-gold font-mono">
                info@diamondifs.com
              </a>
            </li>
            <li className="flex gap-2.5">
              <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span className="leading-relaxed text-white/70">
                Office No-A2, Sai Pritam Nagari, Chhatrapati Chowk, Rahatani-Kalewadi Link Road, Rahatani, Pune, Maharashtra, India - 411017
              </span>
            </li>
          </ul>
          <div className="pt-4 mt-4 border-t border-white/10">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gold hover:underline"
            >
              <Icon name="shield" className="h-3.5 w-3.5" /> Staff Admin Portal →
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-navy/90">
        <div className="container-x flex flex-col gap-2 py-4 text-[11px] text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Diamond Integrated Facility Services LLP. All Rights Reserved.</p>
          <p className="text-white/40">Registered Facility Partner • Pune, PCMC & Maharashtra</p>
        </div>
      </div>
    </footer>
  );
}

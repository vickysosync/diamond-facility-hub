"use client";

import React from "react";
import { useApp } from "@/store/AppStore";

export default function WhatsAppButton() {
  const { company } = useApp();
  
  // Format phone number to clean international format without symbols
  const rawPhone = company?.phone || "+91 9689515295";
  const cleanPhone = rawPhone.replace(/\D/g, "");
  // Default to 919689515295 if no clean numbers found
  const whatsappNumber = cleanPhone.length >= 10 ? cleanPhone : "919689515295";
  
  const defaultMessage = encodeURIComponent(
    "Hello Diamond Integrated Facility Services LLP, I would like to inquire about your services."
  );
  
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  return (
    <aside
      aria-label="Contact options"
      className="fixed bottom-6 right-6 z-50 flex items-center group pointer-events-auto select-none"
    >
      {/* 3D Glass Tooltip on hover */}
      <div
        id="whatsapp-tooltip"
        role="tooltip"
        className="mr-3.5 hidden sm:flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-navy/90 backdrop-blur-md rounded-xl shadow-2xl border border-gold/40 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap before:absolute before:inset-x-0 before:top-0 before:h-[1.5px] before:bg-gradient-to-r before:from-transparent before:via-gold before:to-transparent"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
        </span>
        <span className="text-slate-200">Chat with Operations <span className="text-amber-300 font-bold">• 24/7 Online</span></span>
      </div>

      {/* 3D Live Rotating Border Beam Wrapper */}
      <div className="whatsapp-border-beam relative flex items-center justify-center shadow-2xl">
        {/* Floating Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Diamond Facility on WhatsApp"
          aria-describedby="whatsapp-tooltip"
          className="relative flex items-center justify-center w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-gradient-to-br from-[#2fe577] via-[#25D366] to-[#128C7E] text-white shadow-inner overflow-hidden transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-400/40"
        >
          {/* Top 3D Glass Highlight Dome */}
          <div
            className="absolute inset-x-2 top-1.5 h-1/2 rounded-full bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none"
            aria-hidden="true"
          />

          {/* Ambient Inner Glow */}
          <div
            className="absolute inset-0 rounded-full bg-radial from-white/20 via-transparent to-black/25 pointer-events-none"
            aria-hidden="true"
          />

          {/* WhatsApp Official SVG Logo */}
          <svg
            viewBox="0 0 24 24"
            width="32"
            height="32"
            fill="currentColor"
            className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-110"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.454 5.71 1.456h.006c6.554 0 11.89-5.336 11.893-11.894 0-3.177-1.237-6.164-3.488-8.417" />
          </svg>
        </a>

        {/* Live Online Radar Beacon */}
        <span
          className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 border-2 border-navy shadow-[0_0_8px_rgba(52,211,153,1)]" />
        </span>
      </div>
    </aside>
  );
}

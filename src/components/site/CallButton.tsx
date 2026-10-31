"use client";

import React from "react";
import Icon from "@/components/ui/Icon";
import { useApp } from "@/store/AppStore";

export default function CallButton() {
  const { company } = useApp();

  // Official primary phone number
  const phoneNumber = company?.phone || "+91 96895 15295";
  const telHref = `tel:${phoneNumber.replace(/\s+/g, "")}`;

  return (
    <aside
      aria-label="Phone call option"
      className="fixed bottom-[5.5rem] right-6 sm:bottom-[5.8rem] z-50 flex items-center group pointer-events-auto select-none"
    >
      {/* 3D Glass Tooltip on hover for desktop */}
      <div
        id="call-tooltip"
        role="tooltip"
        className="mr-3.5 hidden sm:flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-navy/95 backdrop-blur-md rounded-xl shadow-2xl border border-gold/40 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap before:absolute before:inset-x-0 before:top-0 before:h-[1.5px] before:bg-gradient-to-r before:from-transparent before:via-gold before:to-transparent"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
        </span>
        <span className="text-slate-200">
          Direct Helpline: <span className="text-gold font-bold">{phoneNumber}</span> <span className="text-amber-300">• 24/7 Support</span>
        </span>
      </div>

      {/* 3D Floating Call Button */}
      <div className="relative flex items-center justify-center shadow-2xl">
        <a
          href={telHref}
          aria-label={`Call Diamond Integrated Facility Services at ${phoneNumber}`}
          aria-describedby="call-tooltip"
          title={`Call Now: ${phoneNumber}`}
          className="relative flex items-center justify-center w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-gradient-to-br from-[#f8c460] via-[#d99b38] to-[#996b1b] text-navy shadow-[0_10px_25px_rgba(217,155,56,0.45)] hover:shadow-[0_12px_32px_rgba(217,155,56,0.7)] overflow-hidden transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-gold/40 cursor-pointer"
        >
          {/* Top 3D Glass Highlight Dome */}
          <div
            className="absolute inset-x-2 top-1.5 h-1/2 rounded-full bg-gradient-to-b from-white/60 via-white/20 to-transparent pointer-events-none"
            aria-hidden="true"
          />

          {/* Ambient Inner Glow */}
          <div
            className="absolute inset-0 rounded-full bg-radial from-white/30 via-transparent to-black/20 pointer-events-none"
            aria-hidden="true"
          />

          {/* Phone Icon with ringing animation on hover */}
          <span className="relative z-10 grid place-items-center transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 text-navy drop-shadow-sm">
            <Icon name="phone" className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2.2} />
          </span>
        </a>

        {/* Live Call Pulsing Beacon */}
        <span
          className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-80" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-gold border-2 border-navy shadow-[0_0_8px_rgba(217,155,56,1)]" />
        </span>
      </div>
    </aside>
  );
}


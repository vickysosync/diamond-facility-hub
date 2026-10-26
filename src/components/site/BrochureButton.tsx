"use client";

import React from "react";

export default function BrochureButton() {
  return (
    <aside
      aria-label="Download company brochure"
      className="fixed bottom-6 left-6 z-40 flex items-center group pointer-events-auto select-none"
    >
      {/* 3D Glass Tooltip on hover */}
      <div
        id="brochure-tooltip"
        role="tooltip"
        className="ml-3.5 hidden sm:flex order-2 items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-navy/95 backdrop-blur-md rounded-xl shadow-2xl border border-gold/40 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap before:absolute before:inset-x-0 before:top-0 before:h-[1.5px] before:bg-gradient-to-r before:from-transparent before:via-gold before:to-transparent"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
        </span>
        <span className="text-slate-200">
          Official Profile <span className="text-amber-300 font-bold">• PDF Download</span>
        </span>
      </div>

      {/* Floating Pill Button matching reference image */}
      <a
        href="/Diamond-Facility-Services-Brochure.pdf"
        download="Diamond-Integrated-Facility-Services-Brochure.pdf"
        aria-label="Download Official Company Brochure (PDF)"
        aria-describedby="brochure-tooltip"
        title="Download Official Company Profile Brochure (PDF)"
        className="relative order-1 flex items-center gap-3 rounded-full border border-gold/50 bg-white/95 dark:bg-[#0c1420]/95 py-2 px-4 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-gold hover:shadow-[0_12px_35px_rgba(217,155,56,0.35)] active:scale-95 cursor-pointer"
      >
        {/* Dark Circular Icon Container */}
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#1e1913] text-gold border border-gold/40 shadow-inner transition-transform duration-300 group-hover:scale-110">
          <svg
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 12l4.5 4.5m0 0l4.5-4.5M12 3v13.5"
            />
          </svg>
        </span>

        {/* Text exactly matching reference */}
        <div className="flex flex-col text-left leading-tight pr-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-white">
            DOWNLOAD
          </span>
          <span className="text-[10px] font-bold text-gold uppercase tracking-wider">
            BROCHURE
          </span>
        </div>
      </a>
    </aside>
  );
}

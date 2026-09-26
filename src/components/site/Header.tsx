"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import { useApp } from "@/store/AppStore";

const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/gallery", label: "Gallery" },
];

export interface HeaderProps {
  onQuote: () => void;
}

export default function Header({ onQuote }: HeaderProps) {
  const { company } = useApp();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
          onClick={() => setOpen(false)}
        >
          <img
            src="/images/logo.png"
            alt="Diamond Integrated Facility Services LLP"
            className="h-11 sm:h-12 w-auto max-w-[230px] sm:max-w-[290px] object-contain drop-shadow-xs group-hover:brightness-105 transition-all duration-300"
          />
        </Link>

        {/* Desktop Navigation & Actions */}
        <div className="flex items-center gap-3.5">
          {/* Floating 3D Capsule Nav Island */}
          <nav
            className="hidden xl:flex items-center gap-1 rounded-full border border-slate-200/90 dark:border-white/15 bg-slate-100/90 dark:bg-white/[0.08] p-1 shadow-inner backdrop-blur-md"
            aria-label="Main navigation"
          >
            {nav.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "border border-gold/40 bg-white dark:bg-[#0f1824] text-gold font-bold shadow-[0_3px_14px_rgba(217,155,56,0.25)] -translate-y-0.5 scale-100"
                      : "text-slate-700 dark:text-slate-200 hover:bg-white/70 dark:hover:bg-white/15 hover:text-gold hover:-translate-y-0.5 hover:shadow-xs"
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

          {/* 3D Live Animated CTA Button */}
          <button
            className="btn-base btn-live-gold hidden sm:inline-flex text-xs sm:text-sm px-5 py-2.5 rounded-xl font-bold items-center gap-2 group shadow-md"
            onClick={onQuote}
          >
            {/* Live Specular Shimmer Sweep */}
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none animate-[shimmer-sweep_3.5s_infinite]" />

            <span className="relative z-10 drop-shadow-sm">Get a Free Quote</span>
            <Icon
              name="arrow"
              className="relative z-10 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5"
            />
          </button>

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
        <div className="border-t border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#0a1019]/98 shadow-[0_20px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl xl:hidden animate-in fade-in slide-in-from-top-3 duration-300">
          <nav
            className="container-x flex flex-col py-4 gap-1.5"
            aria-label="Mobile navigation"
          >
            {nav.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "border border-gold/40 bg-gold/10 text-gold font-bold shadow-xs"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-gold"
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

            {/* Mobile 3D Live CTA Button */}
            <button
              className="btn-base btn-live-gold mt-3 w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
              onClick={() => {
                setOpen(false);
                onQuote();
              }}
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none animate-[shimmer-sweep_3.5s_infinite]" />
              <span className="relative z-10">Get a Free Quote</span>
              <Icon
                name="arrow"
                className="relative z-10 h-4 w-4"
              />
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

"use client";

import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import QuoteModal from "./QuoteModal";
import WhatsAppButton from "./WhatsAppButton";

interface QuoteContextType {
  openQuote: (data?: any) => void;
}

const QuoteContext = createContext<QuoteContextType>({ openQuote: () => {} });
export const useQuote = () => useContext(QuoteContext);

export interface SiteLayoutProps {
  children: ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  const [open, setOpen] = useState(false);
  const [prefill, setPrefill] = useState<any>(null);

  const openQuote = useCallback((data: any = null) => {
    setPrefill(data);
    setOpen(true);
  }, []);

  const value = useMemo(() => ({ openQuote }), [openQuote]);

  return (
    <QuoteContext.Provider value={value}>
      <div className="flex min-h-screen flex-col bg-background">
        <Header onQuote={() => openQuote()} />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </div>
      <QuoteModal key={open ? "open" : "closed"} open={open} onClose={() => setOpen(false)} prefill={prefill} />
    </QuoteContext.Provider>
  );
}

import Link from "next/link";
import Icon from "@/components/ui/Icon";

export interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  highlightedTitle?: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  badge?: string;
  badgeIcon?: string;
  stats?: Array<{ label: string; value: string }>;
  features?: string[];
  ctaText?: string;
  ctaAction?: () => void;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  secondaryCtaAction?: () => void;
  children?: ReactNode;
}

export function PageHeader({
  eyebrow = "",
  title = "",
  highlightedTitle = "",
  subtitle = "",
  image,
  imageAlt,
  ctaText,
  ctaAction,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
  secondaryCtaAction,
  children,
}: PageHeaderProps) {
  const { openQuote } = useQuote();

  const renderTitle = () => {
    if (!highlightedTitle || !title.includes(highlightedTitle)) {
      return title;
    }
    const parts = title.split(highlightedTitle);
    return (
      <>
        {parts[0]}
        <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-sm">
          {highlightedTitle}
        </span>
        {parts.slice(1).join(highlightedTitle)}
      </>
    );
  };

  return (
    <section className="group relative overflow-hidden bg-navy isolate border-b border-gold/30 min-h-[340px] sm:min-h-[390px] lg:min-h-[430px] flex items-center before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-gold/50 before:to-transparent before:z-20 after:absolute after:inset-x-0 after:bottom-0 after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-gold/25 after:to-transparent after:z-20">
      {/* Background Image Layer (Full-Bleed, High Visibility) */}
      {image ? (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={image}
            alt={imageAlt || title}
            className="h-full w-full object-cover object-center transform scale-100 transition-transform duration-1000 ease-out group-hover:scale-105"
            loading="eager"
          />
          {/* Soft directional gradient: dark on left for text legibility, clear and visible on the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/50 via-40% to-transparent" />
          {/* Gentle vertical top/bottom blend */}
          <div className="absolute inset-0 bg-gradient-to-b from-navy/30 via-transparent to-navy/40" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-navy">
          <div className="absolute inset-0 opacity-25 [background:radial-gradient(circle_at_20%_25%,rgba(217,155,56,0.25),transparent_55%)]" />
        </div>
      )}

      {/* Foreground Content Layer (Clean, Spacious & Minimal) */}
      <div className="container-x relative z-10 w-full py-14 sm:py-18 lg:py-20">
        <div className="max-w-3xl flex flex-col items-start">
          {/* Eyebrow Pill */}
          {eyebrow && (
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-navy/80 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-300 shadow-md backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold shadow-[0_0_8px_rgba(217,155,56,0.9)]" />
              </span>
              <span>{eyebrow}</span>
            </div>
          )}

          {/* 3D Display Title */}
          <h1 className="mt-3.5 font-display text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl xl:text-[3.15rem] tracking-tight leading-[1.16] drop-shadow-lg">
            {renderTitle()}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="mt-3.5 max-w-2xl text-sm leading-relaxed text-slate-100 sm:text-base lg:text-[1.05rem] font-normal drop-shadow-md">
              {subtitle}
            </p>
          )}

          {/* Compact Action Buttons Row */}
          {(ctaText || secondaryCtaText) && (
            <div className="mt-6 sm:mt-7 flex flex-wrap items-center gap-3 sm:gap-3.5">
              {ctaText && (
                ctaLink ? (
                  <Link
                    href={ctaLink}
                    className="btn-base btn-live-gold px-4.5 py-2 sm:py-2.5 text-xs font-bold tracking-wider uppercase rounded-lg shadow-lg shadow-gold/25"
                  >
                    <span>{ctaText}</span>
                    <Icon name="arrow" className="h-3.5 w-3.5" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={ctaAction || (() => openQuote())}
                    className="btn-base btn-live-gold px-4.5 py-2 sm:py-2.5 text-xs font-bold tracking-wider uppercase rounded-lg shadow-lg shadow-gold/25"
                  >
                    <span>{ctaText}</span>
                    <Icon name="arrow" className="h-3.5 w-3.5" />
                  </button>
                )
              )}

              {secondaryCtaText && (
                secondaryCtaLink ? (
                  <Link
                    href={secondaryCtaLink}
                    className="btn-base btn-live-glass px-4.5 py-2 sm:py-2.5 text-xs font-semibold tracking-wide rounded-lg shadow-md"
                  >
                    <span>{secondaryCtaText}</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={secondaryCtaAction || (() => openQuote())}
                    className="btn-base btn-live-glass px-4.5 py-2 sm:py-2.5 text-xs font-semibold tracking-wide rounded-lg shadow-md"
                  >
                    <span>{secondaryCtaText}</span>
                  </button>
                )
              )}
            </div>
          )}

          {children}
        </div>
      </div>
    </section>
  );
}


"use client";

import { createContext, useCallback, useContext, useMemo, useState, useEffect, ReactNode } from "react";
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
  placement?: string;
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
  placement,
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
  const [bannerData, setBannerData] = useState<any>(null);

  useEffect(() => {
    if (!placement) return;
    let isMounted = true;
    async function fetchBanner() {
      try {
        const res = await fetch(`/api/banners?placement=${placement}&status=Active`);
        const data = await res.json();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setBannerData(data[0]);
        }
      } catch (err) {
        console.error("Failed to load header banner:", err);
      }
    }
    fetchBanner();
    return () => {
      isMounted = false;
    };
  }, [placement]);

  const activeTitle = bannerData?.title || title;
  const activeHighlightedTitle =
    bannerData?.highlightedTitle !== undefined ? bannerData.highlightedTitle : highlightedTitle;
  const activeSubtitle = bannerData?.description || bannerData?.subtitle || subtitle;
  const activeEyebrow = bannerData?.badge || eyebrow;
  const activeImage =
    (typeof bannerData?.image === "string" ? bannerData.image : bannerData?.image?.secure_url) ||
    bannerData?.imageUrl ||
    image;
  const activeCtaText = bannerData?.primaryCtaText || bannerData?.ctaText || ctaText;
  const activeCtaLink = bannerData?.primaryCtaLink || bannerData?.ctaLink || ctaLink;
  const activeSecondaryCtaText = bannerData?.secondaryCtaText || secondaryCtaText;
  const activeSecondaryCtaLink = bannerData?.secondaryCtaLink || secondaryCtaLink;

  const renderTitle = () => {
    if (!activeHighlightedTitle || !activeTitle.includes(activeHighlightedTitle)) {
      return activeTitle;
    }
    const parts = activeTitle.split(activeHighlightedTitle);
    return (
      <>
        {parts[0]}
        <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-sm">
          {activeHighlightedTitle}
        </span>
        {parts.slice(1).join(activeHighlightedTitle)}
      </>
    );
  };

  return (
    <section className="group relative overflow-hidden bg-[#0a1019] isolate border-b border-gold/30 min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] flex items-center py-10 sm:py-14 lg:py-16 before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-gold/50 before:to-transparent before:z-20 after:absolute after:inset-x-0 after:bottom-0 after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-gold/25 after:to-transparent after:z-20">
      {/* Background Ambient Lighting */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#0a1019]">
        <div className="absolute inset-0 opacity-25 [background:radial-gradient(circle_at_15%_25%,rgba(217,155,56,0.3),transparent_55%)]" />
        <div className="absolute inset-0 opacity-15 [background:radial-gradient(circle_at_85%_75%,rgba(217,155,56,0.2),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      {/* Right-Side Full Fit Image Layer (100% Uncropped Face, Logo & Subject Visibility) */}
      {activeImage && (
        <div className="absolute inset-0 z-0 flex items-center justify-end pointer-events-none overflow-hidden">
          <div className="relative h-full w-full md:w-3/5 lg:w-1/2 xl:w-[48%] flex items-center justify-end">
            <img
              src={activeImage}
              alt={imageAlt || activeTitle}
              className="h-full w-full object-contain object-right drop-shadow-2xl transform scale-100 transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              loading="eager"
            />
            {/* Left Edge Seamless Dark Blend */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a1019] via-[#0a1019]/70 via-15% to-transparent pointer-events-none" />
            {/* Top & Bottom Subtle Blend */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1019]/80 via-transparent to-[#0a1019]/40 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Foreground Content Layer (Left Aligned for High Contrast & Readability) */}
      <div className="container-x relative z-10 w-full">
        <div className="max-w-xl lg:max-w-lg xl:max-w-xl flex flex-col items-start space-y-4">
          {/* Eyebrow Pill */}
          {activeEyebrow && (
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-[#0a1019]/90 px-3.5 py-1 text-[10.5px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-amber-300 shadow-md backdrop-blur-md">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold shadow-[0_0_8px_rgba(217,155,56,0.9)]" />
              </span>
              <span>{activeEyebrow}</span>
            </div>
          )}

          {/* 3D Display Title */}
          <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.18] sm:leading-[1.15] drop-shadow-lg">
            {renderTitle()}
          </h1>

          {/* Subtitle */}
          {activeSubtitle && (
            <p className="max-w-xl text-xs sm:text-sm lg:text-base leading-relaxed text-slate-200 font-normal drop-shadow-md">
              {activeSubtitle}
            </p>
          )}

          {/* Action Buttons */}
          {(activeCtaText || activeSecondaryCtaText) && (
            <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3.5">
              {activeCtaText && (
                activeCtaLink ? (
                  <Link
                    href={activeCtaLink}
                    className="btn-base btn-live-gold px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold tracking-wider uppercase rounded-xl shadow-lg shadow-gold/25"
                  >
                    <span>{activeCtaText}</span>
                    <Icon name="arrow" className="h-4 w-4" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={ctaAction || (() => openQuote())}
                    className="btn-base btn-live-gold px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold tracking-wider uppercase rounded-xl shadow-lg shadow-gold/25"
                  >
                    <span>{activeCtaText}</span>
                    <Icon name="arrow" className="h-4 w-4" />
                  </button>
                )
              )}

              {activeSecondaryCtaText && (
                activeSecondaryCtaLink ? (
                  <Link
                    href={activeSecondaryCtaLink}
                    className="btn-base btn-live-glass px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold tracking-wide rounded-xl shadow-md border border-white/20"
                  >
                    <span>{activeSecondaryCtaText}</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={secondaryCtaAction || (() => openQuote())}
                    className="btn-base btn-live-glass px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold tracking-wide rounded-xl shadow-md border border-white/20"
                  >
                    <span>{activeSecondaryCtaText}</span>
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


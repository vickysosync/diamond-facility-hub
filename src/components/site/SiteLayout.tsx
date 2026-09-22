"use client";

import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import QuoteModal from "./QuoteModal";

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
      </div>
      <QuoteModal key={open ? "open" : "closed"} open={open} onClose={() => setOpen(false)} prefill={prefill} />
    </QuoteContext.Provider>
  );
}

export interface PageHeaderProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}

export function PageHeader({ eyebrow = "", title = "", subtitle = "" }: PageHeaderProps) {
  return (
    <section className="gradient-navy relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_20%,white,transparent_45%)]" />
      <div className="container-x relative py-16 lg:py-20">
        {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.18em] text-safety">{eyebrow}</p>}
        <h1 className="mt-3 max-w-3xl text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">{subtitle}</p>}
      </div>
    </section>
  );
}

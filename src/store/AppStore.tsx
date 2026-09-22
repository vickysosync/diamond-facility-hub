"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  companyInfo as seedCompany,
  contactMessages as seedMessages,
  portfolio as seedPortfolio,
  pricingRules as seedPricing,
  quoteRequests as seedQuotes,
  services as seedServices,
  testimonials as seedTestimonials,
  industries as seedIndustries,
  CompanyInfo,
  ContactMessageItem,
  IndustryItem,
  PortfolioItem,
  PricingRule,
  QuoteRequestItem,
  ServiceItem,
  TestimonialItem,
} from "@/data/mock";

const KEY = "difs-state-v1";

export interface AppState {
  services: ServiceItem[];
  portfolio: PortfolioItem[];
  testimonials: TestimonialItem[];
  industries: IndustryItem[];
  pricing: PricingRule[];
  quotes: QuoteRequestItem[];
  messages: ContactMessageItem[];
  company: CompanyInfo;
  isAdmin: boolean;
}

export interface ListOps<T> {
  add: (item: Partial<T>) => void;
  update: (id: string | number, changes: Partial<T>) => void;
  remove: (id: string | number) => void;
}

export interface AppContextType extends AppState {
  hydrated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  servicesOps: ListOps<ServiceItem>;
  portfolioOps: ListOps<PortfolioItem>;
  testimonialsOps: ListOps<TestimonialItem>;
  industriesOps: ListOps<IndustryItem>;
  updatePricing: (id: string, changes: Partial<PricingRule>) => void;
  updateCompany: (changes: Partial<CompanyInfo>) => void;
  addQuote: (quote: Partial<QuoteRequestItem>) => void;
  updateQuote: (id: string, changes: Partial<QuoteRequestItem>) => void;
  addMessage: (msg: Partial<ContactMessageItem>) => void;
  updateMessage: (id: string, changes: Partial<ContactMessageItem>) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const seed = (): AppState => ({
  services: seedServices,
  portfolio: seedPortfolio,
  testimonials: seedTestimonials,
  industries: seedIndustries,
  pricing: seedPricing,
  quotes: seedQuotes,
  messages: seedMessages,
  company: seedCompany,
  isAdmin: false,
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(seed);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        setState((prev) => ({ ...prev, ...saved }));
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [state, hydrated]);

  const patch = useCallback((updater: (prev: AppState) => Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...updater(prev) }));
  }, []);

  const api: AppContextType = useMemo(() => {
    const listOps = <T extends { id: string | number }>(key: keyof AppState) => ({
      add: (item: Partial<T>) =>
        patch((p) => ({
          [key]: [
            {
              ...item,
              id: item.id ?? Date.now(),
            },
            ...(p[key] as unknown as T[]),
          ],
        })),
      update: (id: string | number, changes: Partial<T>) =>
        patch((p) => ({
          [key]: (p[key] as unknown as T[]).map((i) => (i.id === id ? { ...i, ...changes } : i)),
        })),
      remove: (id: string | number) =>
        patch((p) => ({
          [key]: (p[key] as unknown as T[]).filter((i) => i.id !== id),
        })),
    });

    return {
      ...state,
      hydrated,
      login: (email: string, password: string) => {
        const ok = email.trim().toLowerCase() === "admin@diamondfacility.com" && password === "admin123";
        if (ok) patch(() => ({ isAdmin: true }));
        return ok;
      },
      logout: () => patch(() => ({ isAdmin: false })),
      servicesOps: listOps<ServiceItem>("services"),
      portfolioOps: listOps<PortfolioItem>("portfolio"),
      testimonialsOps: listOps<TestimonialItem>("testimonials"),
      industriesOps: listOps<IndustryItem>("industries"),
      updatePricing: (id: string, changes: Partial<PricingRule>) =>
        patch((p) => ({ pricing: p.pricing.map((r) => (r.id === id ? { ...r, ...changes } : r)) })),
      updateCompany: (changes: Partial<CompanyInfo>) => patch((p) => ({ company: { ...p.company, ...changes } })),
      addQuote: (quote: Partial<QuoteRequestItem>) =>
        patch((p) => ({
          quotes: [
            {
              ...quote,
              id: "QR-" + (1042 + p.quotes.length),
              date: new Date().toISOString().slice(0, 10),
              status: "New",
            } as QuoteRequestItem,
            ...p.quotes,
          ],
        })),
      updateQuote: (id: string, changes: Partial<QuoteRequestItem>) =>
        patch((p) => ({ quotes: p.quotes.map((q) => (q.id === id ? { ...q, ...changes } : q)) })),
      addMessage: (msg: Partial<ContactMessageItem>) =>
        patch((p) => ({
          messages: [
            {
              ...msg,
              id: "CM-" + (319 + p.messages.length),
              date: new Date().toISOString().slice(0, 10),
              status: "New",
            } as ContactMessageItem,
            ...p.messages,
          ],
        })),
      updateMessage: (id: string, changes: Partial<ContactMessageItem>) =>
        patch((p) => ({ messages: p.messages.map((m) => (m.id === id ? { ...m, ...changes } : m)) })),
      resetDemoData: () => setState((prev) => ({ ...seed(), isAdmin: prev.isAdmin })),
    };
  }, [state, hydrated, patch]);

  return <AppContext.Provider value={api}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

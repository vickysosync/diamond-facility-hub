import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  companyInfo as seedCompany,
  contactMessages as seedMessages,
  portfolio as seedPortfolio,
  pricingRules as seedPricing,
  quoteRequests as seedQuotes,
  services as seedServices,
  testimonials as seedTestimonials,
  industries as seedIndustries,
} from "@/data/mock.jsx";

const KEY = "difs-state-v1";

const AppContext = createContext(null);

const seed = () => ({
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

export function AppProvider({ children }) {
  const [state, setState] = useState(seed);
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

  const patch = useCallback((updater) => setState((prev) => ({ ...prev, ...updater(prev) })), []);

  const api = useMemo(() => {
    const listOps = (key) => ({
      add: (item) =>
        patch((p) => ({ [key]: [{ ...item, id: item.id ?? Date.now() }, ...p[key]] })),
      update: (id, changes) =>
        patch((p) => ({ [key]: p[key].map((i) => (i.id === id ? { ...i, ...changes } : i)) })),
      remove: (id) => patch((p) => ({ [key]: p[key].filter((i) => i.id !== id) })),
    });

    return {
      ...state,
      hydrated,
      login: (email, password) => {
        const ok = email.trim().toLowerCase() === "admin@diamondfacility.com" && password === "admin123";
        if (ok) patch(() => ({ isAdmin: true }));
        return ok;
      },
      logout: () => patch(() => ({ isAdmin: false })),
      servicesOps: listOps("services"),
      portfolioOps: listOps("portfolio"),
      testimonialsOps: listOps("testimonials"),
      industriesOps: listOps("industries"),
      updatePricing: (id, changes) =>
        patch((p) => ({ pricing: p.pricing.map((r) => (r.id === id ? { ...r, ...changes } : r)) })),
      updateCompany: (changes) => patch((p) => ({ company: { ...p.company, ...changes } })),
      addQuote: (quote) =>
        patch((p) => ({
          quotes: [
            {
              ...quote,
              id: "QR-" + (1042 + p.quotes.length),
              date: new Date().toISOString().slice(0, 10),
              status: "New",
            },
            ...p.quotes,
          ],
        })),
      updateQuote: (id, changes) =>
        patch((p) => ({ quotes: p.quotes.map((q) => (q.id === id ? { ...q, ...changes } : q)) })),
      addMessage: (msg) =>
        patch((p) => ({
          messages: [
            {
              ...msg,
              id: "CM-" + (319 + p.messages.length),
              date: new Date().toISOString().slice(0, 10),
              status: "New",
            },
            ...p.messages,
          ],
        })),
      updateMessage: (id, changes) =>
        patch((p) => ({ messages: p.messages.map((m) => (m.id === id ? { ...m, ...changes } : m)) })),
      resetDemoData: () => setState(seed()),
    };
  }, [state, hydrated, patch]);

  return <AppContext.Provider value={api}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

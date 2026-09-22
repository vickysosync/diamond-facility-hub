"use client";

import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/ui/Icon";
import { formatINR, sizePresets } from "@/data/mock";
import { useQuote } from "./SiteLayout";

const iconMap: Record<string, string> = {
  "Security Guard Services": "shield",
  "Housekeeping Services": "sparkles",
  "Property Management": "building",
  "Pest Control Services": "bug",
  "Bouncer Services": "users",
  "Man Power Supply": "briefcase",
  "Tank Cleaning, Gardening and Landscaping etc.": "droplet",
  "Tank Cleaning & Gardening": "droplet",
  "Facility Management Solutions": "layers",
  "CCTV Installation and Maintenance": "video",
  "Plumbing, Electrical, Painting, Waterproofing": "roller",
  "Plumbing, Electrical & Painting": "roller",
  "Repair and Maintenance Services": "gear",
};

const frequencyOptions = [
  { id: "one-time", label: "One-Time Service", discountKey: null, multiplier: 1.0 },
  { id: "monthly", label: "Monthly Contract", discountKey: "discountMonthlyPct", multiplier: 1.0 },
  { id: "quarterly", label: "Quarterly Contract", discountKey: "discountQuarterlyPct", multiplier: 1.0 },
  { id: "annual", label: "Annual AMC (Max Savings)", discountKey: "discountAnnualPct", multiplier: 1.0 },
];

export default function Estimator() {
  const { openQuote } = useQuote();
  const [pricingRules, setPricingRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [size, setSize] = useState(25000);
  const [frequency, setFrequency] = useState("monthly");

  useEffect(() => {
    async function loadPricing() {
      try {
        setLoading(true);
        const res = await fetch("/api/pricing");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const active = data.filter((d) => d.active !== false);
          setPricingRules(active);
          if (active.length > 0) {
            setSelected([active[0]._id, active[1]?._id].filter(Boolean));
          }
        }
      } catch (e) {
        console.error("Failed to load pricing rules:", e);
      } finally {
        setLoading(false);
      }
    }
    loadPricing();
  }, []);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const freq = frequencyOptions.find((f) => f.id === frequency) ?? frequencyOptions[1];

  const breakdown = useMemo(() => {
    return pricingRules
      .filter((rule) => selected.includes(rule._id))
      .map((rule) => {
        const base = Number(rule.basePrice) || 0;
        const rate = Number(rule.ratePerUnit) || 0;
        const minP = Number(rule.minPrice) || 0;
        
        let calculated = base + rate * size;
        if (calculated < minP) calculated = minP;

        // Apply frequency discount if applicable
        if (freq.discountKey && rule[freq.discountKey]) {
          const discountPct = Number(rule[freq.discountKey]) || 0;
          calculated = calculated * (1 - discountPct / 100);
        }

        return {
          id: rule._id,
          name: rule.category,
          cost: Math.round(calculated),
        };
      });
  }, [pricingRules, selected, size, freq]);

  const total = breakdown.reduce((sum, b) => sum + b.cost, 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-8">
      <div className="space-y-7 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-7">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gold">Step 1</p>
          <h3 className="mt-1 text-lg font-bold text-navy">Select Service Lines</h3>
          
          {loading ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-gold border-t-transparent inline-block" />
              <p className="mt-2">Loading pricing matrix…</p>
            </div>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {pricingRules.map((rule) => {
                const on = selected.includes(rule._id);
                return (
                  <button
                    key={rule._id}
                    type="button"
                    onClick={() => toggle(rule._id)}
                    aria-pressed={on}
                    className={`grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                      on
                        ? "border-gold bg-gold/8 shadow-card"
                        : "border-border bg-background hover:border-gold/50"
                    }`}
                  >
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${
                        on ? "bg-navy text-gold" : "bg-muted text-navy"
                      }`}
                    >
                      <Icon name={iconMap[rule.category] || "shield"} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-navy">{rule.category}</span>
                      <span className="block text-xs text-muted-foreground">
                        From {formatINR(rule.basePrice || rule.minPrice)}
                      </span>
                    </span>
                    <span
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border ${
                        on ? "border-gold bg-gold text-white" : "border-border"
                      }`}
                    >
                      {on && <Icon name="check" className="h-3 w-3" strokeWidth={3} />}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gold">Step 2</p>
          <div className="mt-1 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <h3 className="min-w-0 text-lg font-bold text-navy">Facility Area Size</h3>
            <span className="shrink-0 rounded-lg bg-navy px-3 py-1.5 font-display text-sm font-bold text-gold">
              {size.toLocaleString("en-IN")} sq.ft
            </span>
          </div>
          <input
            type="range"
            min={500}
            max={150000}
            step={500}
            value={size}
            aria-label="Facility size in square feet"
            onChange={(e) => setSize(Number(e.target.value))}
            className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-gold"
          />
          <div className="mt-1 flex justify-between text-[11px] text-muted-foreground font-mono">
            <span>500 sq.ft</span>
            <span>150,000 sq.ft</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {sizePresets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setSize(p.value)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  size === p.value
                    ? "border-navy bg-navy text-white"
                    : "border-border text-navy hover:border-gold hover:text-gold"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gold">Step 3</p>
          <h3 className="mt-1 text-lg font-bold text-navy">Contract Duration & Frequency</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {frequencyOptions.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFrequency(f.id)}
                aria-pressed={frequency === f.id}
                className={`rounded-lg border px-4 py-2 text-xs font-semibold transition-all ${
                  frequency === f.id
                    ? "border-gold bg-gold/15 text-navy font-bold shadow-xs"
                    : "border-border text-navy hover:border-gold/50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <aside className="bg-navy sticky top-24 h-fit rounded-2xl p-5 text-white shadow-lift sm:p-7 border border-gold/20">
        <p className="text-xs font-bold uppercase tracking-widest text-gold">Step 4</p>
        <h3 className="mt-1 text-lg font-bold text-white">Estimated Proposal</h3>

        <div className="mt-5 space-y-3">
          {breakdown.length === 0 ? (
            <p className="rounded-xl bg-white/8 p-4 text-sm text-white/70">
              Select at least one service above to see your customized estimate.
            </p>
          ) : (
            breakdown.map((b) => (
              <div key={b.id} className="flex items-center justify-between border-b border-white/12 pb-3 text-sm">
                <span className="text-white/80">{b.name}</span>
                <span className="font-semibold text-white font-mono">{formatINR(b.cost)}</span>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 rounded-xl bg-white/10 p-4 border border-white/10">
          <p className="text-xs uppercase tracking-widest text-white/60">Estimated Service Cost</p>
          <p className="mt-1 font-display text-3xl font-extrabold text-gold sm:text-4xl">
            {formatINR(total)}
          </p>
          <p className="mt-1 text-xs text-white/60">
            {freq.label} · {size.toLocaleString("en-IN")} sq.ft
          </p>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-white/60">
          This is an indicative estimate. Final pricing may vary based on physical site survey, specialized compliance requirements, and custom equipment needs.
        </p>

        <button
          className="btn-base btn-accent mt-5 w-full py-3 text-sm font-bold"
          disabled={breakdown.length === 0}
          onClick={() =>
            openQuote({
              services: breakdown.map((b) => b.name),
              facilitySize: size,
              frequency: freq.label,
              estimatedCost: total,
            })
          }
        >
          Request Official Proposal
        </button>
      </aside>
    </div>
  );
}

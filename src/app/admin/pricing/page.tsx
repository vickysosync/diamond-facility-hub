"use client";

import { useEffect, useState } from "react";
import AdminLayout, { EmptyState, StatusPill, Toast, useToast } from "@/components/admin/AdminLayout";
import Icon from "@/components/ui/Icon";
import { formatINR } from "@/data/mock";

interface PricingRule {
  _id: string;
  category: string;
  serviceCategorySlug?: string;
  unitType: "sqft" | "guards" | "hours" | "visits" | "fixed";
  basePrice: number;
  ratePerUnit: number;
  minUnits: number;
  minPrice: number;
  shiftMultiplier24x7: number;
  discountMonthlyPct: number;
  discountQuarterlyPct: number;
  discountAnnualPct: number;
  active: boolean;
  notes: string;
}

const SAMPLE_SIZE = 25000;

export default function AdminPricingPage() {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [viewing, setViewing] = useState<PricingRule | null>(null);
  const [testUnits, setTestUnits] = useState<number>(10000);
  const [testShift, setTestShift] = useState<"8h" | "12h" | "24x7">("8h");
  const [testDuration, setTestDuration] = useState<"one_time" | "monthly" | "quarterly" | "annual">("monthly");
  const [toastMessage, showToast] = useToast();

  const loadRules = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/pricing");
      const data = await res.json();
      if (Array.isArray(data)) setRules(data);
    } catch (err) {
      console.error("Failed to load pricing rules:", err);
      showToast("Error loading pricing rules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRules();
  }, []);

  const updateField = (id: string, field: string, value: any) => {
    setRules((prev) =>
      prev.map((r) => (r._id === id ? { ...r, [field]: value } : r))
    );
  };

  const saveRule = async (rule: PricingRule) => {
    try {
      setSavingId(rule._id);
      const res = await fetch(`/api/pricing/${rule._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rule),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update pricing rule");
      showToast(`${rule.category} pricing rates saved!`);
    } catch (err: any) {
      showToast(err?.message || "Failed to save rule");
    } finally {
      setSavingId(null);
    }
  };

  const preview = (rule: PricingRule, units: number = SAMPLE_SIZE) => {
    const raw = (Number(rule.basePrice) || 0) + (Number(rule.ratePerUnit) || 0) * units;
    return Math.max(rule.minPrice || 0, raw);
  };

  const calculateSimulatedCost = (rule: PricingRule) => {
    let base = preview(rule, testUnits);
    if (testShift === "12h") base *= 1.35;
    if (testShift === "24x7") base *= (rule.shiftMultiplier24x7 || 1.8);
    
    let discountPct = 0;
    if (testDuration === "monthly") discountPct = rule.discountMonthlyPct || 5;
    if (testDuration === "quarterly") discountPct = rule.discountQuarterlyPct || 10;
    if (testDuration === "annual") discountPct = rule.discountAnnualPct || 15;

    const discountAmount = (base * discountPct) / 100;
    const finalPrice = Math.round(base - discountAmount);
    return { base: Math.round(base), discountPct, discountAmount: Math.round(discountAmount), finalPrice };
  };

  return (
    <AdminLayout
      title="Pricing Estimator Rules"
      description="Dynamic pricing rates, unit calculations and shift algorithms powering the website's instant cost calculator"
      actions={
        <div className="flex items-center gap-2">
          <a
            href="/pricing-estimator"
            target="_blank"
            rel="noreferrer"
            className="btn-base bg-white border border-border text-navy hover:bg-surface-subtle text-xs flex items-center gap-1.5 py-2 px-3 shadow-2xs"
          >
            <Icon name="eye" className="w-3.5 h-3.5 text-gold" /> Test Live Estimator ↗
          </a>
          <button
            onClick={loadRules}
            className="btn-base btn-secondary text-xs flex items-center gap-1.5 py-2 px-3"
          >
            <Icon name="sliders" className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      }
    >
      <Toast message={toastMessage} />

      <div className="mb-5 flex items-start gap-3 rounded-2xl border border-gold/30 bg-gold/5 p-4 text-xs text-navy shadow-xs">
        <div className="p-1.5 rounded-lg bg-gold/15 text-gold shrink-0">
          <Icon name="sliders" className="h-4 w-4" />
        </div>
        <div>
          <h2 className="font-bold text-navy text-xs">Estimation Engine Formula</h2>
          <p className="mt-0.5 text-muted-foreground leading-relaxed">
            <span className="font-bold text-navy font-mono">Cost = Max(Min Price Floor, Base Fee + Rate/Unit × Scope) × Shift Multiplier × (1 - Duration Discount%)</span>.
            Click <strong className="text-navy">&ldquo;👁 View & Simulate&rdquo;</strong> on any card to test calculations interactively with real sample parameters.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent inline-block" />
          <p className="mt-2 text-xs font-semibold text-muted-foreground">Loading pricing rules…</p>
        </div>
      ) : rules.length === 0 ? (
        <EmptyState message="No pricing rules configured." />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {rules.map((rule) => (
            <section 
              key={rule._id} 
              className="rounded-2xl border border-border bg-card p-5 shadow-xs hover:shadow-card transition-all duration-200 flex flex-col justify-between hover:border-gold/30"
            >
              <div>
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-border">
                  <div>
                    <h2 className="font-display text-base font-bold text-navy">{rule.category}</h2>
                    <span className="inline-block mt-0.5 text-[11px] font-mono text-gold bg-gold/10 px-2 py-0.5 rounded-md font-semibold">
                      Billing Unit: {rule.unitType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setViewing(rule);
                        setTestUnits(rule.unitType === "guards" ? 4 : rule.unitType === "hours" ? 40 : 10000);
                      }}
                      className="bg-white border border-border shadow-2xs hover:bg-navy hover:text-white text-navy text-xs font-semibold py-1 px-2.5 rounded-lg inline-flex items-center gap-1 transition-all"
                      title="View & Simulate Pricing"
                    >
                      <Icon name="eye" className="w-3.5 h-3.5" /> View & Simulate
                    </button>
                    <StatusPill value={rule.active ? "Active" : "Inactive"} />
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 text-xs">
                  <div>
                    <label className="block font-bold text-navy mb-1">Base Price (₹)</label>
                    <input
                      type="number"
                      className="field text-xs"
                      value={rule.basePrice ?? 0}
                      onChange={(e) => updateField(rule._id, "basePrice", Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-navy mb-1">Rate Per Unit (₹/{rule.unitType})</label>
                    <input
                      type="number"
                      step="0.01"
                      className="field text-xs"
                      value={rule.ratePerUnit ?? 0}
                      onChange={(e) => updateField(rule._id, "ratePerUnit", Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-navy mb-1">Minimum Price Floor (₹)</label>
                    <input
                      type="number"
                      className="field text-xs"
                      value={rule.minPrice ?? 0}
                      onChange={(e) => updateField(rule._id, "minPrice", Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-navy mb-1">24x7 Shift Multiplier</label>
                    <input
                      type="number"
                      step="0.1"
                      className="field text-xs"
                      value={rule.shiftMultiplier24x7 ?? 1.8}
                      onChange={(e) => updateField(rule._id, "shiftMultiplier24x7", Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* Duration Discounts */}
                <div className="mt-4 bg-surface-subtle p-3 rounded-xl border border-border/80">
                  <span className="text-[10px] font-bold text-navy uppercase tracking-wider block mb-2">
                    Contract Tenure Discounts (%)
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-[11px]">
                    <div>
                      <label className="block font-semibold text-muted-foreground mb-1">Monthly</label>
                      <div className="relative">
                        <input
                          type="number"
                          className="field text-xs py-1 pr-6"
                          value={rule.discountMonthlyPct ?? 5}
                          onChange={(e) => updateField(rule._id, "discountMonthlyPct", Number(e.target.value))}
                        />
                        <span className="absolute right-2 top-1.5 text-muted-foreground text-xs">%</span>
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold text-muted-foreground mb-1">Quarterly</label>
                      <div className="relative">
                        <input
                          type="number"
                          className="field text-xs py-1 pr-6"
                          value={rule.discountQuarterlyPct ?? 10}
                          onChange={(e) => updateField(rule._id, "discountQuarterlyPct", Number(e.target.value))}
                        />
                        <span className="absolute right-2 top-1.5 text-muted-foreground text-xs">%</span>
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold text-muted-foreground mb-1">Annual</label>
                      <div className="relative">
                        <input
                          type="number"
                          className="field text-xs py-1 pr-6"
                          value={rule.discountAnnualPct ?? 15}
                          onChange={(e) => updateField(rule._id, "discountAnnualPct", Number(e.target.value))}
                        />
                        <span className="absolute right-2 top-1.5 text-muted-foreground text-xs">%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface-subtle/80 border border-border p-3">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Standard Sample Baseline ({SAMPLE_SIZE.toLocaleString("en-IN")} {rule.unitType}):
                  </span>
                  <span className="font-display text-base font-extrabold text-gold">
                    {formatINR(preview(rule))}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold text-navy cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!rule.active}
                    onChange={(e) => updateField(rule._id, "active", e.target.checked)}
                    className="rounded text-gold focus:ring-gold"
                  />
                  Active in Estimator
                </label>
                <button
                  type="button"
                  disabled={savingId === rule._id}
                  onClick={() => saveRule(rule)}
                  className="btn-base btn-accent text-xs py-1.5 px-4 flex items-center gap-1.5 shadow-2xs"
                >
                  {savingId === rule._id ? (
                    <>
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Icon name="check" className="w-3.5 h-3.5" /> Save Rates
                    </>
                  )}
                </button>
              </div>
            </section>
          ))}
        </div>
      )}

      {/* View & Simulation Detail Modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl my-8 rounded-2xl bg-card p-6 shadow-lift border border-border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-gold/10 text-gold">
                  <Icon name="sliders" className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="font-display text-base font-bold text-navy">{viewing.category}</h2>
                  <p className="text-[11px] text-muted-foreground">Dynamic Calculator Breakdown & Simulation</p>
                </div>
              </div>
              <button onClick={() => setViewing(null)} className="p-1 text-muted-foreground hover:text-navy rounded-lg hover:bg-surface-subtle">
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {/* Formula & Current Configuration Matrix */}
              <div className="p-4 rounded-xl bg-surface-subtle border border-border">
                <h3 className="font-bold text-navy text-xs mb-2">Configured Matrix Parameters</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="bg-card p-2 rounded-lg border border-border text-center">
                    <span className="text-[10px] text-muted-foreground block">Base Fee</span>
                    <strong className="text-navy">{formatINR(viewing.basePrice)}</strong>
                  </div>
                  <div className="bg-card p-2 rounded-lg border border-border text-center">
                    <span className="text-[10px] text-muted-foreground block">Rate/{viewing.unitType}</span>
                    <strong className="text-navy">{formatINR(viewing.ratePerUnit)}</strong>
                  </div>
                  <div className="bg-card p-2 rounded-lg border border-border text-center">
                    <span className="text-[10px] text-muted-foreground block">Min Price Floor</span>
                    <strong className="text-navy">{formatINR(viewing.minPrice)}</strong>
                  </div>
                  <div className="bg-card p-2 rounded-lg border border-border text-center">
                    <span className="text-[10px] text-muted-foreground block">24x7 Shift</span>
                    <strong className="text-navy">{viewing.shiftMultiplier24x7 || 1.8}x</strong>
                  </div>
                </div>
              </div>

              {/* Interactive Sandbox Simulator */}
              <div className="p-4 rounded-xl border-2 border-gold/30 bg-gold/5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-navy text-xs flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
                    Live Sandbox Calculation Tester
                  </h3>
                  <span className="text-[10px] font-semibold text-gold bg-white px-2 py-0.5 rounded border border-gold/30">
                    Real-time
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-navy text-[11px] mb-1">
                      Test Scope ({viewing.unitType})
                    </label>
                    <input
                      type="number"
                      className="field text-xs py-1"
                      value={testUnits}
                      onChange={(e) => setTestUnits(Math.max(1, Number(e.target.value)))}
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-navy text-[11px] mb-1">Working Shift</label>
                    <select
                      className="field text-xs py-1"
                      value={testShift}
                      onChange={(e: any) => setTestShift(e.target.value)}
                    >
                      <option value="8h">Standard 8 Hours (1.0x)</option>
                      <option value="12h">12 Hours Extended (1.35x)</option>
                      <option value="24x7">24x7 Continuous ({viewing.shiftMultiplier24x7 || 1.8}x)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-navy text-[11px] mb-1">Contract Duration</label>
                    <select
                      className="field text-xs py-1"
                      value={testDuration}
                      onChange={(e: any) => setTestDuration(e.target.value)}
                    >
                      <option value="one_time">One Time (0%)</option>
                      <option value="monthly">Monthly Recurring ({viewing.discountMonthlyPct || 5}% Off)</option>
                      <option value="quarterly">Quarterly ({viewing.discountQuarterlyPct || 10}% Off)</option>
                      <option value="annual">Annual Contract ({viewing.discountAnnualPct || 15}% Off)</option>
                    </select>
                  </div>
                </div>

                {/* Calculation Result */}
                {(() => {
                  const sim = calculateSimulatedCost(viewing);
                  return (
                    <div className="mt-3 p-3 bg-white rounded-xl border border-gold/40 shadow-xs flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="text-[11px] text-muted-foreground block">
                          Base Quote: <span className="line-through">{formatINR(sim.base)}</span> ({sim.discountPct}% Discount Applied: -{formatINR(sim.discountAmount)})
                        </span>
                        <span className="text-xs font-bold text-navy">Estimated Customer Price:</span>
                      </div>
                      <div className="text-right">
                        <span className="font-display text-xl font-extrabold text-gold">
                          {formatINR(sim.finalPrice)}
                        </span>
                        <span className="text-[10px] text-muted-foreground block">exclusive of GST</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <a
                  href="/pricing-estimator"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gold font-bold text-xs underline hover:text-navy flex items-center gap-1"
                >
                  Open Website Pricing Calculator ↗
                </a>
                <button
                  onClick={() => setViewing(null)}
                  className="btn-base btn-primary py-1.5 px-4 text-xs"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

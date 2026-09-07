import { useMemo, useState } from "react";
import Icon from "@/components/ui/Icon.jsx";
import { useApp } from "@/store/AppStore.jsx";
import { formatINR, frequencies, sizePresets } from "@/data/mock.jsx";
import { useQuote } from "./SiteLayout.jsx";

const iconFor = { security: "shield", pest: "bug", tank: "droplet", painting: "roller" };

export default function Estimator() {
  const { pricing } = useApp();
  const { openQuote } = useQuote();
  const active = pricing.filter((p) => p.status === "Active");

  const [selected, setSelected] = useState(["security", "pest"]);
  const [size, setSize] = useState(25000);
  const [frequency, setFrequency] = useState("one-time");

  const toggle = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const freq = frequencies.find((f) => f.id === frequency) ?? frequencies[0];

  const breakdown = useMemo(
    () =>
      active
        .filter((rule) => selected.includes(rule.id))
        .map((rule) => {
          const raw = (rule.base + rule.perSqft * size) * freq.multiplier;
          return { id: rule.id, name: rule.name, cost: Math.max(raw, rule.minCharge) };
        }),
    [active, selected, size, freq],
  );

  const total = breakdown.reduce((sum, b) => sum + b.cost, 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-8">
      <div className="space-y-7 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-7">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-royal">Step 1</p>
          <h3 className="mt-1 text-lg font-bold text-navy">Select Service Categories</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {active.map((rule) => {
              const on = selected.includes(rule.id);
              return (
                <button
                  key={rule.id}
                  type="button"
                  onClick={() => toggle(rule.id)}
                  aria-pressed={on}
                  className={`grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                    on
                      ? "border-royal bg-royal/6 shadow-card"
                      : "border-border bg-background hover:border-royal/50"
                  }`}
                >
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${
                      on ? "gradient-navy text-white" : "bg-muted text-navy-700"
                    }`}
                  >
                    <Icon name={iconFor[rule.id] || "shield"} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-navy">{rule.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      Base {formatINR(rule.base)}
                    </span>
                  </span>
                  <span
                    className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border ${
                      on ? "border-royal bg-royal text-white" : "border-border"
                    }`}
                  >
                    {on && <Icon name="check" className="h-3 w-3" strokeWidth={3} />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-royal">Step 2</p>
          <div className="mt-1 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <h3 className="min-w-0 text-lg font-bold text-navy">Facility Size</h3>
            <span className="shrink-0 rounded-lg bg-navy px-3 py-1.5 font-display text-sm font-bold text-white">
              {size.toLocaleString("en-IN")} sq.ft
            </span>
          </div>
          <input
            type="range"
            min={100}
            max={100000}
            step={100}
            value={size}
            aria-label="Facility size in square feet"
            onChange={(e) => setSize(Number(e.target.value))}
            className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-[var(--safety)]"
          />
          <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
            <span>100 sq.ft</span>
            <span>100,000 sq.ft</span>
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
                    : "border-border text-navy-700 hover:border-royal hover:text-royal"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-royal">Step 3</p>
          <h3 className="mt-1 text-lg font-bold text-navy">Service Frequency</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {frequencies.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFrequency(f.id)}
                aria-pressed={frequency === f.id}
                className={`rounded-lg border px-4 py-2 text-xs font-semibold transition-all ${
                  frequency === f.id
                    ? "border-safety bg-safety/12 text-safety-dark"
                    : "border-border text-navy-700 hover:border-royal hover:text-royal"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <aside className="gradient-navy sticky top-24 h-fit rounded-2xl p-5 text-white shadow-lift sm:p-7">
        <p className="text-xs font-bold uppercase tracking-widest text-safety">Step 4</p>
        <h3 className="mt-1 text-lg font-bold text-white">Estimated Cost</h3>

        <div className="mt-5 space-y-3">
          {breakdown.length === 0 ? (
            <p className="rounded-xl bg-white/8 p-4 text-sm text-white/70">
              Select at least one service to see your indicative cost breakdown.
            </p>
          ) : (
            breakdown.map((b) => (
              <div key={b.id} className="flex items-center justify-between border-b border-white/12 pb-3 text-sm">
                <span className="text-white/75">{b.name}</span>
                <span className="font-semibold text-white">{formatINR(b.cost)}</span>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 rounded-xl bg-white/10 p-4">
          <p className="text-xs uppercase tracking-widest text-white/60">Estimated Service Cost</p>
          <p className="mt-1 font-display text-3xl font-extrabold text-safety sm:text-4xl">
            {formatINR(total)}
          </p>
          <p className="mt-1 text-xs text-white/60">
            {freq.label} · {size.toLocaleString("en-IN")} sq.ft
          </p>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-white/55">
          This is an indicative estimate. Final pricing may vary based on site inspection, scope of work
          and service requirements.
        </p>

        <button
          className="btn-base btn-accent mt-5 w-full"
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
          Request Detailed Quote
        </button>
      </aside>
    </div>
  );
}

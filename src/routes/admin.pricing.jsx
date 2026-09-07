import { createFileRoute } from "@tanstack/react-router";
import AdminLayout, { AdminGuard, StatusPill, Toast, useToast } from "@/components/admin/AdminLayout.jsx";
import Icon from "@/components/ui/Icon.jsx";
import { useApp } from "@/store/AppStore.jsx";
import { formatINR } from "@/data/mock.jsx";

export const Route = createFileRoute("/admin/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing Rules | Diamond Admin" },
      { name: "description", content: "Edit the base rates, per sq.ft rates and minimum charges used by the estimator." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Pricing Rules | Diamond Admin" },
      { property: "og:description", content: "Restricted demonstration admin area." },
    ],
  }),
  component: () => (
    <AdminGuard>
      <PricingAdmin />
    </AdminGuard>
  ),
});

const SAMPLE_SIZE = 25000;

function PricingAdmin() {
  const { pricing, updatePricing } = useApp();
  const [toast, setToast] = useToast();

  const preview = (rule) =>
    Math.max(rule.minCharge || 0, (Number(rule.base) || 0) + (Number(rule.perSqft) || 0) * SAMPLE_SIZE);

  const num = (rule, key) => (e) => {
    const value = e.target.value === "" ? 0 : Number(e.target.value);
    if (Number.isNaN(value)) return;
    updatePricing(rule.id, { [key]: value });
  };

  return (
    <AdminLayout
      title="Pricing Estimator Rules"
      description="These rates drive the public cost estimator instantly"
    >
      <div className="mb-5 flex items-start gap-3 rounded-2xl border border-royal/20 bg-royal/6 p-4">
        <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0 text-royal" />
        <p className="text-xs leading-relaxed text-navy-700">
          Estimate per service = base price + (per sq.ft rate × facility size), never below the minimum
          charge. Frequency discounts are applied afterwards on the public estimator. Preview below is for a{" "}
          {SAMPLE_SIZE.toLocaleString("en-IN")} sq.ft facility, one-time.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {pricing.map((rule) => (
          <section key={rule.id} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-display text-base font-extrabold text-navy">{rule.name}</h2>
              <StatusPill value={rule.status} />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="text-sm">
                <span className="mb-1.5 block font-semibold text-navy-700">Base Price (₹)</span>
                <input
                  type="number"
                  min="0"
                  className="field"
                  value={rule.base}
                  onChange={num(rule, "base")}
                />
              </label>
              <label className="text-sm">
                <span className="mb-1.5 block font-semibold text-navy-700">Per Sq.Ft Price (₹)</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="field"
                  value={rule.perSqft}
                  onChange={num(rule, "perSqft")}
                />
              </label>
              <label className="text-sm">
                <span className="mb-1.5 block font-semibold text-navy-700">Minimum Charge (₹)</span>
                <input
                  type="number"
                  min="0"
                  className="field"
                  value={rule.minCharge}
                  onChange={num(rule, "minCharge")}
                />
              </label>
              <label className="text-sm">
                <span className="mb-1.5 block font-semibold text-navy-700">Service Status</span>
                <select
                  className="field"
                  value={rule.status}
                  onChange={(e) => {
                    updatePricing(rule.id, { status: e.target.value });
                    setToast(`${rule.name} marked ${e.target.value}`);
                  }}
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </label>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-mist p-4">
              <span className="text-xs font-semibold text-muted-foreground">
                Preview at {SAMPLE_SIZE.toLocaleString("en-IN")} sq.ft
              </span>
              <span className="font-display text-lg font-extrabold text-navy">{formatINR(preview(rule))}</span>
            </div>

            <div className="mt-4">
              <button className="btn-base btn-ghost-navy" onClick={() => setToast(`${rule.name} rates saved`)}>
                <Icon name="check" className="h-4 w-4" /> Save Rates
              </button>
            </div>
          </section>
        ))}
      </div>

      <Toast message={toast} />
    </AdminLayout>
  );
}

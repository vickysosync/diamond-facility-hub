"use client";

import { useEffect, useState } from "react";
import AdminLayout, { Toast, useToast } from "@/components/admin/AdminLayout";
import ImageUpload from "@/components/admin/ImageUpload";
import Icon from "@/components/ui/Icon";

export default function AdminCompanyPage() {
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, showToast] = useToast();

  const loadCompany = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/company");
      const data = await res.json();
      if (data && !data.error) setForm(data);
    } catch (err) {
      console.error("Failed to load company details:", err);
      showToast("Error loading company profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompany();
  }, []);

  const setField = (key: string, value: any) => {
    setForm((f: any) => ({ ...f, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update company information");
      showToast("Company profile saved to MongoDB!");
    } catch (err: any) {
      showToast(err?.message || "Failed to save company information");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Company Profile & Legal Identity"
      description="Official director details, contact numbers, address and registrations for Diamond Integrated Facility Services LLP"
    >
      <Toast message={toastMessage} />

      {loading && !form ? (
        <div className="py-20 text-center">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent inline-block" />
          <p className="mt-2 text-xs font-semibold text-muted-foreground">Loading company profile from MongoDB…</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] text-xs">
          <div className="space-y-5">
            {/* Official Identity */}
            <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <h2 className="font-display text-sm font-bold text-navy pb-2.5 border-b border-border flex items-center gap-2">
                <Icon name="building" className="w-4 h-4 text-gold" /> Legal & Executive Details
              </h2>
              <div className="mt-3.5 grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-navy mb-1">Company Registered Name *</label>
                  <input
                    type="text"
                    required
                    className="field text-xs font-semibold"
                    value={form?.name || ""}
                    onChange={(e) => setField("name", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Managing Director Name</label>
                  <input
                    type="text"
                    className="field text-xs"
                    value={form?.directorName || ""}
                    onChange={(e) => setField("directorName", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Director Title</label>
                  <input
                    type="text"
                    className="field text-xs"
                    value={form?.directorTitle || "Managing Director"}
                    onChange={(e) => setField("directorTitle", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Short Brand Name</label>
                  <input
                    type="text"
                    className="field text-xs"
                    value={form?.shortName || ""}
                    onChange={(e) => setField("shortName", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Tagline</label>
                  <input
                    type="text"
                    className="field text-xs"
                    value={form?.tagline || ""}
                    onChange={(e) => setField("tagline", e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Official Contact & Phones */}
            <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <h2 className="font-display text-sm font-bold text-navy pb-2.5 border-b border-border flex items-center gap-2">
                <Icon name="phone" className="w-4 h-4 text-gold" /> Communication & Contact Channels
              </h2>
              <div className="mt-3.5 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-navy mb-1">Official Office Email *</label>
                  <input
                    type="email"
                    required
                    className="field text-xs"
                    value={form?.email || ""}
                    onChange={(e) => setField("email", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Office Landline Number</label>
                  <input
                    type="text"
                    className="field text-xs font-mono"
                    value={form?.landline || ""}
                    onChange={(e) => setField("landline", e.target.value)}
                    placeholder="020 45355544"
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Primary Mobile Hotline *</label>
                  <input
                    type="text"
                    required
                    className="field text-xs font-mono"
                    value={form?.phone || ""}
                    onChange={(e) => setField("phone", e.target.value)}
                    placeholder="+91 9689515295"
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Secondary Mobile Number</label>
                  <input
                    type="text"
                    className="field text-xs font-mono"
                    value={form?.altPhone || ""}
                    onChange={(e) => setField("altPhone", e.target.value)}
                    placeholder="+91 9970046704"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-navy mb-1">WhatsApp Dispatch Number</label>
                  <input
                    type="text"
                    className="field text-xs font-mono"
                    value={form?.whatsapp || ""}
                    onChange={(e) => setField("whatsapp", e.target.value)}
                    placeholder="+91 9689515295"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-navy mb-1">Official Office Address *</label>
                  <textarea
                    rows={2}
                    required
                    className="field text-xs"
                    value={form?.address || ""}
                    onChange={(e) => setField("address", e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Statutory & Banking */}
            <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <h2 className="font-display text-sm font-bold text-navy pb-2.5 border-b border-border flex items-center gap-2">
                <Icon name="briefcase" className="w-4 h-4 text-gold" /> Statutory & Compliance Registrations
              </h2>
              <div className="mt-3.5 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-navy mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    className="field text-xs font-mono"
                    value={form?.gstin || ""}
                    onChange={(e) => setField("gstin", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">PAN Number</label>
                  <input
                    type="text"
                    className="field text-xs font-mono"
                    value={form?.pan || ""}
                    onChange={(e) => setField("pan", e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-navy mb-1">LLPIN / CIN</label>
                  <input
                    type="text"
                    className="field text-xs font-mono"
                    value={form?.cin || ""}
                    onChange={(e) => setField("cin", e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Operating Hours */}
            <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <h2 className="font-display text-sm font-bold text-navy pb-2.5 border-b border-border flex items-center gap-2">
                <Icon name="gear" className="w-4 h-4 text-gold" /> Operating Hours
              </h2>
              <div className="mt-3.5 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-navy mb-1">Office Hours (Mon-Sat)</label>
                  <input
                    type="text"
                    className="field text-xs"
                    value={form?.workingHours || "Mon – Sat: 9:00 AM – 7:00 PM"}
                    onChange={(e) => setField("workingHours", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Emergency Operations</label>
                  <input
                    type="text"
                    className="field text-xs"
                    value={form?.emergencySupport || "24/7 Security & Control Room"}
                    onChange={(e) => setField("emergencySupport", e.target.value)}
                  />
                </div>
              </div>
            </section>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="btn-base btn-accent py-2.5 px-6 text-sm flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Icon name="check" className="w-4 h-4" /> Save Company Profile
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Live Preview Card */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card sticky top-24">
              <h3 className="font-display text-sm font-bold text-navy pb-2 border-b border-border">
                Live Card Preview
              </h3>
              <div className="mt-3.5 space-y-3">
                <div className="p-4 rounded-xl bg-navy text-white space-y-2">
                  <p className="font-bold text-sm text-gold">{form?.name}</p>
                  <p className="text-[11px] text-white/80">
                    <span className="font-semibold text-white">Director:</span> {form?.directorName}
                  </p>
                  <div className="pt-2 border-t border-white/10 text-[11px] space-y-1 text-white/75 font-mono">
                    <p>📞 {form?.landline}</p>
                    <p>📱 {form?.phone} / {form?.altPhone}</p>
                    <p>✉️ {form?.email}</p>
                  </div>
                  <p className="text-[10px] text-white/60 pt-2 border-t border-white/10 leading-relaxed">
                    📍 {form?.address}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-mist text-[11px] text-muted-foreground space-y-1">
                  <p><span className="font-bold text-navy">Working:</span> {form?.workingHours}</p>
                  <p><span className="font-bold text-navy">Emergency:</span> {form?.emergencySupport}</p>
                </div>
              </div>
            </div>
          </aside>
        </form>
      )}
    </AdminLayout>
  );
}

"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Icon from "@/components/ui/Icon";
import { facilityTypes, frequencies, formatINR } from "@/data/mock";

export interface QuotePrefill {
  company?: string;
  contact?: string;
  phone?: string;
  email?: string;
  facilityType?: string;
  facilitySize?: number;
  services?: string[];
  serviceCategory?: string;
  frequency?: string;
  estimatedCost?: number;
  date?: string;
  city?: string;
  notes?: string;
}

export interface QuoteModalProps {
  open: boolean;
  onClose: () => void;
  prefill?: QuotePrefill;
}

const emptyForm = {
  company: "",
  contact: "",
  phone: "",
  email: "",
  facilityType: "",
  facilitySize: 5000,
  services: [] as string[],
  serviceCategory: "Security Guard Services",
  frequency: "Monthly",
  date: "",
  city: "Pune",
  notes: "",
};

export default function QuoteModal({ open, onClose, prefill }: QuoteModalProps) {
  const [form, setForm] = useState({ ...emptyForm, ...prefill });
  const [categories, setCategories] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ quoteId: string } | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/service-categories");
        const data = await res.json();
        if (Array.isArray(data)) setCategories(data);
      } catch (e) {
        // Fallback
      }
    }
    loadCategories();
  }, []);

  const set = (k: string, v: string | number) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const toggleService = (name: string) =>
    setForm((f) => {
      const exists = f.services.includes(name);
      const next = exists ? f.services.filter((s) => s !== name) : [...f.services, name];
      return {
        ...f,
        services: next,
        serviceCategory: next[0] || f.serviceCategory,
      };
    });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.contact.trim()) e.contact = "Contact person name is required";
    if (!/^[0-9+\-\s]{8,15}$/.test(form.phone.trim())) e.phone = "Enter a valid phone number";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = "Enter a valid email address";
    if (!form.facilityType) e.facilityType = "Select a facility type";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      const payload = {
        contactPerson: form.contact.trim(),
        name: form.contact.trim(),
        companyName: form.company.trim() || form.contact.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        selectedServices: form.services.length > 0 ? form.services : [form.serviceCategory || "Security Guard Services"],
        serviceCategory: form.services[0] || form.serviceCategory || "Security Guard Services",
        facilityType: form.facilityType || "Corporate Office",
        facilitySize: Number(form.facilitySize) || 0,
        frequency: form.frequency || "Monthly",
        city: form.city || "Pune",
        estimatedCost: prefill?.estimatedCost ?? 0,
        estimatedPrice: prefill?.estimatedCost ?? 0,
        preferredDate: form.date,
        notes: form.notes,
      };

      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit quote request");

      setSubmittedData({ quoteId: data.quoteId || data.quote?.quoteId || "DIF-2026" });
    } catch (err: any) {
      console.error("Quote submission error:", err);
      setErrors({ form: err?.message || "Failed to submit quote request. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const close = () => {
    onClose();
    setTimeout(() => {
      setSubmittedData(null);
      setForm({ ...emptyForm, ...prefill });
      setErrors({});
    }, 200);
  };

  const err = (k: string) => errors[k] && <p className="mt-1 text-xs text-destructive">{errors[k]}</p>;

  return (
    <Modal open={open} onClose={close} title={submittedData ? "Quote Request Registered" : "Request a Detailed Facility Quote"}>
      {submittedData ? (
        <div className="py-4 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500 text-white shadow-lg">
            <Icon name="check" className="h-8 w-8" strokeWidth={3} />
          </span>
          <h4 className="mt-4 font-display text-xl font-bold text-navy">Quote Request Received!</h4>
          
          <div className="my-4 p-4 rounded-xl bg-gold/10 border border-gold/30 inline-block shadow-2xs">
            <span className="text-[11px] text-muted-foreground uppercase font-bold block">Your Official Reference ID</span>
            <span className="font-mono text-xl font-extrabold text-gold tracking-wider">{submittedData.quoteId}</span>
          </div>

          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted-foreground">
            A formal quote confirmation has been dispatched to your email. Our operations management team at Diamond Integrated Facility Services will review your site specifications and contact you shortly.
          </p>
          <button className="btn-base btn-live-navy mt-6 px-8 text-xs font-bold rounded-xl shadow-md" onClick={close}>
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-4 text-xs">
          {prefill?.estimatedCost ? (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-gold/10 border border-gold/30 p-3.5 shadow-2xs">
              <span className="text-xs font-semibold text-navy">Calculated Estimator Benchmark</span>
              <span className="font-display text-lg font-extrabold text-gold">
                {formatINR(prefill.estimatedCost)}
              </span>
            </div>
          ) : null}

          {errors.form && (
            <p className="p-2.5 rounded-lg bg-destructive/10 text-destructive font-semibold text-xs border border-destructive/20">
              {errors.form}
            </p>
          )}

          <div className="grid gap-3.5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block font-bold text-navy" htmlFor="q-contact">
                Contact Person Name *
              </label>
              <input
                id="q-contact"
                className="field text-xs bg-slate-50/70 border-slate-200 rounded-xl focus:bg-white"
                value={form.contact}
                onChange={(e) => set("contact", e.target.value)}
                placeholder="e.g., Rajesh Sharma"
              />
              {err("contact")}
            </div>
            <div>
              <label className="mb-1.5 block font-bold text-navy" htmlFor="q-company">
                Company / Society Name
              </label>
              <input
                id="q-company"
                className="field text-xs bg-slate-50/70 border-slate-200 rounded-xl focus:bg-white"
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
                placeholder="e.g., Tech Park / Housing Society"
              />
              {err("company")}
            </div>
            <div>
              <label className="mb-1.5 block font-bold text-navy" htmlFor="q-phone">
                Mobile Number *
              </label>
              <input
                id="q-phone"
                className="field text-xs font-mono bg-slate-50/70 border-slate-200 rounded-xl focus:bg-white"
                inputMode="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+91 9876543210"
              />
              {err("phone")}
            </div>
            <div>
              <label className="mb-1.5 block font-bold text-navy" htmlFor="q-email">
                Email Address *
              </label>
              <input
                id="q-email"
                className="field text-xs bg-slate-50/70 border-slate-200 rounded-xl focus:bg-white"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="client@example.com"
              />
              {err("email")}
            </div>
            <div>
              <label className="mb-1.5 block font-bold text-navy" htmlFor="q-ftype">
                Facility Type *
              </label>
              <select
                id="q-ftype"
                className="field text-xs bg-slate-50/70 border-slate-200 rounded-xl focus:bg-white"
                value={form.facilityType}
                onChange={(e) => set("facilityType", e.target.value)}
              >
                <option value="">Select facility type</option>
                {facilityTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {err("facilityType")}
            </div>
            <div>
              <label className="mb-1.5 block font-bold text-navy" htmlFor="q-size">
                Facility Area (sq.ft)
              </label>
              <input
                id="q-size"
                className="field text-xs bg-slate-50/70 border-slate-200 rounded-xl focus:bg-white"
                type="number"
                min="100"
                value={form.facilitySize}
                onChange={(e) => set("facilitySize", Number(e.target.value))}
              />
            </div>
            <div>
              <label className="mb-1.5 block font-bold text-navy" htmlFor="q-freq">
                Contract Frequency
              </label>
              <select
                id="q-freq"
                className="field text-xs bg-slate-50/70 border-slate-200 rounded-xl focus:bg-white"
                value={form.frequency}
                onChange={(e) => set("frequency", e.target.value)}
              >
                {frequencies.map((f) => (
                  <option key={f.id} value={f.label}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block font-bold text-navy" htmlFor="q-city">
                City / Location
              </label>
              <input
                id="q-city"
                className="field text-xs bg-slate-50/70 border-slate-200 rounded-xl focus:bg-white"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="Pune"
              />
            </div>
          </div>

          <fieldset className="pt-1">
            <legend className="mb-2 font-bold text-navy flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Service Requirements
            </legend>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto no-scrollbar p-2.5 bg-slate-50 rounded-2xl border border-slate-200">
              {(categories.length > 0 ? categories : [
                { name: "Security Guard Services" },
                { name: "Housekeeping Services" },
                { name: "Property Management" },
                { name: "Pest Control Services" },
                { name: "Facility Management Solutions" },
              ]).map((s: any) => {
                const active = form.services.includes(s.name);
                return (
                  <button
                    type="button"
                    key={s._id || s.name}
                    onClick={() => toggleService(s.name)}
                    aria-pressed={active}
                    className={`rounded-full border px-3.5 py-1.5 text-[11px] font-semibold transition-all duration-200 cursor-pointer ${
                      active
                        ? "border-gold bg-gradient-to-r from-gold to-gold-dark text-white shadow-[0_0_12px_rgba(217,155,56,0.4)] scale-102"
                        : "border-slate-200 bg-white text-navy hover:border-gold/60 hover:bg-gold/5 shadow-2xs"
                    }`}
                  >
                    {active ? "✓ " : ""}{s.name}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div>
            <label className="mb-1.5 block font-bold text-navy" htmlFor="q-notes">
              Specific Site Notes / Special Instructions
            </label>
            <textarea
              id="q-notes"
              rows={2}
              className="field text-xs bg-slate-50/70 border-slate-200 rounded-xl focus:bg-white"
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Shift timings, number of guards required, equipment needed..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-base btn-live-gold w-full py-3.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 rounded-xl shadow-lg group cursor-pointer"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none animate-[shimmer-sweep_3.5s_infinite]" />
            {submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent relative z-10" />
                <span className="relative z-10">Submitting Quote Request…</span>
              </>
            ) : (
              <>
                <span className="relative z-10">Submit Quote Request</span>
                <Icon name="arrow" className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
          </button>
          <p className="text-center text-[10px] text-muted-foreground">
            Directly logged to Diamond Integrated Facility Services LLP CRM with instant notification dispatch.
          </p>
        </form>
      )}
    </Modal>
  );
}

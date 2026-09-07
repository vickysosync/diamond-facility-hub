import { useState } from "react";
import Modal from "@/components/ui/Modal.jsx";
import Icon from "@/components/ui/Icon.jsx";
import { useApp } from "@/store/AppStore.jsx";
import { facilityTypes, frequencies, formatINR } from "@/data/mock.jsx";

const emptyForm = {
  company: "",
  contact: "",
  phone: "",
  email: "",
  facilityType: "",
  facilitySize: 5000,
  services: [],
  frequency: "One Time",
  date: "",
  city: "Pune",
  notes: "",
};

export default function QuoteModal({ open, onClose, prefill }) {
  const { addQuote, services } = useApp();
  const [form, setForm] = useState({ ...emptyForm, ...prefill });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const toggleService = (name) =>
    setForm((f) => ({
      ...f,
      services: f.services.includes(name)
        ? f.services.filter((s) => s !== name)
        : [...f.services, name],
    }));

  const validate = () => {
    const e = {};
    if (!form.company.trim()) e.company = "Company name is required";
    if (!form.contact.trim()) e.contact = "Contact person is required";
    if (!/^[0-9+\-\s]{8,15}$/.test(form.phone.trim())) e.phone = "Enter a valid phone number";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = "Enter a valid email address";
    if (!form.facilityType) e.facilityType = "Select a facility type";
    if (form.services.length === 0) e.services = "Select at least one service";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      addQuote({
        company: form.company,
        contact: form.contact,
        phone: form.phone,
        email: form.email,
        services: form.services,
        facilitySize: Number(form.facilitySize) || 0,
        estimatedCost: prefill?.estimatedCost ?? 0,
        facilityType: form.facilityType,
        frequency: form.frequency,
        preferredDate: form.date,
        city: form.city,
        notes: form.notes,
      });
      setSubmitting(false);
      setDone(true);
    }, 700);
  };

  const close = () => {
    onClose();
    setTimeout(() => {
      setDone(false);
      setForm({ ...emptyForm, ...prefill });
      setErrors({});
    }, 200);
  };

  const err = (k) => errors[k] && <p className="mt-1 text-xs text-destructive">{errors[k]}</p>;

  return (
    <Modal open={open} onClose={close} title={done ? "Request received" : "Request a Detailed Quote"}>
      {done ? (
        <div className="py-4 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/10 text-success">
            <Icon name="check" className="h-8 w-8" strokeWidth={2.2} />
          </span>
          <h4 className="mt-5 font-display text-xl font-bold text-navy">Thank You!</h4>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Your quote request has been recorded for demonstration purposes. Our team will contact you
            using the details provided.
          </p>
          <button className="btn-base btn-navy mt-6" onClick={close}>
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-4">
          {prefill?.estimatedCost ? (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-muted p-4">
              <span className="text-sm font-medium text-navy-700">Your estimator result</span>
              <span className="font-display text-xl font-extrabold text-royal">
                {formatINR(prefill.estimatedCost)}
              </span>
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-navy" htmlFor="q-company">
                Company Name *
              </label>
              <input id="q-company" className="field" value={form.company} onChange={(e) => set("company", e.target.value)} />
              {err("company")}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-navy" htmlFor="q-contact">
                Contact Person *
              </label>
              <input id="q-contact" className="field" value={form.contact} onChange={(e) => set("contact", e.target.value)} />
              {err("contact")}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-navy" htmlFor="q-phone">
                Phone *
              </label>
              <input id="q-phone" className="field" inputMode="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              {err("phone")}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-navy" htmlFor="q-email">
                Email *
              </label>
              <input id="q-email" className="field" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
              {err("email")}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-navy" htmlFor="q-ftype">
                Facility Type *
              </label>
              <select id="q-ftype" className="field" value={form.facilityType} onChange={(e) => set("facilityType", e.target.value)}>
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
              <label className="mb-1.5 block text-xs font-semibold text-navy" htmlFor="q-size">
                Facility Size (sq.ft)
              </label>
              <input id="q-size" className="field" type="number" min="100" value={form.facilitySize} onChange={(e) => set("facilitySize", e.target.value)} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-navy" htmlFor="q-freq">
                Service Frequency
              </label>
              <select id="q-freq" className="field" value={form.frequency} onChange={(e) => set("frequency", e.target.value)}>
                {frequencies.map((f) => (
                  <option key={f.id} value={f.label}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-navy" htmlFor="q-date">
                Preferred Service Date
              </label>
              <input id="q-date" className="field" type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-navy" htmlFor="q-city">
                City
              </label>
              <input id="q-city" className="field" value={form.city} onChange={(e) => set("city", e.target.value)} />
            </div>
          </div>

          <fieldset>
            <legend className="mb-2 text-xs font-semibold text-navy">Selected Services *</legend>
            <div className="flex flex-wrap gap-2">
              {services.map((s) => {
                const active = form.services.includes(s.name);
                return (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => toggleService(s.name)}
                    aria-pressed={active}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      active
                        ? "border-royal bg-royal text-white"
                        : "border-border bg-background text-navy-700 hover:border-royal"
                    }`}
                  >
                    {s.name}
                  </button>
                );
              })}
            </div>
            {err("services")}
          </fieldset>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-navy" htmlFor="q-notes">
              Additional Requirements
            </label>
            <textarea id="q-notes" rows={3} className="field" value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </div>

          <button type="submit" disabled={submitting} className="btn-base btn-accent w-full">
            {submitting ? "Submitting..." : "Submit Quote Request"}
          </button>
          <p className="text-center text-[11px] text-muted-foreground">
            Demonstration form — submissions are stored in your browser only.
          </p>
        </form>
      )}
    </Modal>
  );
}

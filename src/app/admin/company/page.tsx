"use client";

import { useEffect, useState } from "react";
import AdminLayout, { AdminGuard, Toast, useToast } from "@/components/admin/AdminLayout";
import Icon from "@/components/ui/Icon";
import { useApp } from "@/store/AppStore";

function CompanyContent() {
  const { company, updateCompany } = useApp();
  const [form, setForm] = useState(company);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useToast();

  useEffect(() => {
    setForm(company);
  }, [company]);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f: any) => ({ ...f, [key]: e.target.value }));

  const setHour = (index: number, key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f: any) => ({
      ...f,
      businessHours: f.businessHours.map((row: any, i: number) =>
        i === index ? { ...row, [key]: e.target.value } : row,
      ),
    }));

  const addHour = () =>
    setForm((f: any) => ({ ...f, businessHours: [...f.businessHours, { day: "", hours: "" }] }));

  const removeHour = (index: number) =>
    setForm((f: any) => ({ ...f, businessHours: f.businessHours.filter((_: any, i: number) => i !== index) }));

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name?.trim()) next.name = "Company name is required";
    if (!form.address?.trim()) next.address = "Address is required";
    if (!/^[0-9+\-\s()]{6,20}$/.test(form.phone?.trim() ?? "")) next.phone = "Enter a valid phone number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email?.trim() ?? "")) next.email = "Enter a valid email";
    if (!form.about?.trim()) next.about = "About text is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setToast("Please fix the highlighted fields");
      return;
    }
    updateCompany({
      ...form,
      businessHours: form.businessHours.filter((row: any) => row.day.trim() || row.hours.trim()),
    });
    setToast("Company information updated across the website");
  };

  const Field = ({ label, name, children }: { label: string; name: string; children: React.ReactNode }) => (
    <label className="block text-sm">
      <span className="mb-1.5 block font-semibold text-navy-700">{label}</span>
      {children}
      {errors[name] && <span className="mt-1 block text-xs font-semibold text-destructive">{errors[name]}</span>}
    </label>
  );

  return (
    <AdminLayout
      title="Company Information"
      description="These details feed the header, contact page and footer instantly"
    >
      <form onSubmit={save} className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h2 className="font-display text-base font-extrabold text-navy">Business Identity</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Company Name" name="name">
                <input className="field" value={form.name ?? ""} onChange={set("name")} />
              </Field>
              <Field label="Short Name (logo)" name="shortName">
                <input className="field" value={form.shortName ?? ""} onChange={set("shortName")} />
              </Field>
              <Field label="Tagline" name="tagline">
                <input className="field" value={form.tagline ?? ""} onChange={set("tagline")} />
              </Field>
              <Field label="City" name="city">
                <input className="field" value={form.city ?? ""} onChange={set("city")} />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h2 className="font-display text-base font-extrabold text-navy">Contact Details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Phone" name="phone">
                <input className="field" value={form.phone ?? ""} onChange={set("phone")} />
              </Field>
              <Field label="Email" name="email">
                <input className="field" type="email" value={form.email ?? ""} onChange={set("email")} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Address" name="address">
                  <textarea rows={3} className="field" value={form.address ?? ""} onChange={set("address")} />
                </Field>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h2 className="font-display text-base font-extrabold text-navy">Company Copy</h2>
            <div className="mt-4 grid gap-4">
              <Field label="About Us" name="about">
                <textarea rows={4} className="field" value={form.about ?? ""} onChange={set("about")} />
              </Field>
              <Field label="Business Description" name="businessDescription">
                <textarea
                  rows={3}
                  className="field"
                  value={form.businessDescription ?? ""}
                  onChange={set("businessDescription")}
                />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-base font-extrabold text-navy">Business Hours</h2>
              <button type="button" className="btn-base btn-ghost-navy" onClick={addHour}>
                <Icon name="plus" className="h-4 w-4" /> Add Row
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {form.businessHours?.length ? (
                form.businessHours.map((row: any, i: number) => (
                  <div key={i} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                    <input
                      className="field"
                      placeholder="Monday – Saturday"
                      value={row.day}
                      onChange={setHour(i, "day")}
                      aria-label={`Days row ${i + 1}`}
                    />
                    <input
                      className="field"
                      placeholder="9:00 AM – 6:00 PM"
                      value={row.hours}
                      onChange={setHour(i, "hours")}
                      aria-label={`Hours row ${i + 1}`}
                    />
                    <button
                      type="button"
                      className="rounded-lg border border-border p-2.5 text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
                      onClick={() => removeHour(i)}
                      aria-label={`Remove hours row ${i + 1}`}
                    >
                      <Icon name="trash" className="h-4 w-4" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No business hours added yet.</p>
              )}
            </div>
          </section>

          <div className="flex flex-wrap gap-2">
            <button type="submit" className="btn-base btn-accent">
              <Icon name="check" className="h-4 w-4" /> Save Company Information
            </button>
            <button type="button" className="btn-base btn-ghost-navy" onClick={() => setForm(company)}>
              Reset Changes
            </button>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-card p-5 shadow-card lg:sticky lg:top-24">
          <h2 className="font-display text-base font-extrabold text-navy">Live Preview</h2>
          <p className="mt-1 text-xs text-muted-foreground">How this appears on the public contact section.</p>
          <div className="mt-4 space-y-3 rounded-xl bg-mist p-4 text-sm">
            <p className="font-display font-extrabold text-navy">{form.name}</p>
            <p className="flex gap-2 text-navy-700">
              <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-royal" />
              <span>{form.address}</span>
            </p>
            <p className="flex gap-2 text-navy-700">
              <Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0 text-royal" />
              <span>{form.phone}</span>
            </p>
            <p className="flex gap-2 break-all text-navy-700">
              <Icon name="mail" className="mt-0.5 h-4 w-4 shrink-0 text-royal" />
              <span>{form.email}</span>
            </p>
            <div className="border-t border-border pt-3">
              {form.businessHours?.map((row: any, i: number) => (
                <p key={i} className="flex justify-between gap-3 text-xs text-navy-700">
                  <span className="font-semibold">{row.day}</span>
                  <span>{row.hours}</span>
                </p>
              ))}
            </div>
          </div>
        </aside>
      </form>

      <Toast message={toast} />
    </AdminLayout>
  );
}

export default function AdminCompanyPage() {
  return (
    <AdminGuard>
      <CompanyContent />
    </AdminGuard>
  );
}

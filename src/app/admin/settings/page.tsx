"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout, { AdminGuard, Toast, useToast } from "@/components/admin/AdminLayout";
import Icon from "@/components/ui/Icon";
import { ConfirmDialog } from "@/components/ui/Modal";
import { useApp } from "@/store/AppStore";

const PREFS_KEY = "difs-prefs-v1";

const defaultPrefs: Record<string, any> = {
  quoteAlerts: true,
  messageAlerts: true,
  weeklySummary: false,
  showEstimator: true,
  showTestimonials: true,
  autoReplyNote: "Thank you for contacting Diamond. Our team will respond within one business day.",
};

function SettingsContent() {
  const { services, portfolio, quotes, messages, testimonials, resetDemoData, logout } = useApp();
  const router = useRouter();
  const [prefs, setPrefs] = useState(defaultPrefs);
  const [confirmReset, setConfirmReset] = useState(false);
  const [toast, setToast] = useToast();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (raw) setPrefs((p) => ({ ...p, ...JSON.parse(raw) }));
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  const savePrefs = (next: any) => {
    setPrefs(next);
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  };

  const toggle = (key: string, label: string) => () => {
    const next = { ...prefs, [key]: !prefs[key] };
    savePrefs(next);
    setToast(`${label} ${next[key] ? "enabled" : "disabled"}`);
  };

  const signOut = () => {
    logout();
    router.push("/admin/login");
  };

  const stats = [
    { label: "Services", value: services.length },
    { label: "Portfolio Projects", value: portfolio.length },
    { label: "Testimonials", value: testimonials.length },
    { label: "Quote Requests", value: quotes.length },
    { label: "Contact Messages", value: messages.length },
  ];

  const toggles = [
    { key: "quoteAlerts", title: "New quote request alerts", desc: "Highlight new estimator submissions on the dashboard." },
    { key: "messageAlerts", title: "New contact message alerts", desc: "Flag unread enquiries from the contact page." },
    { key: "weeklySummary", title: "Weekly lead summary", desc: "Show a rolled-up weekly lead panel (demonstration only)." },
    { key: "showEstimator", title: "Show pricing estimator publicly", desc: "Controls visibility of the cost estimator promo on the site." },
    { key: "showTestimonials", title: "Show testimonials publicly", desc: "Controls visibility of the client testimonials carousel." },
  ];

  return (
    <AdminLayout title="Settings" description="Account, preferences and demonstration data controls">
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-display text-base font-extrabold text-navy">Admin Account</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            This panel uses hardcoded demonstration credentials — no backend or database is connected.
          </p>
          <dl className="mt-4 space-y-3 rounded-xl bg-mist p-4 text-sm">
            <div className="flex flex-wrap justify-between gap-2">
              <dt className="font-semibold text-navy-700">Email</dt>
              <dd className="break-all text-navy">admin@diamondfacility.com</dd>
            </div>
            <div className="flex flex-wrap justify-between gap-2">
              <dt className="font-semibold text-navy-700">Password</dt>
              <dd className="text-navy">admin123</dd>
            </div>
            <div className="flex flex-wrap justify-between gap-2">
              <dt className="font-semibold text-navy-700">Role</dt>
              <dd className="text-navy">Administrator (demo)</dd>
            </div>
          </dl>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="btn-base btn-ghost-navy" onClick={signOut}>
              <Icon name="logout" className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-display text-base font-extrabold text-navy">Current Demo Data</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Everything is stored in your browser only, so changes stay on this device.
          </p>
          <ul className="mt-4 space-y-2">
            {stats.map((s) => (
              <li
                key={s.label}
                className="flex items-center justify-between rounded-xl bg-mist px-4 py-2.5 text-sm"
              >
                <span className="font-semibold text-navy-700">{s.label}</span>
                <span className="font-display font-extrabold text-navy">{s.value}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-card lg:col-span-2">
          <h2 className="font-display text-base font-extrabold text-navy">Preferences</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {toggles.map((t) => (
              <button
                key={t.key}
                type="button"
                role="switch"
                aria-checked={prefs[t.key]}
                onClick={toggle(t.key, t.title)}
                className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                  prefs[t.key] ? "border-royal/40 bg-royal/6" : "border-border bg-background hover:border-royal/30"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors ${
                    prefs[t.key] ? "bg-success" : "bg-muted-foreground/35"
                  }`}
                >
                  <span
                    className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${
                      prefs[t.key] ? "translate-x-4" : ""
                    }`}
                  />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-navy">{t.title}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{t.desc}</span>
                </span>
              </button>
            ))}
          </div>

          <label className="mt-4 block text-sm">
            <span className="mb-1.5 block font-semibold text-navy-700">Default enquiry reply note</span>
            <textarea
              rows={3}
              className="field"
              value={prefs.autoReplyNote}
              onChange={(e) => setPrefs({ ...prefs, autoReplyNote: e.target.value })}
            />
          </label>
          <div className="mt-4">
            <button
              className="btn-base btn-accent"
              onClick={() => {
                savePrefs(prefs);
                setToast("Preferences saved");
              }}
            >
              <Icon name="check" className="h-4 w-4" /> Save Preferences
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 lg:col-span-2">
          <h2 className="font-display text-base font-extrabold text-navy">Reset Demonstration Data</h2>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-navy-700">
            This restores the original sample services, portfolio projects, testimonials, pricing rules, quote
            requests, messages and company information. Any edits you made in this session will be lost.
          </p>
          <button
            className="btn-base mt-4 bg-destructive text-destructive-foreground hover:brightness-110"
            onClick={() => setConfirmReset(true)}
          >
            <Icon name="trash" className="h-4 w-4" /> Reset All Demo Data
          </button>
        </section>
      </div>

      <ConfirmDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={() => {
          resetDemoData();
          setToast("Demonstration data restored");
        }}
        title="Reset demonstration data?"
        message="All services, projects, testimonials, pricing rules, quotes, messages and company details will return to their original sample values."
      />

      <Toast message={toast} />
    </AdminLayout>
  );
}

export default function AdminSettingsPage() {
  return (
    <AdminGuard>
      <SettingsContent />
    </AdminGuard>
  );
}

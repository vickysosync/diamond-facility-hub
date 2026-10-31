"use client";

import { useState } from "react";
import AdminLayout, { Toast, useToast } from "@/components/admin/AdminLayout";
import Icon from "@/components/ui/Icon";
import { ConfirmDialog } from "@/components/ui/Modal";

export default function AdminSettingsPage() {
  const [confirmReset, setConfirmReset] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [toastMessage, showToast] = useToast();

  const handleReseed = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Seed failed");
      showToast("MongoDB Atlas refreshed and re-seeded with official data!");
    } catch (err: any) {
      showToast(err?.message || "Failed to reseed database");
    } finally {
      setSeeding(false);
      setConfirmReset(false);
    }
  };

  return (
    <AdminLayout
      title="System Settings & Service Integrations"
      description="Production backend configurations, database status, and operational controls"
    >
      <Toast message={toastMessage} />

      <div className="grid gap-5 lg:grid-cols-2 text-xs">
        {/* Security & Access Session */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-display text-sm font-bold text-navy pb-2.5 border-b border-border flex items-center gap-2">
            <Icon name="shield" className="w-4 h-4 text-gold" /> Authentication & Admin Credentials
          </h2>
          <div className="mt-3.5 space-y-3">
            <p className="text-muted-foreground leading-relaxed">
              Admin authentication is protected with signed HTTP-only JWT cookies (<span className="font-mono text-navy font-semibold">diamond_admin_session</span>) and <span className="font-mono text-navy font-semibold">bcryptjs</span> 12-round salt hashing.
            </p>
            <div className="p-3 rounded-xl bg-mist font-mono text-[11px] space-y-1">
              <p><span className="text-muted-foreground">Admin Login Email:</span> <span className="text-navy font-bold">admin@diamondifs.com</span></p>
              <p><span className="text-muted-foreground">Default Access Password:</span> <span className="text-navy font-bold">admin123</span></p>
              <p><span className="text-muted-foreground">Role:</span> <span className="text-gold font-bold">Super Admin</span></p>
            </div>
          </div>
        </section>

        {/* Database Re-seeder */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-display text-sm font-bold text-navy pb-2.5 border-b border-border flex items-center gap-2">
            <Icon name="layers" className="w-4 h-4 text-gold" /> Database Synchronization & Default Master Seeding
          </h2>
          <div className="mt-3.5 space-y-3">
            <p className="text-muted-foreground leading-relaxed">
              If you ever need to reset or verify all 11 official service categories, company legal profile, default pricing formulas, and baseline data in MongoDB Atlas, trigger an idempotent seed synchronization.
            </p>
            <button
              type="button"
              disabled={seeding}
              onClick={() => setConfirmReset(true)}
              className="btn-base btn-secondary py-2 px-4 text-xs font-bold flex items-center gap-2"
            >
              <Icon name="sliders" className="w-4 h-4 text-gold" /> Sync & Re-Seed Default Master Data
            </button>
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={handleReseed}
        title="Sync Database with Master Catalog?"
        message="This will ensure all 11 official service categories, pricing rules, and official company details are populated in MongoDB Atlas."
      />
    </AdminLayout>
  );
}

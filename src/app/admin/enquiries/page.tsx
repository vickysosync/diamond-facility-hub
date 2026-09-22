"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout, { EmptyState, StatusPill, Toast, useToast } from "@/components/admin/AdminLayout";
import Modal from "@/components/ui/Modal";
import Icon from "@/components/ui/Icon";

const statuses = ["New", "Read", "Replied", "Closed"];
const filters = ["All", ...statuses];

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [toastMessage, showToast] = useToast();

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/enquiries");
      const data = await res.json();
      if (Array.isArray(data)) setEnquiries(data);
    } catch (err) {
      console.error("Failed to load enquiries:", err);
      showToast("Error loading enquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const updateStatus = async (enq: any, newStatus: string) => {
    try {
      const res = await fetch(`/api/enquiries/${enq._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      showToast(`Enquiry marked as ${newStatus}`);
      setEnquiries((prev) =>
        prev.map((e) => (e._id === enq._id ? { ...e, status: newStatus } : e))
      );
      if (detail && detail._id === enq._id) {
        setDetail({ ...detail, status: newStatus });
      }
    } catch (err: any) {
      showToast(err?.message || "Failed to update status");
    }
  };

  const openDetail = (enq: any) => {
    setDetail(enq);
    setAdminNotes(enq.adminNotes || "");
    if (enq.status === "New") {
      updateStatus(enq, "Read");
    }
  };

  const saveAdminNotes = async () => {
    if (!detail) return;
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/enquiries/${detail._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes }),
      });
      if (!res.ok) throw new Error("Failed to save notes");
      showToast("Admin notes updated.");
      setEnquiries((prev) =>
        prev.map((e) => (e._id === detail._id ? { ...e, adminNotes } : e))
      );
    } catch (err: any) {
      showToast(err?.message || "Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  };

  const list = useMemo(() => {
    return enquiries.filter((e) => {
      const matchFilter = filter === "All" || e.status === filter;
      const term = search.toLowerCase().trim();
      const matchSearch =
        !term ||
        (e.enquiryId && e.enquiryId.toLowerCase().includes(term)) ||
        (e.name && e.name.toLowerCase().includes(term)) ||
        (e.company && e.company.toLowerCase().includes(term)) ||
        (e.phone && e.phone.includes(term)) ||
        (e.email && e.email.toLowerCase().includes(term));
      return matchFilter && matchSearch;
    });
  }, [enquiries, filter, search]);

  return (
    <AdminLayout
      title="Contact Enquiries Management"
      description="Inbound contact submissions with automated ENQ-2026-XXXXX tracking"
      actions={
        <button
          onClick={loadEnquiries}
          className="btn-base btn-secondary text-xs flex items-center gap-1.5 py-1.5 px-3"
        >
          <Icon name="sliders" className="w-3.5 h-3.5" /> Refresh List
        </button>
      }
    >
      <Toast message={toastMessage} />

      {/* Filter and Search Bar */}
      <div className="mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
                filter === f
                  ? "border-gold bg-gold text-white shadow-xs"
                  : "border-border bg-card text-navy hover:border-gold/60"
              }`}
            >
              {f}
              <span className="ml-1.5 opacity-75 font-normal">
                {f === "All" ? enquiries.length : enquiries.filter((e) => e.status === f).length}
              </span>
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            className="field text-xs py-1.5"
            placeholder="Search Enquiry ID, Name, Phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent inline-block" />
          <p className="mt-2 text-xs font-semibold text-muted-foreground">Loading enquiries from MongoDB…</p>
        </div>
      ) : list.length === 0 ? (
        <EmptyState message="No contact enquiries found matching your filter." />
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[850px]">
              <thead className="bg-mist/70 border-b border-border text-navy font-bold">
                <tr>
                  <th className="p-3.5">Enquiry ID</th>
                  <th className="p-3.5">Customer Name</th>
                  <th className="p-3.5">Email & Phone</th>
                  <th className="p-3.5">Service Interest</th>
                  <th className="p-3.5">Message Excerpt</th>
                  <th className="p-3.5">Received Date</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {list.map((enq) => (
                  <tr key={enq._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3.5">
                      <button
                        onClick={() => openDetail(enq)}
                        className="font-mono font-bold text-navy hover:text-gold hover:underline"
                      >
                        {enq.enquiryId}
                      </button>
                    </td>
                    <td className="p-3.5">
                      <p className="font-bold text-navy">{enq.name}</p>
                      {enq.company && (
                        <p className="text-[11px] text-muted-foreground">{enq.company}</p>
                      )}
                    </td>
                    <td className="p-3.5">
                      <a href={`tel:${enq.phone}`} className="font-semibold text-navy hover:text-gold block">
                        {enq.phone}
                      </a>
                      <span className="text-[11px] text-muted-foreground">{enq.email}</span>
                    </td>
                    <td className="p-3.5 font-medium text-navy">
                      {enq.serviceInterest || "General Facility Inquiry"}
                    </td>
                    <td className="p-3.5 max-w-xs text-muted-foreground line-clamp-1">
                      {enq.message}
                    </td>
                    <td className="p-3.5 text-muted-foreground">
                      {new Date(enq.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="p-3.5">
                      <select
                        className="field text-[11px] py-1 px-2 w-auto font-semibold"
                        value={enq.status || "New"}
                        onChange={(e) => updateStatus(enq, e.target.value)}
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => openDetail(enq)}
                        className="bg-white border border-border shadow-2xs hover:bg-navy hover:text-white text-navy text-xs font-semibold py-1.5 px-3 rounded-lg inline-flex items-center gap-1.5 transition-all"
                      >
                        <Icon name="eye" className="w-3.5 h-3.5 text-gold" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enquiry Detail Modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl my-8 rounded-2xl bg-card p-6 shadow-lift border border-border max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <div>
                <span className="font-mono text-xs font-bold text-gold block">{detail.enquiryId}</span>
                <h2 className="font-display text-lg font-bold text-navy">
                  Enquiry from {detail.name}
                </h2>
              </div>
              <button onClick={() => setDetail(null)} className="p-1 text-muted-foreground hover:text-navy">
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            <dl className="grid gap-3.5 sm:grid-cols-2 bg-mist/50 p-4 rounded-xl border border-border mb-4">
              <div>
                <dt className="text-muted-foreground font-semibold text-[11px]">Full Name</dt>
                <dd className="font-bold text-navy text-sm mt-0.5">{detail.name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-semibold text-[11px]">Company Name</dt>
                <dd className="font-bold text-navy text-sm mt-0.5">{detail.company || "Individual / Direct"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-semibold text-[11px]">Phone</dt>
                <dd className="font-bold text-navy text-sm mt-0.5">
                  <a href={`tel:${detail.phone}`} className="text-gold hover:underline">
                    {detail.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-semibold text-[11px]">Email Address</dt>
                <dd className="font-bold text-navy text-sm mt-0.5">
                  <a href={`mailto:${detail.email}`} className="text-gold hover:underline">
                    {detail.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-semibold text-[11px]">Service Interest</dt>
                <dd className="font-bold text-navy mt-0.5">{detail.serviceInterest || "General Inquiry"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-semibold text-[11px]">Submission Date</dt>
                <dd className="font-bold text-navy mt-0.5">{new Date(detail.createdAt).toLocaleString("en-IN")}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-muted-foreground font-semibold text-[11px]">Client Message</dt>
                <dd className="font-medium text-navy-700 mt-1 leading-relaxed bg-white p-3 rounded-lg border border-border whitespace-pre-wrap">
                  {detail.message}
                </dd>
              </div>
            </dl>

            {/* Admin Notes */}
            <div className="mb-4">
              <label className="block font-bold text-navy mb-1">Follow-up Status Notes</label>
              <textarea
                rows={3}
                className="field text-xs"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Log response actions, phone call outcomes, assigned operations coordinator..."
              />
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  disabled={savingNotes}
                  onClick={saveAdminNotes}
                  className="btn-base btn-secondary text-xs py-1 px-3"
                >
                  {savingNotes ? "Saving Notes…" : "Update Notes"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-bold">Status:</span>
                <select
                  className="field text-xs py-1.5 px-3 font-semibold"
                  value={detail.status || "New"}
                  onChange={(e) => updateStatus(detail, e.target.value)}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${detail.email}`}
                  className="btn-base btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5"
                >
                  <Icon name="mail" className="w-3.5 h-3.5 text-gold" /> Reply by Email
                </a>
                <a
                  href={`tel:${detail.phone}`}
                  className="btn-base btn-accent text-xs py-2 px-3.5 flex items-center gap-1.5"
                >
                  <Icon name="phone" className="w-3.5 h-3.5" /> Call
                </a>
                <button
                  type="button"
                  onClick={() => setDetail(null)}
                  className="btn-base btn-secondary text-xs py-2 px-3"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

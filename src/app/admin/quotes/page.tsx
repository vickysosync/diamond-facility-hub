"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout, { EmptyState, StatusPill, Toast, useToast } from "@/components/admin/AdminLayout";
import Modal from "@/components/ui/Modal";
import Icon from "@/components/ui/Icon";
import { formatINR } from "@/data/mock";

const statuses = ["New", "Contacted", "Quoted", "Converted", "Closed"];
const filters = ["All", ...statuses];

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [toastMessage, showToast] = useToast();

  const loadQuotes = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/quotes");
      const data = await res.json();
      if (Array.isArray(data)) setQuotes(data);
    } catch (err) {
      console.error("Failed to load quotes:", err);
      showToast("Error loading quote requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuotes();
  }, []);

  const updateStatus = async (quote: any, newStatus: string) => {
    try {
      const res = await fetch(`/api/quotes/${quote._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      showToast(`Status updated to ${newStatus}`);
      setQuotes((prev) =>
        prev.map((q) => (q._id === quote._id ? { ...q, status: newStatus } : q))
      );
      if (detail && detail._id === quote._id) {
        setDetail({ ...detail, status: newStatus });
      }
    } catch (err: any) {
      showToast(err?.message || "Failed to update status");
    }
  };

  const openDetail = (q: any) => {
    setDetail(q);
    setAdminNotes(q.adminNotes || "");
  };

  const saveAdminNotes = async () => {
    if (!detail) return;
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/quotes/${detail._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes }),
      });
      if (!res.ok) throw new Error("Failed to save notes");
      showToast("Admin notes updated.");
      setQuotes((prev) =>
        prev.map((q) => (q._id === detail._id ? { ...q, adminNotes } : q))
      );
    } catch (err: any) {
      showToast(err?.message || "Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  };

  const list = useMemo(() => {
    return quotes.filter((q) => {
      const matchFilter = filter === "All" || q.status === filter;
      const term = search.toLowerCase().trim();
      const matchSearch =
        !term ||
        (q.quoteId && q.quoteId.toLowerCase().includes(term)) ||
        (q.companyName && q.companyName.toLowerCase().includes(term)) ||
        (q.name && q.name.toLowerCase().includes(term)) ||
        (q.phone && q.phone.includes(term)) ||
        (q.email && q.email.toLowerCase().includes(term));
      return matchFilter && matchSearch;
    });
  }, [quotes, filter, search]);

  return (
    <AdminLayout
      title="Quote Requests Management"
      description="Inbound quote requests with automated DIF-2026-XXXXX tracking"
      actions={
        <button
          onClick={loadQuotes}
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
                {f === "All" ? quotes.length : quotes.filter((q) => q.status === f).length}
              </span>
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            className="field text-xs py-1.5"
            placeholder="Search Quote ID, Company, Phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent inline-block" />
          <p className="mt-2 text-xs font-semibold text-muted-foreground">Loading quote requests from MongoDB…</p>
        </div>
      ) : list.length === 0 ? (
        <EmptyState message="No quote requests found matching your filter." />
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[850px]">
              <thead className="bg-mist/70 border-b border-border text-navy font-bold">
                <tr>
                  <th className="p-3.5">Quote ID</th>
                  <th className="p-3.5">Company / Client</th>
                  <th className="p-3.5">Phone & Email</th>
                  <th className="p-3.5">Category & Requirement</th>
                  <th className="p-3.5">Estimated Price</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {list.map((q) => (
                  <tr key={q._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3.5">
                      <button
                        onClick={() => openDetail(q)}
                        className="font-mono font-bold text-gold hover:underline"
                      >
                        {q.quoteId}
                      </button>
                    </td>
                    <td className="p-3.5">
                      <p className="font-bold text-navy">{q.companyName || q.name}</p>
                      <p className="text-[11px] text-muted-foreground">{q.name} ({q.designation || "Client"})</p>
                    </td>
                    <td className="p-3.5">
                      <a href={`tel:${q.phone}`} className="font-semibold text-navy hover:text-gold block">
                        {q.phone}
                      </a>
                      <span className="text-[11px] text-muted-foreground">{q.email}</span>
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <span className="px-2 py-0.5 rounded-full bg-gold/10 text-gold font-bold text-[10px] inline-block mb-1">
                        {q.serviceCategory}
                      </span>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">
                        {q.facilityType || "Commercial"} · {q.city || "Pune"}
                      </p>
                    </td>
                    <td className="p-3.5 font-bold text-navy">
                      {q.estimatedPrice ? formatINR(q.estimatedPrice) : "Custom"}
                    </td>
                    <td className="p-3.5 text-muted-foreground">
                      {new Date(q.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="p-3.5">
                      <select
                        className="field text-[11px] py-1 px-2 w-auto font-semibold"
                        value={q.status || "New"}
                        onChange={(e) => updateStatus(q, e.target.value)}
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
                        onClick={() => openDetail(q)}
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

      {/* Quote Detail Modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl my-8 rounded-2xl bg-card p-6 shadow-lift border border-border max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <div>
                <span className="font-mono text-xs font-bold text-gold block">{detail.quoteId}</span>
                <h2 className="font-display text-lg font-bold text-navy">
                  {detail.companyName || detail.name}
                </h2>
              </div>
              <button onClick={() => setDetail(null)} className="p-1 text-muted-foreground hover:text-navy">
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            <dl className="grid gap-3.5 sm:grid-cols-2 bg-mist/50 p-4 rounded-xl border border-border mb-4">
              <div>
                <dt className="text-muted-foreground font-semibold text-[11px]">Contact Person</dt>
                <dd className="font-bold text-navy text-sm mt-0.5">{detail.name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-semibold text-[11px]">Designation</dt>
                <dd className="font-bold text-navy text-sm mt-0.5">{detail.designation || "Not specified"}</dd>
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
                <dt className="text-muted-foreground font-semibold text-[11px]">Email</dt>
                <dd className="font-bold text-navy text-sm mt-0.5">
                  <a href={`mailto:${detail.email}`} className="text-gold hover:underline">
                    {detail.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-semibold text-[11px]">Service Category</dt>
                <dd className="font-bold text-navy mt-0.5">{detail.serviceCategory}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-semibold text-[11px]">Facility Type & City</dt>
                <dd className="font-bold text-navy mt-0.5">{detail.facilityType || "Commercial"} · {detail.city || "Pune"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-semibold text-[11px]">Facility Size / Staff Count</dt>
                <dd className="font-bold text-navy mt-0.5">
                  {detail.facilitySize ? `${Number(detail.facilitySize).toLocaleString("en-IN")} sq.ft` : ""}{" "}
                  {detail.numberOfStaff ? `(${detail.numberOfStaff} personnel)` : ""}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-semibold text-[11px]">Estimated Price</dt>
                <dd className="font-bold text-navy text-sm mt-0.5">
                  {detail.estimatedPrice ? formatINR(detail.estimatedPrice) : "Custom Assessment"}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-muted-foreground font-semibold text-[11px]">Additional Requirements / Scope</dt>
                <dd className="font-medium text-navy-700 mt-1 leading-relaxed bg-white p-2.5 rounded-lg border border-border">
                  {detail.message || detail.additionalRequirements || "No specific comments provided."}
                </dd>
              </div>
            </dl>

            {/* Internal Admin Notes */}
            <div className="mb-4">
              <label className="block font-bold text-navy mb-1">Internal Admin Notes & Follow-up History</label>
              <textarea
                rows={3}
                className="field text-xs"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Log customer discussions, revised quotation figures, site visit schedules..."
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
                  href={`tel:${detail.phone}`}
                  className="btn-base btn-accent text-xs py-2 px-4 flex items-center gap-1.5"
                >
                  <Icon name="phone" className="w-3.5 h-3.5" /> Call Customer
                </a>
                <button
                  type="button"
                  onClick={() => setDetail(null)}
                  className="btn-base btn-secondary text-xs py-2 px-4"
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

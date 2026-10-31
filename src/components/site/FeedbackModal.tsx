"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ open, onClose }: FeedbackModalProps) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [industry, setIndustry] = useState("Corporate Offices");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !review.trim()) {
      setError("Please provide both your name and feedback.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          company: company.trim() || "Client",
          role: role.trim() || "Facility Client",
          industry,
          rating,
          review: review.trim(),
          content: review.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit feedback");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || "Something went wrong while submitting. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setName("");
    setCompany("");
    setRole("");
    setIndustry("Corporate Offices");
    setRating(5);
    setReview("");
    setError(null);
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-lg my-8 rounded-3xl bg-white dark:bg-[#0c131f] p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border border-gold/30 text-navy dark:text-white before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-gold before:to-transparent overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          aria-label="Close feedback modal"
          className="absolute top-5 right-5 p-2 rounded-xl text-muted-foreground hover:text-navy dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        >
          <Icon name="x" className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 shadow-md">
              <Icon name="check" className="h-8 w-8" strokeWidth={2.5} />
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-navy dark:text-white">
              Thank You for Your Feedback!
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Your valuable review has been received. Our team will verify and publish it on our client showcase shortly.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="btn-base btn-live-gold px-7 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-md"
              >
                Done & Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-white/10">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold/15 text-gold border border-gold/30">
                <Icon name="star" className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-lg sm:text-xl font-black text-navy dark:text-white">
                  Share Your Experience
                </h2>
                <p className="text-xs text-muted-foreground">
                  Your feedback helps Diamond Integrated Facility Services serve you better
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
              {/* Star Rating Selector */}
              <div>
                <label className="block font-bold text-navy dark:text-slate-200 mb-1.5">
                  How would you rate our services? <span className="text-destructive">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        aria-label={`Rate ${star} stars`}
                        className="p-1 hover:scale-115 transition-transform cursor-pointer"
                      >
                        <svg
                          className={`h-7 w-7 transition-colors ${
                            star <= (hoverRating || rating)
                              ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]"
                              : "fill-slate-200 dark:fill-white/20 text-slate-300 dark:text-white/20"
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                  <span className="font-bold text-gold text-sm ml-2">
                    {hoverRating || rating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Name & Role */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-navy dark:text-slate-200 mb-1">
                    Your Full Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 px-3.5 py-2.5 text-xs text-navy dark:text-white focus:border-gold focus:outline-hidden transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy dark:text-slate-200 mb-1">
                    Designation / Role
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Facility Manager / Resident"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 px-3.5 py-2.5 text-xs text-navy dark:text-white focus:border-gold focus:outline-hidden transition-colors"
                  />
                </div>
              </div>

              {/* Company & Industry */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-navy dark:text-slate-200 mb-1">
                    Company / Society Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Infosys Ltd / Green Valley CHS"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 px-3.5 py-2.5 text-xs text-navy dark:text-white focus:border-gold focus:outline-hidden transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy dark:text-slate-200 mb-1">
                    Industry / Sector
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 px-3.5 py-2.5 text-xs text-navy dark:text-white focus:border-gold focus:outline-hidden transition-colors"
                  >
                    <option value="Corporate Offices">Corporate Offices</option>
                    <option value="Residential Societies">Residential Societies</option>
                    <option value="Commercial Buildings">Commercial Buildings</option>
                    <option value="Industrial Facilities">Industrial Facilities</option>
                    <option value="Hospitals & Healthcare">Hospitals & Healthcare</option>
                    <option value="Schools & Institutions">Schools & Institutions</option>
                    <option value="Warehouses & Logistics">Warehouses & Logistics</option>
                    <option value="Other Facilities">Other Facilities</option>
                  </select>
                </div>
              </div>

              {/* Feedback Message */}
              <div>
                <label className="block font-bold text-navy dark:text-slate-200 mb-1">
                  Your Detailed Review / Feedback <span className="text-destructive">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share your experience regarding our security, housekeeping, operations staff or overall facility support..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 px-3.5 py-2.5 text-xs text-navy dark:text-white focus:border-gold focus:outline-hidden transition-colors"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 text-muted-foreground hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-base btn-live-gold px-6 py-2.5 rounded-xl text-xs font-bold shadow-md inline-flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-navy border-t-transparent" />
                      <span>Submitting…</span>
                    </>
                  ) : (
                    <>
                      <Icon name="check" className="w-4 h-4" />
                      <span>Submit Review</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}


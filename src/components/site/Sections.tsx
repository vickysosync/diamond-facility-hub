"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { useApp } from "@/store/AppStore";
import { formatINR, processSteps, whyChooseUs } from "@/data/mock";
import { useQuote } from "./SiteLayout";

export interface SectionTitleProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  center?: boolean;
  light?: boolean;
}

export function SectionTitle({
  eyebrow = "",
  title = "",
  subtitle = "",
  center = false,
  light = false,
}: SectionTitleProps = {}) {
  return (
    <div className={`${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      {eyebrow && <p className={`eyebrow ${light ? "text-safety" : ""}`}>{eyebrow}</p>}
      <h2
        className={`mt-3 text-2xl font-extrabold sm:text-3xl lg:text-4xl ${
          light ? "text-white" : "text-navy"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-sm leading-relaxed sm:text-base ${light ? "text-white/70" : "text-muted-foreground"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export interface ServiceCardProps {
  service: {
    id?: string;
    slug: string;
    name: string;
    short: string;
    icon: string;
    image: string;
    features: string[];
    startingPrice: number;
    priceNote?: string;
    cta: string;
    [key: string]: any;
  };
}

export function ServiceCard({ service }: ServiceCardProps) {
  const { openQuote } = useQuote();
  return (
    <article className="card-lift group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <div className="relative h-44 overflow-hidden bg-muted">
        <img
          src={service.image}
          alt={`${service.name} by Diamond Integrated Facility Services in Pune`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
        <span className="absolute bottom-3 left-4 flex items-center gap-2 text-white">
          <Icon name={service.icon} className="h-5 w-5 text-safety" />
          <h3 className="font-display text-lg font-bold">{service.name}</h3>
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-sm leading-relaxed text-muted-foreground">{service.short}</p>
        <ul className="mt-4 space-y-1.5">
          {service.features.slice(0, 4).map((f) => (
            <li key={f} className="flex gap-2 text-sm text-navy-700">
              <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" strokeWidth={3} />
              {f}
            </li>
          ))}
        </ul>
        <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Starting from</p>
            <p className="font-display text-xl font-extrabold text-navy">
              {formatINR(service.startingPrice)}
            </p>
            <p className="text-[11px] text-muted-foreground">{service.priceNote}</p>
          </div>
          <Link
            href={`/services/${service.slug}`}
            className="btn-base btn-ghost-navy px-3 py-2 text-xs"
          >
            Learn More
          </Link>
        </div>
        <button className="btn-base btn-accent mt-3 w-full" onClick={() => openQuote({ services: [service.name] })}>
          {service.cta}
        </button>
      </div>
    </article>
  );
}

export function WhyChooseUs() {
  return (
    <section className="section-y bg-mist">
      <div className="container-x">
        <SectionTitle
          eyebrow="Why Diamond"
          title="Why Businesses Choose Diamond"
          subtitle="A single accountable partner for the services that keep your facility running."
          center
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {whyChooseUs.map((w) => (
            <div key={w.title} className="card-lift rounded-2xl border border-border bg-card p-6 shadow-card">
              <span className="grid h-11 w-11 place-items-center rounded-xl gradient-navy text-white">
                <Icon name={w.icon} />
              </span>
              <h3 className="mt-4 text-base font-bold text-navy">{w.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section className="section-y">
      <div className="container-x">
        <SectionTitle eyebrow="How it works" title="A Simple, Structured Onboarding" center />
        <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((s) => (
            <li key={s.no} className="relative rounded-2xl border border-border bg-card p-6 shadow-card">
              <span className="font-display text-3xl font-extrabold text-safety/40">{s.no}</span>
              <h3 className="mt-2 text-base font-bold text-navy">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Testimonials() {
  const [list, setList] = useState<any[]>([]);
  const [i, setI] = useState(0);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const res = await fetch("/api/testimonials");
        const data = await res.json();
        if (Array.isArray(data)) {
          setList(data.filter((t: any) => t.status === "Approved" || t.status === "Published"));
        }
      } catch (e) {}
    }
    loadTestimonials();
  }, []);

  useEffect(() => {
    if (list.length < 2) return;
    const id = setInterval(() => setI((v) => (v + 1) % list.length), 6000);
    return () => clearInterval(id);
  }, [list.length]);

  if (list.length === 0) return null;
  const t = list[i % list.length];

  return (
    <section className="section-y bg-navy text-white">
      <div className="container-x">
        <SectionTitle eyebrow="Verified Client Reviews" title="What Our Facility Clients Say" light center />
        <figure className="mx-auto mt-10 max-w-3xl rounded-2xl bg-white/8 p-6 text-center backdrop-blur sm:p-10 border border-white/10">
          <Icon name="quote" className="mx-auto h-8 w-8 text-gold" />
          <blockquote className="mt-4 text-sm leading-relaxed text-white/90 sm:text-base italic">
            “{t.content || t.review}”
          </blockquote>
          <figcaption className="mt-6">
            <p className="font-display text-base font-bold text-gold">{t.name}</p>
            <p className="text-xs text-white/60">
              {t.role ? `${t.role} · ` : ""}{t.company} {t.industry ? `(${t.industry})` : ""}
            </p>
            <div className="mt-2 flex justify-center gap-1">
              {Array.from({ length: t.rating || 5 }).map((_, k) => (
                <Icon key={k} name="star" className="h-4 w-4 text-gold" />
              ))}
            </div>
          </figcaption>
        </figure>
        <div className="mt-6 flex justify-center gap-2">
          {list.map((item, k) => (
            <button
              key={item._id || item.id || k}
              onClick={() => setI(k)}
              aria-label={`Show testimonial ${k + 1}`}
              className={`h-2 rounded-full transition-all ${
                k === i % list.length ? "w-7 bg-gold" : "w-2 bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTABanner() {
  const { openQuote } = useQuote();
  return (
    <section className="section-y bg-mist">
      <div className="container-x">
        <div className="bg-navy relative overflow-hidden rounded-3xl px-6 py-12 text-center shadow-lift sm:px-12 border border-gold/30">
          <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_80%_20%,#a3722e,transparent_55%)]" />
          <div className="relative">
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
              Looking for a Reliable Integrated Facility Partner in Pune?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-sm text-white/80 leading-relaxed">
              Tell us your property requirements and receive a transparent commercial quotation backed by single-point operations management.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button className="btn-base btn-accent font-bold" onClick={() => openQuote()}>
                Get Instant Quote
              </button>
              <a href="tel:+919689515295" className="btn-base btn-outline-light font-mono font-bold">
                <Icon name="phone" className="h-4 w-4 text-gold" /> +91 9689515295
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export interface IndustriesGridProps {
  limit?: number;
}

export function IndustriesGrid({ limit }: IndustriesGridProps = {}) {
  const [industries, setIndustries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInd() {
      try {
        const res = await fetch("/api/industries");
        const data = await res.json();
        if (Array.isArray(data)) {
          setIndustries(data.filter((i: any) => i.status !== "Inactive"));
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    loadInd();
  }, []);

  const list = limit ? industries.slice(0, limit) : industries;

  if (loading) {
    return (
      <div className="py-12 text-center text-xs text-muted-foreground">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-gold border-t-transparent inline-block" />
        <p className="mt-2">Loading target sectors…</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {list.map((ind) => (
        <div key={ind._id || ind.id} className="card-lift rounded-2xl border border-border bg-card p-5 shadow-card flex flex-col justify-between">
          <div>
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-gold/10 text-gold">
              <Icon name={ind.icon || "building"} />
            </span>
            <h3 className="mt-3 text-sm font-bold text-navy">{ind.name}</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{ind.description}</p>
          </div>
          {ind.servicesOffered?.length ? (
            <div className="mt-3 pt-2 border-t border-border/50 flex flex-wrap gap-1">
              {ind.servicesOffered.slice(0, 2).map((s: string) => (
                <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-mist font-medium text-navy">
                  {s}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function ContactDetails() {
  return (
    <div className="space-y-5 text-xs">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h3 className="font-display text-base font-bold text-navy">Diamond Integrated Facility Services LLP</h3>
        </div>
        <div className="mt-3 text-[11px] font-mono text-gold font-bold">
          Managing Director: Umesh Patil
        </div>
        <ul className="mt-4 space-y-3.5 text-xs">
          <li className="flex gap-3">
            <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <span className="text-muted-foreground leading-relaxed">
              Office No-A2, Sai Pritam Nagari, Chhatrapati Chowk, Rahatani-Kalewadi Link Road, Rahatani, Pune, Maharashtra, India - 411017
            </span>
          </li>
          <li className="flex gap-3">
            <Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <div className="space-y-1">
              <a href="tel:02045355544" className="font-bold text-navy hover:text-gold block font-mono">
                020 45355544 <span className="font-normal text-muted-foreground">(Office Landline)</span>
              </a>
              <a href="tel:+919689515295" className="font-semibold text-navy hover:text-gold block font-mono">
                +91 9689515295 <span className="font-normal text-muted-foreground">(Primary Mobile)</span>
              </a>
              <a href="tel:+919970046704" className="font-semibold text-navy hover:text-gold block font-mono">
                +91 9970046704 <span className="font-normal text-muted-foreground">(Operations Desk)</span>
              </a>
            </div>
          </li>
          <li className="flex gap-3">
            <Icon name="mail" className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <a href="mailto:info@diamondifs.com" className="break-all font-semibold text-navy hover:text-gold font-mono">
              info@diamondifs.com
            </a>
          </li>
        </ul>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <h3 className="flex items-center gap-2 font-display text-base font-bold text-navy">
          <Icon name="clock" className="h-4 w-4 text-gold" /> Operating Schedules
        </h3>
        <ul className="mt-4 space-y-2 text-xs">
          <li className="flex justify-between gap-4 border-b border-border pb-2">
            <span className="text-muted-foreground">Office Operations (Mon – Sat)</span>
            <span className="font-semibold text-navy">9:00 AM – 7:00 PM</span>
          </li>
          <li className="flex justify-between gap-4">
            <span className="text-muted-foreground">Security & Emergency Hotline</span>
            <span className="font-bold text-gold font-mono">24/7 Control Room</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export function ContactForm() {
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    service: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [sending, setSending] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadCats() {
      try {
        const res = await fetch("/api/service-categories");
        const data = await res.json();
        if (Array.isArray(data)) setCategories(data);
      } catch (e) {}
    }
    loadCats();
  }, []);

  const set = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!form.name.trim()) err.name = "Name is required";
    if (!/^[0-9+\-\s]{8,15}$/.test(form.phone.trim())) err.phone = "Enter a valid phone number";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) err.email = "Enter a valid email address";
    if (!form.service) err.service = "Select a service";
    if (form.message.trim().length < 10) err.message = "Please add a few more details (minimum 10 characters)";
    setErrors(err);
    if (Object.keys(err).length) return;

    setSending(true);
    try {
      const payload = {
        name: form.name.trim(),
        company: form.company.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        service: form.service,
        serviceInterest: form.service,
        message: form.message.trim(),
      };

      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit enquiry");

      setSubmittedId(data.enquiryId || data.enquiry?.enquiryId || "ENQ-2026");
    } catch (apiErr: any) {
      setErrors({ form: apiErr?.message || "Failed to send message. Please try again." });
    } finally {
      setSending(false);
    }
  };

  if (submittedId) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/8 p-8 text-center shadow-card">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-500 text-white">
          <Icon name="check" className="h-7 w-7" strokeWidth={3} />
        </span>
        <h3 className="mt-4 text-lg font-bold text-navy">Message Successfully Received!</h3>
        
        <div className="my-3.5 p-3.5 rounded-xl bg-gold/10 border border-gold/30 inline-block">
          <span className="text-[11px] text-muted-foreground uppercase font-bold block">Tracking Reference</span>
          <span className="font-mono text-lg font-extrabold text-gold tracking-wider">{submittedId}</span>
        </div>

        <p className="mt-2 text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
          Thank you for reaching out! Your inquiry has been registered in our central service desk and an acknowledgement email has been sent. Our coordinator will contact you promptly.
        </p>
        <button
          className="btn-base btn-ghost-navy mt-5 text-xs"
          onClick={() => {
            setForm({ name: "", company: "", phone: "", email: "", service: "", message: "" });
            setSubmittedId(null);
          }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <h3 className="font-display text-base font-bold text-navy">Send Us a Direct Message</h3>
      <p className="text-xs text-muted-foreground mt-1">Get in touch for customized facility management solutions in Pune & PCMC</p>
      
      {errors.form && (
        <p className="mt-3 p-2.5 rounded-lg bg-destructive/10 text-destructive font-semibold text-xs border border-destructive/20">
          {errors.form}
        </p>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1.5 block font-semibold text-navy-700">Full Name *</span>
          <input className="field text-xs" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g., Rajesh Sharma" />
          {errors.name && <span className="mt-1 block text-xs text-destructive">{errors.name}</span>}
        </label>
        <label className="text-sm">
          <span className="mb-1.5 block font-semibold text-navy-700">Company / Society Name</span>
          <input className="field text-xs" value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="e.g., IT Park / Society" />
        </label>
        <label className="text-sm">
          <span className="mb-1.5 block font-semibold text-navy-700">Phone Number *</span>
          <input className="field text-xs font-mono" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 9689515295" />
          {errors.phone && <span className="mt-1 block text-xs text-destructive">{errors.phone}</span>}
        </label>
        <label className="text-sm">
          <span className="mb-1.5 block font-semibold text-navy-700">Email Address *</span>
          <input className="field text-xs" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="client@company.com" />
          {errors.email && <span className="mt-1 block text-xs text-destructive">{errors.email}</span>}
        </label>
        <label className="text-sm sm:col-span-2">
          <span className="mb-1.5 block font-semibold text-navy-700">Service Required *</span>
          <select className="field text-xs" value={form.service} onChange={(e) => set("service", e.target.value)}>
            <option value="">Select a service category</option>
            {(categories.length > 0 ? categories : [
              { name: "Security Guard Services" },
              { name: "Housekeeping Services" },
              { name: "Property Management" },
              { name: "Pest Control Services" },
              { name: "Bouncer Services" },
              { name: "Man Power Supply" },
              { name: "Tank Cleaning, Gardening and Landscaping etc." },
              { name: "Facility Management Solutions" },
              { name: "CCTV Installation and Maintenance" },
              { name: "Plumbing, Electrical, Painting, Waterproofing" },
              { name: "Repair and Maintenance Services" }
            ]).map((s: any) => (
              <option key={s._id || s.name} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
          {errors.service && <span className="mt-1 block text-xs text-destructive">{errors.service}</span>}
        </label>
        <label className="text-sm sm:col-span-2">
          <span className="mb-1.5 block font-semibold text-navy-700">Detailed Message *</span>
          <textarea
            rows={4}
            className="field text-xs"
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder="Describe your site location, scope of services, shift timings and any specific facility requirements..."
          />
          {errors.message && <span className="mt-1 block text-xs text-destructive">{errors.message}</span>}
        </label>
      </div>
      <button type="submit" className="btn-base btn-accent mt-5 w-full sm:w-auto py-2.5 px-6 text-xs font-bold flex items-center justify-center gap-2" disabled={sending}>
        {sending ? (
          <>
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Sending Message…
          </>
        ) : (
          "Send Message to Diamond Team"
        )}
      </button>
    </form>
  );
}

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
      {eyebrow && (
        <div
          className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] shadow-xs backdrop-blur-xs ${
            light
              ? "border-gold/40 bg-gold/15 text-gold"
              : "border-gold/30 bg-gold/10 text-gold"
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-gold animate-pulse shadow-[0_0_6px_rgba(217,155,56,0.8)]" />
          <span>{eyebrow}</span>
        </div>
      )}
      <h2
        className={`mt-3 font-display text-2xl font-extrabold sm:text-3xl lg:text-4xl tracking-tight leading-tight ${
          light ? "text-white" : "text-navy"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-sm leading-relaxed sm:text-base ${light ? "text-slate-200" : "text-muted-foreground"}`}>
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
    <article className="card-border-beam group">
      <div className="card-border-beam-inner">
        <div>
          <div className="relative h-48 w-full overflow-hidden bg-navy/5 border-b border-border/60">
            <img
              src={service.image}
              alt={`${service.name} by Diamond Integrated Facility Services in Pune`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/40 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gold/20 backdrop-blur-md border border-gold/50 text-gold shadow-md">
                <Icon name={service.icon} className="h-4 w-4" />
              </span>
              <h3 className="font-display text-base sm:text-lg font-bold tracking-tight text-white drop-shadow-sm truncate">
                {service.name}
              </h3>
            </div>
          </div>
          <div className="p-5">
            <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-2">{service.short}</p>
            <ul className="mt-4 space-y-2">
              {service.features.slice(0, 4).map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-xs sm:text-sm text-navy-700 font-medium">
                  <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/20">
                    <Icon name="check" className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                  <span className="line-clamp-1">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="p-5 pt-0">
          <div className="flex items-end justify-between border-t border-slate-100 pt-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Starting from</p>
              <p className="font-display text-lg sm:text-xl font-extrabold text-navy">
                {formatINR(service.startingPrice)}
              </p>
              <p className="text-[10px] text-muted-foreground">{service.priceNote}</p>
            </div>
            <Link
              href={`/services/${service.slug}`}
              className="rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs font-semibold text-navy transition-all hover:border-gold hover:bg-gold/10 hover:text-gold shadow-2xs"
            >
              Learn More
            </Link>
          </div>
          <button
            className="btn-base btn-live-gold mt-3.5 w-full text-xs sm:text-sm font-bold py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 group/btn"
            onClick={() => openQuote({ services: [service.name] })}
          >
            {/* Specular live shimmer sweep */}
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none animate-[shimmer-sweep_3.5s_infinite]" />
            <span className="relative z-10">{service.cta}</span>
            <Icon name="arrow" className="relative z-10 h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </button>
        </div>
      </div>
    </article>
  );
}

export function WhyChooseUs() {
  return (
    <section className="section-y bg-mist relative overflow-hidden">
      <div className="container-x">
        <SectionTitle
          eyebrow="Why Diamond"
          title="Why Businesses Choose Diamond"
          subtitle="A single accountable partner for the services that keep your facility running seamlessly."
          center
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyChooseUs.map((w, idx) => (
            <div key={w.title} className="card-border-beam group">
              <div className="card-border-beam-inner p-6">
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-navy text-gold shadow-md border border-gold/30 transition-transform duration-300 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-navy group-hover:to-navy-800">
                    <Icon name={w.icon} className="h-6 w-6" />
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-300 group-hover:text-gold/60 transition-colors">
                    0{idx + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-bold text-navy group-hover:text-navy-800 transition-colors">{w.title}</h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">{w.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section className="section-y relative overflow-hidden">
      <div className="container-x">
        <SectionTitle
          eyebrow="How it works"
          title="A Simple, Structured Onboarding"
          subtitle="From site survey to ongoing SLA governance in four clear steps."
          center
        />
        <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((s) => (
            <li key={s.no} className="card-border-beam group list-none">
              <div className="card-border-beam-inner p-6">
                <div className="flex items-center justify-between">
                  <span className="font-display text-3xl sm:text-4xl font-extrabold text-gold/30 group-hover:text-gold/70 transition-colors">
                    {s.no}
                  </span>
                  <span className="h-2.5 w-2.5 rounded-full bg-gold/40 group-hover:bg-gold group-hover:shadow-[0_0_8px_rgba(217,155,56,0.8)] transition-all" />
                </div>
                <h3 className="mt-3 text-base font-bold text-navy group-hover:text-navy-800">{s.title}</h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </div>
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
  const avatarUrl = t.avatar || t.image;

  return (
    <section className="section-y bg-navy text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_50%_10%,#d99b38,transparent_60%)] pointer-events-none" />
      <div className="container-x relative z-10">
        <SectionTitle eyebrow="Verified Client Reviews" title="What Our Facility Clients Say" light center />
        <figure className="mx-auto mt-10 max-w-3xl rounded-3xl bg-[#0a1019]/80 p-6 text-center backdrop-blur-xl sm:p-10 border border-gold/35 shadow-[0_20px_50px_rgba(0,0,0,0.6)] before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-gold before:to-transparent relative overflow-hidden">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-gold/20 text-gold border border-gold/40 shadow-md">
            <Icon name="quote" className="h-6 w-6 text-gold fill-gold/20" />
          </div>

          <blockquote className="text-sm sm:text-base md:text-lg leading-relaxed text-white font-normal italic">
            “{t.content || t.review}”
          </blockquote>

          <figcaption className="mt-7 pt-5 border-t border-white/15">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={t.name}
                loading="lazy"
                decoding="async"
                className="mx-auto mb-3 h-14 w-14 rounded-full object-cover border-2 border-gold shadow-md"
              />
            ) : (
              <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-gold/20 border-2 border-gold/40 text-gold font-bold text-lg grid place-items-center">
                {t.name ? t.name.charAt(0).toUpperCase() : "C"}
              </div>
            )}
            <p className="font-display text-base sm:text-xl font-extrabold text-gold tracking-wide">{t.name}</p>
            <p className="text-xs sm:text-sm text-slate-200 font-medium mt-0.5">
              {t.role ? `${t.role} · ` : ""}{t.company || "Client"} {t.industry ? `(${t.industry})` : ""}
            </p>
            <div className="mt-3 flex justify-center gap-1.5 text-amber-400">
              {Array.from({ length: t.rating || 5 }).map((_, k) => (
                <svg key={k} className="h-4 w-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </figcaption>
        </figure>

        <div className="mt-8 flex justify-center gap-2">
          {list.map((item, k) => (
            <button
              key={item._id || item.id || k}
              onClick={() => setI(k)}
              aria-label={`Show testimonial ${k + 1}`}
              className={`h-2.5 rounded-full transition-all ${
                k === i % list.length ? "w-8 bg-gold shadow-[0_0_8px_rgba(217,155,56,0.8)]" : "w-2.5 bg-white/40 hover:bg-white/70"
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
    <section className="section-y bg-mist relative overflow-hidden">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-3xl border border-gold/40 bg-navy px-6 py-12 text-center shadow-[0_25px_50px_-12px_rgba(15,24,36,0.5)] sm:px-12 before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-gold before:to-transparent">
          {/* Ambient radial gold illumination */}
          <div className="absolute inset-0 opacity-25 [background:radial-gradient(circle_at_50%_20%,#d99b38,transparent_65%)] pointer-events-none" />
          
          <div className="relative z-10">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/15 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-gold shadow-xs backdrop-blur-xs">
              <span className="h-2 w-2 rounded-full bg-gold animate-pulse shadow-[0_0_6px_rgba(217,155,56,0.8)]" />
              <span>Partner With Pune&apos;s Facility Specialists</span>
            </div>

            <h2 className="mt-4 font-display text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl tracking-tight">
              Looking for a Reliable Integrated Facility Partner in Pune?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              Tell us your property requirements and receive a transparent commercial quotation backed by single-point operations management.
            </p>
            <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
              <button
                className="btn-base btn-live-gold font-bold px-7 py-3.5 rounded-xl text-xs sm:text-sm shadow-lg flex items-center gap-2 group"
                onClick={() => openQuote()}
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none animate-[shimmer-sweep_3.5s_infinite]" />
                <span className="relative z-10">Get Instant Quote</span>
                <Icon name="arrow" className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <a
                href="tel:+919689515295"
                className="btn-base btn-live-glass font-mono font-bold text-white px-6 py-3.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 border border-white/25 shadow-md"
              >
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

  const getIndustryImage = (ind: any) => {
    if (typeof ind.image === "object" && ind.image?.secure_url) {
      return ind.image.secure_url;
    }
    if (ind.image && !ind.image.includes("facility.jpg") && ind.image.startsWith("http")) {
      return ind.image;
    }
    if (ind.image && ind.image.startsWith("/images/industries/")) {
      return ind.image;
    }
    const slug = ind.slug || ind.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    if (slug) {
      return `/images/industries/${slug}.jpg`;
    }
    return "/images/facility.jpg";
  };

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {list.map((ind) => {
        const imgSrc = getIndustryImage(ind);
        const services = ind.servicesOffered || ind.serviceNames || [];

        return (
          <div key={ind._id || ind.id} className="card-border-beam group">
            <div className="card-border-beam-inner">
              <div>
                <div className="relative h-36 w-full overflow-hidden bg-navy/5 border-b border-border/60">
                  <img
                    src={imgSrc}
                    alt={ind.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/facility.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
                  <span className="absolute bottom-2.5 left-3 grid h-8 w-8 place-items-center rounded-lg bg-navy/90 text-gold shadow-md border border-gold/40 backdrop-blur-xs">
                    <Icon name={ind.icon || "building"} className="h-4 w-4" />
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="text-sm font-bold text-navy group-hover:text-gold transition-colors">
                    {ind.name}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                    {ind.description}
                  </p>
                </div>
              </div>

              {services.length > 0 ? (
                <div className="p-4 pt-0">
                  <div className="pt-2.5 border-t border-slate-100 flex flex-wrap gap-1">
                    {services.slice(0, 2).map((s: string) => (
                      <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-mist font-medium text-navy border border-slate-200/60">
                        {s}
                      </span>
                    ))}
                    {services.length > 2 && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-gold/10 text-gold font-bold border border-gold/20">
                        +{services.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ContactDetails() {
  return (
    <div className="space-y-5 text-xs">
      <div className="card-3d relative rounded-2xl border border-slate-200/85 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(15,24,36,0.06)] before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-gold/40 before:to-transparent">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h3 className="font-display text-base font-bold text-navy">Diamond Integrated Facility Services LLP</h3>
        </div>
        <div className="mt-3 text-[11px] font-mono text-gold font-bold flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          <span>Managing Director: Umesh Patil</span>
        </div>
        <ul className="mt-4 space-y-3.5 text-xs">
          <li className="flex gap-3">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gold/15 text-gold border border-gold/30">
              <Icon name="pin" className="h-4 w-4" />
            </span>
            <span className="text-muted-foreground leading-relaxed">
              Office No-A2, Sai Pritam Nagari, Chhatrapati Chowk, Rahatani-Kalewadi Link Road, Rahatani, Pune, Maharashtra, India - 411017
            </span>
          </li>
          <li className="flex gap-3">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gold/15 text-gold border border-gold/30">
              <Icon name="phone" className="h-4 w-4" />
            </span>
            <div className="space-y-1">
              <a href="tel:02045355544" className="font-bold text-navy hover:text-gold block font-mono transition-colors">
                020 45355544 <span className="font-normal text-muted-foreground">(Office Landline)</span>
              </a>
              <a href="tel:+919689515295" className="font-semibold text-navy hover:text-gold block font-mono transition-colors">
                +91 9689515295 <span className="font-normal text-muted-foreground">(Primary Mobile)</span>
              </a>
              <a href="tel:+919970046704" className="font-semibold text-navy hover:text-gold block font-mono transition-colors">
                +91 9970046704 <span className="font-normal text-muted-foreground">(Operations Desk)</span>
              </a>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gold/15 text-gold border border-gold/30">
              <Icon name="mail" className="h-4 w-4" />
            </span>
            <a href="mailto:info@diamondifs.com" className="break-all font-semibold text-navy hover:text-gold font-mono transition-colors">
              info@diamondifs.com
            </a>
          </li>
        </ul>
      </div>

      <div className="card-3d relative rounded-2xl border border-slate-200/85 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(15,24,36,0.06)] before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-gold/40 before:to-transparent">
        <h3 className="flex items-center gap-2 font-display text-base font-bold text-navy">
          <Icon name="clock" className="h-4 w-4 text-gold" /> Operating Schedules
        </h3>
        <ul className="mt-4 space-y-2 text-xs">
          <li className="flex justify-between gap-4 border-b border-border pb-2">
            <span className="text-muted-foreground">Office Operations (Mon – Sat)</span>
            <span className="font-semibold text-navy">9:00 AM – 7:00 PM</span>
          </li>
          <li className="flex justify-between items-center gap-4">
            <span className="text-muted-foreground">Security & Emergency Hotline</span>
            <span className="inline-flex items-center gap-1.5 font-bold text-gold font-mono bg-gold/10 px-2.5 py-1 rounded-full border border-gold/30">
              <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
              24/7 Control Room
            </span>
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
      <div className="card-3d relative rounded-2xl border border-emerald-500/40 bg-emerald-500/5 p-8 text-center shadow-card">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-500 text-white shadow-lg">
          <Icon name="check" className="h-7 w-7" strokeWidth={3} />
        </span>
        <h3 className="mt-4 font-display text-lg font-bold text-navy">Message Successfully Received!</h3>
        
        <div className="my-3.5 p-3.5 rounded-xl bg-gold/10 border border-gold/30 inline-block">
          <span className="text-[11px] text-muted-foreground uppercase font-bold block">Tracking Reference</span>
          <span className="font-mono text-lg font-extrabold text-gold tracking-wider">{submittedId}</span>
        </div>

        <p className="mt-2 text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
          Thank you for reaching out! Your inquiry has been registered in our central service desk and an acknowledgement email has been sent. Our coordinator will contact you promptly.
        </p>
        <button
          className="btn-base btn-ghost-navy mt-5 text-xs font-semibold"
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
    <form onSubmit={submit} noValidate className="card-3d relative rounded-2xl border border-slate-200/85 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(15,24,36,0.06)] before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-gold/40 before:to-transparent">
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
      <button
        type="submit"
        className="btn-base btn-live-gold mt-5 w-full sm:w-auto py-3 px-8 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 rounded-xl shadow-md group"
        disabled={sending}
      >
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none animate-[shimmer-sweep_3.5s_infinite]" />
        {sending ? (
          <>
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent relative z-10" />
            <span className="relative z-10">Sending Message…</span>
          </>
        ) : (
          <>
            <span className="relative z-10">Send Message to Diamond Team</span>
            <Icon name="arrow" className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  );
}

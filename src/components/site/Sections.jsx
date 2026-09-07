import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import Icon from "@/components/ui/Icon.jsx";
import { useApp } from "@/store/AppStore.jsx";
import { formatINR, processSteps, whyChooseUs } from "@/data/mock.jsx";
import { useQuote } from "./SiteLayout.jsx";

export function SectionTitle({ eyebrow, title, subtitle, center = false, light = false }) {
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

export function ServiceCard({ service }) {
  const { openQuote } = useQuote();
  return (
    <article className="card-lift group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <div className="relative h-44 overflow-hidden">
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
            to="/services/$slug"
            params={{ slug: service.slug }}
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
  const { testimonials } = useApp();
  const list = testimonials.filter((t) => t.status === "Published");
  const [i, setI] = useState(0);

  useEffect(() => {
    if (list.length < 2) return;
    const id = setInterval(() => setI((v) => (v + 1) % list.length), 6000);
    return () => clearInterval(id);
  }, [list.length]);

  if (list.length === 0) return null;
  const t = list[i % list.length];

  return (
    <section className="section-y gradient-navy">
      <div className="container-x">
        <SectionTitle eyebrow="Testimonials" title="What Our Clients Say" light center />
        <figure className="mx-auto mt-10 max-w-3xl rounded-2xl bg-white/8 p-6 text-center backdrop-blur sm:p-10">
          <Icon name="quote" className="mx-auto h-8 w-8 text-safety" />
          <blockquote className="mt-4 text-base leading-relaxed text-white/85 sm:text-lg">
            “{t.review}”
          </blockquote>
          <figcaption className="mt-6">
            <p className="font-display text-base font-bold text-white">{t.name}</p>
            <p className="text-sm text-white/60">
              {t.company} · {t.industry}
            </p>
            <p className="mt-2 flex justify-center gap-1">
              {Array.from({ length: t.rating }).map((_, k) => (
                <Icon key={k} name="star" className="h-4 w-4 text-safety" />
              ))}
            </p>
          </figcaption>
        </figure>
        <div className="mt-6 flex justify-center gap-2">
          {list.map((item, k) => (
            <button
              key={item.id}
              onClick={() => setI(k)}
              aria-label={`Show testimonial ${k + 1}`}
              className={`h-2 rounded-full transition-all ${
                k === i % list.length ? "w-7 bg-safety" : "w-2 bg-white/30"
              }`}
            />
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-white/40">
          Testimonials shown are demonstration content.
        </p>
      </div>
    </section>
  );
}

export function CTABanner() {
  const { company } = useApp();
  const { openQuote } = useQuote();
  return (
    <section className="section-y bg-mist">
      <div className="container-x">
        <div className="gradient-navy relative overflow-hidden rounded-3xl px-6 py-12 text-center shadow-lift sm:px-12">
          <div className="absolute inset-0 opacity-25 [background:radial-gradient(circle_at_80%_20%,white,transparent_45%)]" />
          <div className="relative">
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
              Looking for a Reliable Facility Services Partner?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/75 sm:text-base">
              Tell us about your facility requirements and get a customized service estimate.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button className="btn-base btn-accent" onClick={() => openQuote()}>
                Get Free Quote
              </button>
              <a href={`tel:${company.phone}`} className="btn-base btn-outline-light">
                <Icon name="phone" className="h-4 w-4" /> Call Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function IndustriesGrid({ limit }) {
  const { industries } = useApp();
  const list = limit ? industries.slice(0, limit) : industries;
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {list.map((ind) => (
        <div key={ind.id} className="card-lift rounded-2xl border border-border bg-card p-5 shadow-card">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-royal/10 text-royal">
            <Icon name={ind.icon} />
          </span>
          <h3 className="mt-3 text-sm font-bold text-navy">{ind.name}</h3>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{ind.description}</p>
        </div>
      ))}
    </div>
  );
}

export function ContactDetails() {
  const { company } = useApp();
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <h3 className="font-display text-base font-bold text-navy">{company.name}</h3>
        <ul className="mt-4 space-y-4 text-sm">
          <li className="flex gap-3">
            <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-safety" />
            <span className="text-muted-foreground">{company.address}</span>
          </li>
          <li className="flex gap-3">
            <Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0 text-safety" />
            <a href={`tel:${company.phone}`} className="font-semibold text-navy hover:text-royal">
              {company.phone}
            </a>
          </li>
          <li className="flex gap-3">
            <Icon name="mail" className="mt-0.5 h-4 w-4 shrink-0 text-safety" />
            <a href={`mailto:${company.email}`} className="break-all font-semibold text-navy hover:text-royal">
              {company.email}
            </a>
          </li>
        </ul>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <h3 className="flex items-center gap-2 font-display text-base font-bold text-navy">
          <Icon name="clock" className="h-4 w-4 text-safety" /> Business Hours
        </h3>
        <ul className="mt-4 space-y-2 text-sm">
          {company.businessHours.map((b) => (
            <li key={b.day} className="flex justify-between gap-4 border-b border-border pb-2 last:border-0">
              <span className="text-muted-foreground">{b.day}</span>
              <span className="font-semibold text-navy">{b.hours}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ContactForm() {
  const { addMessage, services } = useApp();
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    service: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (!form.name.trim()) err.name = "Name is required";
    if (!/^[0-9+\-\s]{8,15}$/.test(form.phone.trim())) err.phone = "Enter a valid phone number";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) err.email = "Enter a valid email address";
    if (!form.service) err.service = "Select a service";
    if (form.message.trim().length < 10) err.message = "Please add a few more details";
    setErrors(err);
    if (Object.keys(err).length) return;
    setSending(true);
    setTimeout(() => {
      addMessage(form);
      setSending(false);
      setDone(true);
    }, 600);
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-success/30 bg-success/8 p-8 text-center shadow-card">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success text-white">
          <Icon name="check" className="h-7 w-7" strokeWidth={3} />
        </span>
        <h3 className="mt-4 text-lg font-bold text-navy">Message Received</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you! Your message has been recorded for demonstration purposes. Our team will contact you
          using the details provided.
        </p>
        <button
          className="btn-base btn-ghost-navy mt-6"
          onClick={() => {
            setForm({ name: "", company: "", phone: "", email: "", service: "", message: "" });
            setDone(false);
          }}
        >
          Send another message
        </button>
      </div>
    );
  }


  return (
    <form onSubmit={submit} noValidate className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <h3 className="font-display text-base font-bold text-navy">Send Us a Message</h3>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1.5 block font-semibold text-navy-700">Name *</span>
          <input className="field" value={form.name} onChange={(e) => set("name", e.target.value)} />
          {errors.name && <span className="mt-1 block text-xs text-destructive">{errors.name}</span>}
        </label>
        <label className="text-sm">
          <span className="mb-1.5 block font-semibold text-navy-700">Company</span>
          <input className="field" value={form.company} onChange={(e) => set("company", e.target.value)} />
        </label>
        <label className="text-sm">
          <span className="mb-1.5 block font-semibold text-navy-700">Phone *</span>
          <input className="field" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          {errors.phone && <span className="mt-1 block text-xs text-destructive">{errors.phone}</span>}
        </label>
        <label className="text-sm">
          <span className="mb-1.5 block font-semibold text-navy-700">Email *</span>
          <input className="field" value={form.email} onChange={(e) => set("email", e.target.value)} />
          {errors.email && <span className="mt-1 block text-xs text-destructive">{errors.email}</span>}
        </label>
        <label className="text-sm sm:col-span-2">
          <span className="mb-1.5 block font-semibold text-navy-700">Service Required *</span>
          <select className="field" value={form.service} onChange={(e) => set("service", e.target.value)}>
            <option value="">Select a service</option>
            {services.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
            <option value="Integrated Facility Services">Integrated Facility Services</option>
          </select>
          {errors.service && <span className="mt-1 block text-xs text-destructive">{errors.service}</span>}
        </label>
        <label className="text-sm sm:col-span-2">
          <span className="mb-1.5 block font-semibold text-navy-700">Message *</span>
          <textarea
            rows={4}
            className="field"
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
          />
          {errors.message && <span className="mt-1 block text-xs text-destructive">{errors.message}</span>}
        </label>
      </div>
      <button type="submit" className="btn-base btn-accent mt-5 w-full sm:w-auto" disabled={sending}>
        {sending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}

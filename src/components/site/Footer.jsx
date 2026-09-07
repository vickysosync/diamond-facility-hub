import { Link } from "@tanstack/react-router";
import Icon from "@/components/ui/Icon.jsx";
import { useApp } from "@/store/AppStore.jsx";

export default function Footer() {
  const { company, services } = useApp();

  return (
    <footer className="bg-navy text-white/80">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10 text-white">
              <Icon name="shield" className="h-6 w-6" />
            </span>
            <span>
              <span className="block font-display text-lg font-extrabold leading-none text-white">
                {company.shortName}
              </span>
              <span className="block text-[11px] text-white/60">{company.tagline}</span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/65">{company.businessDescription}</p>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-widest text-white">Company</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ["/about", "About"],
              ["/services", "Services"],
              ["/industries", "Industries"],
              ["/portfolio", "Portfolio"],
              ["/contact", "Contact"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="transition-colors hover:text-safety">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-widest text-white">Services</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {services.map((s) => (
              <li key={s.id}>
                <Link
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="transition-colors hover:text-safety"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-widest text-white">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-3">
              <Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0 text-safety" />
              <a href={`tel:${company.phone}`} className="hover:text-safety">
                {company.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Icon name="mail" className="mt-0.5 h-4 w-4 shrink-0 text-safety" />
              <a href={`mailto:${company.email}`} className="break-all hover:text-safety">
                {company.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-safety" />
              <span>{company.city}</span>
            </li>
          </ul>
          <Link
            to="/admin/login"
            className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-white/45 transition-colors hover:text-safety"
          >
            <Icon name="gear" className="h-3.5 w-3.5" /> Admin Login
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {company.name}. All Rights Reserved.</p>
          <p>Facility Management • Security • Pest Control • Tank Cleaning • Painting — Pune</p>
        </div>
      </div>
    </footer>
  );
}

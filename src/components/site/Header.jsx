import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon.jsx";
import { useApp } from "@/store/AppStore.jsx";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/industries", label: "Industries" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/pricing-estimator", label: "Pricing Estimator" },
  { to: "/contact", label: "Contact" },
];

export default function Header({ onQuote }) {
  const { company } = useApp();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all ${
        scrolled ? "border-border bg-background/95 shadow-card backdrop-blur" : "border-transparent bg-background"
      }`}
    >
      <div className="container-x grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3">
        <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl gradient-navy text-white">
            <Icon name="shield" className="h-6 w-6" />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-lg font-extrabold leading-none tracking-tight text-navy">
              {company.shortName}
            </span>
            <span className="block truncate text-[11px] font-medium text-muted-foreground">
              {company.tagline}
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 xl:flex" aria-label="Main navigation">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "text-royal bg-muted" }}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-navy-700 transition-colors hover:bg-muted hover:text-royal"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button className="btn-base btn-accent hidden sm:inline-flex" onClick={onQuote}>
            Get a Free Quote
          </button>
          <button
            className="rounded-lg border border-border p-2 text-navy xl:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background xl:hidden">
          <nav className="container-x flex flex-col py-3" aria-label="Mobile navigation">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "text-royal" }}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-sm font-semibold text-navy-700"
              >
                {item.label}
              </Link>
            ))}
            <button
              className="btn-base btn-accent mt-2"
              onClick={() => {
                setOpen(false);
                onQuote();
              }}
            >
              Get a Free Quote
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

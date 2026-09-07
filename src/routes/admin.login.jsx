import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import Icon from "@/components/ui/Icon.jsx";
import { useApp } from "@/store/AppStore.jsx";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login | Diamond Integrated Facility Services LLP" },
      { name: "description", content: "Demonstration admin login for the Diamond facility services website." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Login | Diamond Facility Services" },
      { property: "og:description", content: "Restricted demonstration admin area." },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const { login, isAdmin, hydrated } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (hydrated && isAdmin) navigate({ to: "/admin/dashboard" });
  }, [hydrated, isAdmin, navigate]);

  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Enter both email and password.");
      return;
    }
    setBusy(true);
    setTimeout(() => {
      const ok = login(email, password);
      setBusy(false);
      if (ok) navigate({ to: "/admin/dashboard" });
      else setError("Invalid credentials. Use the demo credentials shown below.");
    }, 500);
  };

  return (
    <div className="grid min-h-screen place-items-center bg-navy px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-3 text-white">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-safety">
            <Icon name="shield" className="h-6 w-6" />
          </span>
          <span>
            <span className="block font-display text-lg font-extrabold leading-none">DIAMOND</span>
            <span className="block text-[11px] text-white/60">Integrated Facility Services LLP</span>
          </span>
        </Link>

        <form
          onSubmit={submit}
          noValidate
          className="rounded-2xl bg-card p-6 shadow-lift sm:p-8"
        >
          <h1 className="font-display text-xl font-extrabold text-navy">Admin Login</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to manage services, portfolio, pricing and enquiries.
          </p>

          <label className="mt-6 block text-sm">
            <span className="mb-1.5 block font-semibold text-navy-700">Email</span>
            <input
              type="email"
              className="field"
              value={email}
              autoComplete="username"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@diamondfacility.com"
            />
          </label>

          <label className="mt-4 block text-sm">
            <span className="mb-1.5 block font-semibold text-navy-700">Password</span>
            <input
              type="password"
              className="field"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          {error && (
            <p className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive">
              {error}
            </p>
          )}

          <button type="submit" className="btn-base btn-accent mt-6 w-full" disabled={busy}>
            {busy ? "Signing in…" : "Sign In"}
          </button>

          <div className="mt-6 rounded-xl bg-mist p-4 text-xs text-muted-foreground">
            <p className="font-bold text-navy">Demo credentials</p>
            <p className="mt-1">Email: admin@diamondfacility.com</p>
            <p>Password: admin123</p>
          </div>

          <Link to="/" className="mt-5 block text-center text-xs font-semibold text-royal hover:underline">
            Back to website
          </Link>
        </form>
      </div>
    </div>
  );
}

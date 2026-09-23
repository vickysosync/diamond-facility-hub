"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Check if already authenticated
    async function checkCurrentSession() {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        if (data.authenticated) {
          router.push("/admin/dashboard");
        }
      } catch (e) {
        // Not logged in
      }
    }
    checkCurrentSession();
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setBusy(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err?.message || "Invalid credentials.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative isolate min-h-screen flex items-center justify-center overflow-hidden bg-navy px-4 py-12 sm:px-6 lg:px-8">
      {/* Premium Facility Management Corporate Campus Backdrop */}
      <img
        src="/images/admin-bg.jpg"
        alt="Diamond Integrated Facility Services Management Campus"
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
      />
      {/* Rich Navy Atmospheric Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/85 to-navy/70 backdrop-blur-[2px]" />

      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="mb-6 flex flex-col items-center justify-center gap-1 group">
          <img
            src="/images/logo-white.png"
            alt="Diamond Integrated Facility Services LLP"
            className="h-14 w-auto max-w-[280px] object-contain drop-shadow-md transition-transform group-hover:scale-105 duration-200"
          />
          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-navy/80 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-gold backdrop-blur-md shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Admin Portal
          </span>
        </Link>

        <form
          onSubmit={submit}
          noValidate
          className="rounded-3xl bg-white/95 backdrop-blur-xl p-6 shadow-2xl sm:p-8 border border-white/40 ring-1 ring-black/5"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-xl font-extrabold text-navy">Welcome Back</h1>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Sign in to manage your facility website and operations.
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30 shrink-0">
              Secure
            </span>
          </div>

          <label className="mt-5 block text-xs sm:text-sm">
            <span className="mb-1.5 block font-semibold text-navy">Admin Email</span>
            <input
              type="email"
              className="field text-xs sm:text-sm"
              value={email}
              autoComplete="username"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@diamondifs.com"
              required
            />
          </label>

          <label className="mt-4 block text-xs sm:text-sm">
            <span className="mb-1.5 block font-semibold text-navy">Password</span>
            <input
              type="password"
              className="field text-xs sm:text-sm"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          {error && (
            <p className="mt-4 rounded-xl bg-destructive/10 border border-destructive/20 px-3.5 py-2 text-xs font-semibold text-destructive">
              {error}
            </p>
          )}

          <button type="submit" className="btn-base btn-accent mt-6 w-full py-2.5 text-sm font-bold shadow-md hover:shadow-lg transition-all" disabled={busy}>
            {busy ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Signing In…
              </span>
            ) : (
              "Sign In to Dashboard"
            )}
          </button>

          <div className="mt-6 rounded-2xl bg-mist/90 p-3.5 text-xs text-muted-foreground border border-border/80">
            <p className="font-bold text-navy text-[11px] uppercase tracking-wider">Default Credentials</p>
            <div className="mt-1 font-mono text-[11px] space-y-0.5">
              <p>Email: <span className="text-navy font-semibold">admin@diamondifs.com</span></p>
              <p>Password: <span className="text-navy font-semibold">admin123</span></p>
            </div>
          </div>

          <Link href="/" className="mt-5 block text-center text-xs font-semibold text-gold hover:underline">
            ← Back to live website
          </Link>
        </form>
      </div>
    </div>
  );
}

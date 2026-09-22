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
    <div className="grid min-h-screen place-items-center bg-navy px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 flex justify-center">
          <img
            src="/images/logo-white.png"
            alt="Diamond Integrated Facility Services LLP"
            className="h-14 w-auto max-w-[280px] object-contain"
          />
        </Link>

        <form
          onSubmit={submit}
          noValidate
          className="rounded-2xl bg-card p-6 shadow-lift sm:p-8 border border-border"
        >
          <div className="flex items-center justify-between">
            <h1 className="font-display text-xl font-extrabold text-navy">Admin Portal</h1>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30">
              Secure Access
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Sign in to manage services, industries, pricing, portfolio, quotes and enquiries.
          </p>

          <label className="mt-6 block text-sm">
            <span className="mb-1.5 block font-semibold text-navy">Admin Email</span>
            <input
              type="email"
              className="field"
              value={email}
              autoComplete="username"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@diamondifs.com"
              required
            />
          </label>

          <label className="mt-4 block text-sm">
            <span className="mb-1.5 block font-semibold text-navy">Password</span>
            <input
              type="password"
              className="field"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          {error && (
            <p className="mt-4 rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-xs font-semibold text-destructive">
              {error}
            </p>
          )}

          <button type="submit" className="btn-base btn-accent mt-6 w-full py-2.5 text-sm" disabled={busy}>
            {busy ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Signing In…
              </span>
            ) : (
              "Sign In to Dashboard"
            )}
          </button>

          <div className="mt-6 rounded-xl bg-mist p-3.5 text-xs text-muted-foreground border border-border">
            <p className="font-bold text-navy">Default Credentials</p>
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

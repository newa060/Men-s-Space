"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Shield } from "lucide-react";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();

      if (!json.success) {
        setError(json.error || "Authentication failed");
        setLoading(false);
        return;
      }

      const role = json.data?.user?.role;
      if (role !== "admin") {
        setError("Access denied. This account does not have administrator privileges.");
        setLoading(false);
        return;
      }

      // Admin confirmed — redirect to intended page or dashboard
      const redirect = searchParams.get("redirect") || "/admin/dashboard";
      router.replace(redirect);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg, transparent, transparent 60px, rgba(255,255,255,0.1) 60px, rgba(255,255,255,0.1) 61px
          ), repeating-linear-gradient(
            90deg, transparent, transparent 60px, rgba(255,255,255,0.1) 60px, rgba(255,255,255,0.1) 61px
          )`,
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 border border-white/10 bg-white/5 mb-2">
            <Shield size={24} className="text-white/70" />
          </div>
          <p className="text-[10px] tracking-[0.35em] text-white/40 uppercase font-medium">
            AESTHETE · Administration
          </p>
          <h1 className="text-2xl font-light text-white uppercase tracking-wide">
            Admin Console
          </h1>
        </div>

        {/* Login Form Card */}
        <div className="bg-neutral-900/80 border border-white/10 backdrop-blur-sm p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3.5 uppercase tracking-wider">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] tracking-[0.2em] text-white/40 uppercase font-medium">
                Admin Email
              </label>
              <input
                type="email"
                required
                disabled={loading}
                placeholder="admin@aesthete.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-800/80 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 placeholder:text-white/20 disabled:opacity-50 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] tracking-[0.2em] text-white/40 uppercase font-medium block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={loading}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-800/80 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 placeholder:text-white/20 pr-10 disabled:opacity-50 transition-colors"
                />
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors disabled:opacity-50"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-neutral-950 py-3.5 text-[11px] tracking-[0.25em] font-semibold flex items-center justify-center gap-2 hover:bg-white/90 transition-colors uppercase mt-4 disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Access Dashboard"}{" "}
              <ArrowRight size={14} />
            </button>
          </form>

          <div className="border-t border-white/10 pt-4">
            <p className="text-[10px] text-white/25 text-center tracking-wider">
              This area is restricted to authorized personnel only.
            </p>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push("/")}
            className="text-[10px] tracking-[0.2em] text-white/30 hover:text-white/60 transition-colors uppercase"
          >
            ← Return to Store
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <Suspense>
      <AdminLoginForm />
    </Suspense>
  );
}

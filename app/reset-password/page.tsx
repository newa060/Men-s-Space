"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, ArrowRight, CheckCircle, Loader2 } from "lucide-react";

type Step = "loading" | "form" | "done" | "invalid";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("loading");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Supabase puts the session tokens in the URL hash after the redirect.
  // The browser client picks them up automatically — we just need to wait
  // for the session to be established before showing the form.
  useEffect(() => {
    const supabase = createClient();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY" && session) {
          setStep("form");
        } else if (event === "SIGNED_IN" && session) {
          // Some Supabase versions fire SIGNED_IN instead of PASSWORD_RECOVERY
          setStep("form");
        }
      }
    );

    // Fallback: if already has a session (e.g. page refresh), show form
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setStep("form");
      } else {
        // Give the hash-based token a moment to be processed
        setTimeout(() => {
          supabase.auth.getSession().then(({ data: { session: s } }) => {
            setStep(s ? "form" : "invalid");
          });
        }, 1500);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();

      if (json.success) {
        setStep("done");
      } else {
        setError(json.error || "Failed to update password.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────

  if (step === "loading") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-secondary" />
      </div>
    );
  }

  // ── Invalid / expired link ───────────────────────────────────────────────

  if (step === "invalid") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-5">
        <div className="max-w-sm w-full text-center space-y-5">
          <div className="text-4xl">⚠️</div>
          <h1 className="text-xl font-light uppercase tracking-tight text-primary">
            Link Expired
          </h1>
          <p className="text-sm text-secondary leading-relaxed">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <button
            onClick={() => router.push("/sign-in")}
            className="w-full bg-primary text-on-primary py-3.5 text-xs font-bold tracking-widest uppercase hover:opacity-90 transition-opacity"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  // ── Done ─────────────────────────────────────────────────────────────────

  if (step === "done") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-5">
        <div className="max-w-sm w-full text-center space-y-5">
          <CheckCircle size={48} strokeWidth={1} className="text-primary mx-auto" />
          <h1 className="text-xl font-light uppercase tracking-tight text-primary">
            Password Updated
          </h1>
          <p className="text-sm text-secondary leading-relaxed">
            Your password has been changed successfully. You can now sign in with your new password.
          </p>
          <button
            onClick={() => router.push("/sign-in")}
            className="w-full bg-primary text-on-primary py-3.5 text-xs font-bold tracking-widest uppercase hover:opacity-90 transition-opacity"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5">
      <div className="max-w-sm w-full space-y-8">
        <div>
          <h1 className="text-2xl font-light uppercase tracking-tight text-primary">
            Reset Password
          </h1>
          <p className="text-xs text-secondary mt-1">
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 uppercase tracking-wider">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold tracking-widest uppercase text-secondary">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full bg-surface-container border border-outline-variant px-4 py-3 text-sm focus:outline-none focus:border-primary placeholder:text-outline-variant pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold tracking-widest uppercase text-secondary">
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat your new password"
              className="w-full bg-surface-container border border-outline-variant px-4 py-3 text-sm focus:outline-none focus:border-primary placeholder:text-outline-variant"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-on-primary py-4 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <><Loader2 size={14} className="animate-spin" /> Updating…</>
            ) : (
              <>Update Password <ArrowRight size={14} /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

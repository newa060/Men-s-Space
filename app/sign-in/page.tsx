"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/lib/supabase/client";

export default function SignInUp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshSession } = useCart();

  const [isSignIn, setIsSignIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "apple" | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const [error, setError] = useState(
    searchParams.get("error") === "oauth_failed"
      ? "Google sign-in failed. Please try again."
      : ""
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const redirectTo = searchParams.get("redirect") || "/profile";

  // ── Forgot password state ────────────────────────────────────────────────
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setVerificationSent(false);

    try {
      const endpoint = isSignIn ? "/api/auth/login" : "/api/auth/register";
      const payload = isSignIn
        ? { email, password }
        : { email, password, fullName: name };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!json.success) {
        setError(json.error || "Authentication failed");
        return;
      }

      if (!isSignIn && !json.data?.session) {
        setVerificationSent(true);
        return;
      }

      await refreshSession();
      const role = json.data?.user?.role;
      router.push(role === "admin" ? "/admin/dashboard" : redirectTo);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    setError("");
    setOauthLoading(provider);
    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        },
      });
      if (oauthError) {
        setError(oauthError.message);
        setOauthLoading(null);
      }
    } catch (err: any) {
      setError(err.message || "OAuth sign-in failed");
      setOauthLoading(null);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError("");
    setResetLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
      const json = await res.json();
      if (json.success) {
        setResetSent(true);
      } else {
        setResetError(json.error || "Failed to send reset email.");
      }
    } catch {
      setResetError("Network error. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="min-h-[85vh] grid grid-cols-1 md:grid-cols-12 max-w-screen-xl mx-auto w-full items-stretch">
        {/* Left: brand image */}
        <section className="hidden md:flex md:col-span-6 bg-neutral-900 relative items-center justify-center overflow-hidden">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAH6IVime3_QWR0zzE56vIucMDXKidh65Ob4HYpsPj5lP2i6d_ZqKk6wHG60KSY6Oul8grU8Grh_ff98XCmaVM2Z9GIBttWABM4j4GRuadm8ldyUYQh0qi0cObExn2Qi3raCDsZnc8gwUnh8cCK3sb_nhPym0xJMcrrnDr3MolZECM3K9JgVRXvNSIsDCY5iO04ORwyq1Fbz5k6ijbgnvwOqH3UMsaGvwigby_QrNfKuC_SLFu6lfiPlwCkIEDo8WS9LyatiejcZJLy"
            alt="Architectural Form in Motion"
            fill
            priority
            className="object-cover opacity-80"
            sizes="50vw"
          />
          <div className="relative z-10 text-center px-12 space-y-3">
            <p className="text-label-caps text-white/50 tracking-[0.3em]">AESTHETE STUDIO</p>
            <h2 className="text-3xl font-light text-white tracking-tight uppercase">
              Architectural Form In Motion.
            </h2>
          </div>
        </section>

        {/* Right: forms */}
        <section className="col-span-1 md:col-span-6 flex items-center justify-center p-8 md:p-16 bg-background">
          <div className="w-full max-w-md space-y-8">

            {/* Tabs */}
            <div className="flex border-b border-outline-variant/60">
              <button
                onClick={() => { setIsSignIn(true); setVerificationSent(false); setError(""); }}
                className={`flex-1 pb-4 text-sm font-semibold tracking-widest uppercase border-b-2 transition-all ${
                  isSignIn ? "border-primary text-primary" : "border-transparent text-secondary hover:text-primary"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setIsSignIn(false); setVerificationSent(false); setError(""); }}
                className={`flex-1 pb-4 text-sm font-semibold tracking-widest uppercase border-b-2 transition-all ${
                  !isSignIn ? "border-primary text-primary" : "border-transparent text-secondary hover:text-primary"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Heading */}
            <div>
              <h1 className="text-2xl font-light text-primary uppercase">
                {isSignIn ? "Welcome Back" : "Join AESTHETE"}
              </h1>
              <p className="text-xs text-secondary mt-1">
                {isSignIn
                  ? "Enter your details to access your account dashboard."
                  : "Create an account for faster checkouts and order history tracking."}
              </p>
            </div>

            {/* Verification sent screen */}
            {verificationSent ? (
              <div className="space-y-5 py-4">
                <div className="bg-surface-container border border-outline-variant/40 p-6 space-y-3 text-center">
                  <div className="text-3xl">✉️</div>
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
                    Check your email
                  </h2>
                  <p className="text-xs text-secondary leading-relaxed">
                    We sent a confirmation link to{" "}
                    <span className="text-primary font-medium">{email}</span>.
                    Click it to activate your account, then sign in.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setVerificationSent(false); setIsSignIn(true); }}
                  className="w-full border border-primary text-primary py-3 text-xs font-bold tracking-widest uppercase hover:bg-primary hover:text-on-primary transition-all"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 uppercase tracking-wider">
                      {error}
                    </div>
                  )}

                  {!isSignIn && (
                    <div className="space-y-1.5">
                      <label className="text-xs label-caps text-secondary">Full Name</label>
                      <input
                        type="text"
                        required
                        disabled={loading}
                        placeholder="Alex Chen"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-surface-container border border-outline-variant px-4 py-3 text-sm focus:outline-none focus:border-primary placeholder:text-outline-variant disabled:opacity-50"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs label-caps text-secondary">Email Address</label>
                    <input
                      type="email"
                      required
                      disabled={loading}
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-surface-container border border-outline-variant px-4 py-3 text-sm focus:outline-none focus:border-primary placeholder:text-outline-variant disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs label-caps text-secondary block">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        disabled={loading}
                        placeholder={isSignIn ? "••••••••" : "Minimum 6 characters"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-surface-container border border-outline-variant px-4 py-3 text-sm focus:outline-none focus:border-primary placeholder:text-outline-variant pr-10 disabled:opacity-50"
                      />
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors disabled:opacity-50"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {isSignIn && (
                    <div className="text-right">
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => {
                          setResetEmail(email);
                          setResetSent(false);
                          setResetError("");
                          setShowForgotPassword(true);
                        }}
                        className="text-xs text-secondary hover:text-primary transition-colors underline disabled:opacity-50"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-on-primary py-4 text-label-caps tracking-[0.2em] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity uppercase mt-6 disabled:opacity-50"
                  >
                    {loading
                      ? isSignIn ? "Signing In…" : "Creating Account…"
                      : isSignIn ? "Sign In" : "Create Account"}
                    <ArrowRight size={14} />
                  </button>
                </form>

                {/* Separator */}
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-outline-variant/40" />
                  </div>
                  <span className="relative bg-background px-4 text-[10px] label-caps text-secondary">
                    Or continue with
                  </span>
                </div>

                {/* Social buttons */}
                <div className="grid grid-cols-1 gap-4">
                  <button
                    onClick={() => handleOAuth("google")}
                    disabled={oauthLoading !== null || loading}
                    className="flex items-center justify-center gap-2 border border-outline-variant py-3 text-xs label-caps hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {oauthLoading === "google" ? (
                      <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    )}
                    Google
                  </button>
                </div>
              </div>
            )}

          </div>
        </section>
      </div>

      {/* ── Forgot Password Modal ── */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowForgotPassword(false)}
          />
          <div className="relative bg-background border border-outline-variant w-full max-w-sm p-8 space-y-6 z-10">
            {resetSent ? (
              <div className="text-center space-y-4">
                <div className="text-3xl">✉️</div>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
                  Check your email
                </h2>
                <p className="text-xs text-secondary leading-relaxed">
                  If <span className="text-primary font-medium">{resetEmail}</span> has
                  an account, you&apos;ll receive a reset link shortly.
                </p>
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="w-full border border-primary text-primary py-3 text-xs font-bold tracking-widest uppercase hover:bg-primary hover:text-on-primary transition-all"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div>
                  <h2 className="text-lg font-light uppercase tracking-tight text-primary">
                    Reset Password
                  </h2>
                  <p className="text-xs text-secondary mt-1">
                    Enter your email and we&apos;ll send you a reset link.
                  </p>
                </div>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  {resetError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 uppercase tracking-wider">
                      {resetError}
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold tracking-widest uppercase text-secondary">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full bg-surface-container border border-outline-variant px-4 py-3 text-sm focus:outline-none focus:border-primary placeholder:text-outline-variant"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full bg-primary text-on-primary py-3.5 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {resetLoading ? (
                      <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                    ) : "Send Reset Link"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="w-full text-xs text-secondary hover:text-primary transition-colors py-1"
                  >
                    Cancel
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

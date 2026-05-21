"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

export default function SignInUp() {
  const router = useRouter();
  const [isSignIn, setIsSignIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful login/signup
    router.push("/profile");
  };

  return (
    <div className="min-h-[85vh] grid grid-cols-1 md:grid-cols-12 max-w-screen-xl mx-auto w-full items-stretch">
      {/* ─── Left Column: Brand Graphic ───────────────────────────── */}
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

      {/* ─── Right Column: Authentication Forms ────────────────────── */}
      <section className="col-span-1 md:col-span-6 flex items-center justify-center p-8 md:p-16 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Form Switch tabs */}
          <div className="flex border-b border-outline-variant/60">
            <button
              onClick={() => setIsSignIn(true)}
              className={`flex-1 pb-4 text-sm font-semibold tracking-widest uppercase border-b-2 transition-all ${
                isSignIn ? "border-primary text-primary" : "border-transparent text-secondary hover:text-primary"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignIn(false)}
              className={`flex-1 pb-4 text-sm font-semibold tracking-widest uppercase border-b-2 transition-all ${
                !isSignIn ? "border-primary text-primary" : "border-transparent text-secondary hover:text-primary"
              }`}
            >
              Create Account
            </button>
          </div>

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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isSignIn && (
              <div className="space-y-1.5">
                <label className="text-xs label-caps text-secondary">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Alex Chen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant px-4 py-3 text-sm focus:outline-none focus:border-primary placeholder:text-outline-variant"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs label-caps text-secondary">Email Address</label>
              <input
                type="email"
                required
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant px-4 py-3 text-sm focus:outline-none focus:border-primary placeholder:text-outline-variant"
              />
            </div>

            <div className="space-y-1.5 relative">
              <label className="text-xs label-caps text-secondary block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder={isSignIn ? "••••••••" : "Minimum 8 characters"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {isSignIn && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-xs text-secondary hover:text-primary transition-colors underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary text-on-primary py-4 text-label-caps tracking-[0.2em] font-semibold flex items-center justify-center gap-2 hover:bg-neutral-850 transition-colors uppercase mt-6"
            >
              {isSignIn ? "Sign In" : "Create Account"} <ArrowRight size={14} />
            </button>
          </form>

          {/* Social Auth Separator */}
          <div className="relative flex items-center justify-center py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/40"></div>
            </div>
            <span className="relative bg-background px-4 text-[10px] label-caps text-secondary">
              Or continue with
            </span>
          </div>

          {/* Social Auth Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleSubmit}
              className="flex items-center justify-center gap-2 border border-outline-variant py-3 text-xs label-caps hover:border-primary hover:text-primary transition-colors"
            >
              Apple
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center justify-center gap-2 border border-outline-variant py-3 text-xs label-caps hover:border-primary hover:text-primary transition-colors"
            >
              Google
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

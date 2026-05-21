"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary text-on-primary mt-24">
      {/* Newsletter Band */}
      <div className="border-b border-white/10 px-5 md:px-16 py-12">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <p className="label-caps text-white/50 mb-2">Stay in the Edit</p>
            <h2 className="text-2xl font-light tracking-tight">
              Receive our curated dispatches
            </h2>
          </div>
          <form className="flex w-full md:w-auto md:min-w-[400px]" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-white/10 text-on-primary placeholder:text-white/30 px-5 py-3 text-sm focus:outline-none focus:bg-white/15 transition-colors"
            />
            <button
              type="submit"
              className="bg-on-primary text-primary px-6 py-3 text-label-caps font-semibold hover:bg-white/90 transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Links Grid */}
      <div className="px-5 md:px-16 py-16">
        <div className="max-w-screen-xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="font-bold text-xl tracking-tighter">MEN&apos;S SPACE</span>
            <p className="mt-4 text-sm text-white/50 leading-relaxed">
              Precision-cut essentials for the architecturally minded. Every piece a statement in restraint.
            </p>
          </div>

          <div>
            <p className="label-caps text-white/40 mb-5">Shop</p>
            <ul className="space-y-3">
              {["New Arrivals", "Collection", "Outerwear", "Essentials"].map((l) => (
                <li key={l}>
                  <Link href="/collection" className="text-sm text-white/70 hover:text-white transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label-caps text-white/40 mb-5">Account</p>
            <ul className="space-y-3">
              {[
                { label: "Profile", href: "/profile" },
                { label: "Orders", href: "/profile" },
                { label: "Addresses", href: "/shipping-addresses" },
                { label: "Sign In", href: "/sign-in" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-white/70 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label-caps text-white/40 mb-5">Company</p>
            <ul className="space-y-3">
              {["About", "Sustainability", "Careers", "Press"].map((l) => (
                <li key={l}>
                  <Link href="/" className="text-sm text-white/70 hover:text-white transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 px-5 md:px-16 py-6">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">
            © 2026 Men&apos;s Space. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Preferences"].map((t) => (
              <Link key={t} href="/" className="text-xs text-white/30 hover:text-white/70 transition-colors">
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

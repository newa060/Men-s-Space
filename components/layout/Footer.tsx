"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface CmsFooterData {
  storeLocationUrl: string;
}

export default function Footer() {
  const [cmsData, setCmsData] = useState<CmsFooterData>({ storeLocationUrl: "" });
  const [mapOpen, setMapOpen] = useState(false);

  useEffect(() => {
    fetch("/api/cms")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setCmsData({
            storeLocationUrl: json.data.storeLocationUrl || "",
          });
        }
      })
      .catch(() => {});
  }, []);

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
              <li>
                <button
                  onClick={() => setMapOpen(true)}
                  className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-1.5 group"
                >
                  <span className="material-symbols-outlined text-[14px] group-hover:text-white transition-colors">location_on</span>
                  Location
                </button>
              </li>
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

      {/* Map Popup */}
      {mapOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setMapOpen(false)}
        >
          <div
            className="bg-primary border border-white/20 w-full max-w-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Popup Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                <p className="text-[11px] font-bold tracking-widest uppercase">Our Location</p>
              </div>
              <button
                onClick={() => setMapOpen(false)}
                className="text-white/50 hover:text-white transition-colors"
                aria-label="Close map"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-5">
              {cmsData.storeLocationUrl ? (
                <a
                  href={cmsData.storeLocationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-on-primary text-primary px-6 py-3 text-[11px] font-bold tracking-widest uppercase hover:bg-white/90 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  Open in Google Maps
                </a>
              ) : (
                <div className="flex flex-col items-center gap-3 py-4 text-center">
                  <span className="material-symbols-outlined text-[36px] text-white/20">location_off</span>
                  <p className="text-[12px] text-white/40 leading-relaxed">
                    No location has been set yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface CmsFooterData {
  storeLocationUrl: string;
}

export default function Footer() {
  const [cmsData, setCmsData] = useState<CmsFooterData>({ storeLocationUrl: "" });
  const [mapOpen, setMapOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [subMessage, setSubMessage] = useState("");

  useEffect(() => {
    fetch("/api/cms")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setCmsData({ storeLocationUrl: json.data.storeLocationUrl || "" });
        }
      })
      .catch(() => {});
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubStatus("loading");
    setSubMessage("");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (json.success) {
        setSubStatus("success");
        setSubMessage("You're in. Expect only the essential.");
        setEmail("");
      } else {
        setSubStatus("error");
        setSubMessage(json.error || "Something went wrong.");
      }
    } catch {
      setSubStatus("error");
      setSubMessage("Something went wrong. Please try again.");
    }
  };

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
          <form className="flex flex-col w-full md:w-auto md:min-w-[400px] gap-2" onSubmit={handleSubscribe}>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setSubStatus("idle"); setSubMessage(""); }}
                disabled={subStatus === "loading" || subStatus === "success"}
                className="flex-1 bg-white/10 text-on-primary placeholder:text-white/30 px-5 py-3 text-sm focus:outline-none focus:bg-white/15 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={subStatus === "loading" || subStatus === "success"}
                className="bg-on-primary text-primary px-6 py-3 text-label-caps font-semibold hover:bg-white/90 transition-colors whitespace-nowrap disabled:opacity-60"
              >
                {subStatus === "loading" ? "..." : subStatus === "success" ? "Done" : "Subscribe"}
              </button>
            </div>
            {subMessage && (
              <p className={`text-xs px-1 ${subStatus === "success" ? "text-white/60" : "text-red-400"}`}>
                {subMessage}
              </p>
            )}
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
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
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
            className="bg-primary border border-white/20 w-full max-w-2xl shadow-2xl overflow-hidden"
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

            {/* Map Preview + Open Button */}
            {cmsData.storeLocationUrl ? (
              <>
                {/* Embedded map — interactive, badge opens Google Maps */}
                <div className="relative w-full h-96">
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      (() => {
                        try {
                          const u = new URL(cmsData.storeLocationUrl);
                          return (
                            u.searchParams.get("q") ||
                            u.pathname.split("/place/")[1]?.split("/")[0]?.replace(/\+/g, " ") ||
                            u.pathname.split("/search/")[1]?.split("/")[0]?.replace(/\+/g, " ") ||
                            cmsData.storeLocationUrl
                          );
                        } catch {
                          return cmsData.storeLocationUrl;
                        }
                      })()
                    )}&output=embed&z=15`}
                    className="w-full h-full border-0"
                    loading="lazy"
                    title="Store location map"
                  />
                  {/* Open Maps badge — sits on top of the interactive iframe */}
                  <a
                    href={cmsData.storeLocationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-3 right-3 z-10 bg-black/70 backdrop-blur-sm text-white text-[10px] tracking-widest uppercase px-3 py-1.5 flex items-center gap-1.5 hover:bg-black/90 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                    Open Maps
                  </a>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 py-8 text-center px-6">
                <span className="material-symbols-outlined text-[36px] text-white/20">location_off</span>
                <p className="text-[12px] text-white/40 leading-relaxed">
                  No location has been set yet.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}

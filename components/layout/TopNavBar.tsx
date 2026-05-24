"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAdmin } from "@/context/AdminContext";
import { motion, AnimatePresence } from "framer-motion";

interface TopNavBarProps {
  breadcrumbs?: { label: string; href?: string }[];
}

interface AdminUser {
  fullName: string;
  avatarUrl: string;
  role: string;
}

export default function TopNavBar({ breadcrumbs }: TopNavBarProps) {
  const pathname = usePathname();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const { orders } = useAdmin();

  // Build notifications from PENDING orders
  const notifications = orders
    .filter((o) => o.status === "PENDING")
    .slice(0, 10)
    .map((o) => ({
      id: o.id,
      title: "New Order",
      message: `${o.customerName} placed an order for $${o.totalPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      time: o.date,
      avatar: o.customerImage,
      orderId: o.id,
    }));

  // Fetch real admin user from session
  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((json) => {
        if (json.data?.user) {
          setAdminUser({
            fullName: json.data.user.fullName || "Admin",
            avatarUrl: json.data.user.avatarUrl || "",
            role: json.data.user.role || "admin",
          });
        }
      })
      .catch(() => {});
  }, []);

  // Close notification panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Auto-generate breadcrumbs from pathname if not provided
  const crumbs = breadcrumbs ?? (() => {
    const parts = pathname.split("/").filter(Boolean);
    const result: { label: string; href?: string }[] = [];
    let cumulative = "";
    for (const part of parts) {
      cumulative += "/" + part;
      result.push({
        label: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " "),
        href: cumulative !== pathname ? cumulative : undefined,
      });
    }
    return result;
  })();

  // Initials fallback for avatar
  const initials = adminUser?.fullName
    ? adminUser.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "A";

  return (
    <header
      id="TopNavBar"
      className="flex items-center justify-between h-16 px-8 bg-surface border-b border-outline-variant sticky top-0 z-40"
    >
      {/* Breadcrumbs */}
      <div className="flex items-center gap-4">
        <nav className="flex items-center text-[12px] font-semibold text-on-surface-variant tracking-widest uppercase">
          {crumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && (
                <span className="material-symbols-outlined text-[14px] mx-1 opacity-30">
                  chevron_right
                </span>
              )}
              {crumb.href ? (
                <a href={crumb.href} className="hover:text-primary transition-colors cursor-pointer">
                  {crumb.label}
                </a>
              ) : (
                <span className="text-primary font-semibold">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* Right side: Search + Actions */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div
          className={`relative transition-all duration-300 ease-out ${
            searchFocused ? "w-72" : "w-56"
          }`}
        >
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-50 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search assets..."
            className="w-full bg-surface-container-low border-none border-b border-outline-variant focus:ring-0 focus:border-primary text-[14px] py-1.5 pl-10 pr-4 placeholder:text-outline text-on-surface outline-none transition-all"
          />
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative p-2 text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full animate-pulse" />
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 top-12 w-80 bg-surface-container-high border border-outline-variant shadow-2xl z-50 overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant">
                  <span className="text-[11px] font-bold tracking-widest uppercase text-on-surface">
                    Notifications
                  </span>
                  {notifications.length > 0 && (
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {notifications.length} pending
                    </span>
                  )}
                </div>

                {/* List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-outline-variant/30">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-[12px] text-on-surface-variant">
                      <span className="material-symbols-outlined text-[32px] block mb-2 opacity-30">
                        notifications_none
                      </span>
                      No new notifications
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <a
                        key={n.id}
                        href="/admin/orders"
                        onClick={() => setNotifOpen(false)}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-surface-container-highest transition-colors group"
                      >
                        <div className="w-9 h-9 rounded-full overflow-hidden border border-outline-variant flex-shrink-0 relative">
                          <Image
                            src={n.avatar}
                            alt={n.message}
                            fill
                            className="object-cover grayscale"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-primary tracking-wide">
                            {n.title}
                          </p>
                          <p className="text-[11px] text-on-surface leading-snug mt-0.5 truncate">
                            {n.message}
                          </p>
                          <p className="text-[10px] text-on-surface-variant mt-1">{n.time}</p>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      </a>
                    ))
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="border-t border-outline-variant">
                    <a
                      href="/admin/orders"
                      onClick={() => setNotifOpen(false)}
                      className="block text-center py-2.5 text-[10px] font-bold tracking-widest uppercase text-on-surface-variant hover:text-primary transition-colors"
                    >
                      View All Orders →
                    </a>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2 pl-4 border-l border-outline-variant">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-outline bg-surface-container-high flex items-center justify-center flex-shrink-0">
            {adminUser?.avatarUrl ? (
              <Image
                src={adminUser.avatarUrl}
                alt={adminUser.fullName}
                width={32}
                height={32}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-[11px] font-bold text-on-surface-variant">{initials}</span>
            )}
          </div>
          <div className="hidden lg:block">
            <p className="text-[11px] font-semibold text-on-surface tracking-wide leading-none">
              {adminUser?.fullName ?? "—"}
            </p>
            <p className="text-[10px] text-on-surface-variant opacity-60 mt-0.5 capitalize">
              {adminUser?.role ?? "admin"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/collections", label: "Collections", icon: "domain" },
  { href: "/admin/orders", label: "Orders", icon: "shopping_cart" },
  { href: "/admin/content", label: "Studio Assets", icon: "auto_stories" },
];

export default function SideNavBar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside
      id="SideNavBar"
      className="fixed left-0 top-0 h-full bg-surface-container-lowest border-r border-outline-variant flex flex-col py-6 z-50 hidden md:flex"
      style={{ width: "280px" }}
    >
      {/* Brand Identity */}
      <div className="px-8 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-container flex items-center justify-center rounded-sm">
            <span className="material-symbols-outlined text-on-primary-container text-[20px]">
              architecture
            </span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-primary tracking-widest leading-none uppercase">
              Aesthete Studio
            </h1>
            <p className="text-[11px] text-on-surface-variant opacity-60 mt-0.5">
              Admin Console
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-0.5">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 px-8 py-3 text-sm transition-all duration-200 group ${
                active
                  ? "bg-surface-container text-on-surface border-l-2 border-primary"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface border-l-2 border-transparent"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[20px] ${
                  active ? "text-primary" : "group-hover:text-primary transition-colors"
                }`}
                style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className="text-[12px] font-semibold tracking-widest uppercase">
                {item.label}
              </span>
            </Link>
          );
        })}

        <div className="mx-6 my-4 border-t border-outline-variant opacity-30" />

        <Link
          href="/admin/settings"
          className="relative flex items-center gap-3 px-8 py-3 text-sm transition-all duration-200 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface border-l-2 border-transparent group"
        >
          <span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">
            settings
          </span>
          <span className="text-[12px] font-semibold tracking-widest uppercase">
            Settings
          </span>
        </Link>
      </nav>

      {/* Footer actions */}
      <div className="px-6 mt-auto space-y-1">
        <a
          href="#"
          className="flex items-center gap-3 py-2 px-2 text-on-surface-variant hover:text-on-surface text-[12px] tracking-wider transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">help_outline</span>
          <span>Support</span>
        </a>
        <Link
          href="/sign-in"
          className="flex items-center gap-3 py-2 px-2 text-on-surface-variant hover:text-error text-[12px] tracking-wider transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span>Sign Out</span>
        </Link>
      </div>
    </aside>
  );
}

"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

interface TopNavBarProps {
  breadcrumbs?: { label: string; href?: string }[];
}

export default function TopNavBar({ breadcrumbs }: TopNavBarProps) {
  const pathname = usePathname();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");

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
                <a
                  href={crumb.href}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
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
        <button className="relative p-2 text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2 pl-4 border-l border-outline-variant">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-outline bg-surface-container-high">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0ZwPRGV0UjWwXs6bwyY8qU5JM6-ICwS4-HTd210T3RiNTcLJF3cdszjM6-IqPSCjGpkuAt79brfBkO9qkSZG8vUVKCKlchpO-n3jm_3sVmkBQu6e49cLznIQv8kbWjGpMWxEd4hN3JgQz0yDN3Ese1qFljoQal1jkmRMHVUp5a6cWhtspmyKsYt_yCl8jFTY_7JLfkbYdsJ6tpwMoQ9sHHrWCusYH6UK861-qB40P6wGLTc7RzjsrspvDNUMwIwtGMpEaEp1HINNN"
              alt="Creative Director"
              width={32}
              height={32}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="hidden lg:block">
            <p className="text-[11px] font-semibold text-on-surface tracking-wide leading-none">
              Alex Moran
            </p>
            <p className="text-[10px] text-on-surface-variant opacity-60 mt-0.5">
              Creative Director
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

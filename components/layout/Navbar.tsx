"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CartDrawer from "@/components/ui/CartDrawer";
import SearchDrawer from "@/components/ui/SearchDrawer";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Collection", href: "/collection" },
  { label: "New Arrivals", href: "/new-arrivals" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount, isCartOpen, openCart, closeCart, isSearchOpen, openSearch, closeSearch } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Scroll-aware height reduction
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* ─── Top Bar ─────────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 w-full z-50 flex justify-between items-center px-5 md:px-16 bg-background/90 backdrop-blur-md border-b border-outline-variant transition-all duration-300 ${
          scrolled ? "h-14" : "h-16"
        }`}
      >
        {/* Left: Desktop Nav Links & Mobile Logo */}
        <div className="flex-1 flex items-center">
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-label-caps font-semibold tracking-widest uppercase transition-colors duration-300 ${
                    isActive
                      ? "text-gray-500 border-b border-gray-500 pb-0.5"
                      : "text-gray-400 hover:text-gray-500"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          {/* Mobile Logo */}
          <div className="md:hidden flex items-center">
            <Link
              href="/"
              className="font-bold text-primary tracking-tighter text-xl whitespace-nowrap"
            >
              MEN&apos;S SPACE
            </Link>
          </div>
        </div>

        {/* Center: Logo (Desktop) */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
          <Link
            href="/"
            className="font-bold text-primary tracking-tighter text-2xl"
          >
            MEN&apos;S SPACE
          </Link>
        </div>

        {/* Right: Utility Icons */}
        <div className="flex-1 flex items-center justify-end gap-1 text-gray-400">
          <button
            aria-label="Search"
            onClick={openSearch}
            className="p-2 hover:text-gray-500 hover:bg-surface-container transition-colors"
          >
            <Search size={20} strokeWidth={1.5} />
          </button>

          <button
            aria-label="Shopping Bag"
            onClick={openCart}
            className="relative p-2 hover:text-gray-500 hover:bg-surface-container transition-colors"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </button>

          <Link
            href="/profile"
            aria-label="Profile"
            className="p-2 hover:text-gray-500 hover:bg-surface-container transition-colors"
          >
            <User size={20} strokeWidth={1.5} />
          </Link>

          {/* Mobile menu toggle */}
          <button
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 hover:text-gray-500 hover:bg-surface-container transition-colors"
          >
            {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      {/* ─── Mobile Menu Overlay ─────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-background pt-16 flex flex-col px-5">
          <nav className="flex flex-col gap-8 mt-12">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-3xl font-light text-primary tracking-tight hover:opacity-60 transition-opacity"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto pb-12 border-t border-outline-variant pt-8 flex gap-6">
            <Link href="/profile" className="text-label-caps uppercase text-secondary hover:text-primary transition-colors">Account</Link>
            <Link href="/bag" className="text-label-caps uppercase text-secondary hover:text-primary transition-colors">Bag ({itemCount})</Link>
          </div>
        </div>
      )}

      {/* ─── Drawers ─────────────────────────────────────────────── */}
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      <SearchDrawer isOpen={isSearchOpen} onClose={closeSearch} />
    </>
  );
}

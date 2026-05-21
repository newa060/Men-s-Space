"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart, Address } from "@/context/CartContext";
import { User, History, MapPin, Plus, X, ArrowRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ShippingAddressesPage() {
  const {
    addresses,
    addAddress,
    updateAddress,
    removeAddress,
    setDefaultAddress,
  } = useCart();

  // Modal / Form state
  const [isOpen, setIsOpen] = useState(false);
  const [editAddressId, setEditAddressId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [postcode, setPostcode] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  // Error validation
  const [error, setError] = useState("");

  const handleOpenAdd = () => {
    setName("");
    setLine1("");
    setLine2("");
    setCity("");
    setCountry("");
    setPostcode("");
    setIsDefault(false);
    setError("");
    setEditAddressId(null);
    setIsOpen(true);
  };

  const handleOpenEdit = (addr: Address) => {
    setName(addr.name);
    setLine1(addr.line1);
    setLine2(addr.line2 || "");
    setCity(addr.city);
    setCountry(addr.country);
    setPostcode(addr.postcode);
    setIsDefault(addr.isDefault);
    setError("");
    setEditAddressId(addr.id);
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !line1 || !city || !country || !postcode) {
      setError("Please fill out all required fields.");
      return;
    }

    const payload = {
      name,
      line1,
      line2: line2 || undefined,
      city,
      country,
      postcode,
      isDefault,
    };

    if (editAddressId) {
      updateAddress(editAddressId, payload);
    } else {
      addAddress(payload);
    }

    setIsOpen(false);
  };

  return (
    <div className="py-12 px-5 md:px-16 max-w-screen-xl mx-auto w-full min-h-screen">
      {/* ─── Breadcrumbs ────────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-xs text-secondary mb-10">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="text-secondary">/</span>
        <Link href="/profile" className="hover:text-primary transition-colors">My Account</Link>
        <span className="text-secondary">/</span>
        <span className="text-primary">Shipping Addresses</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* ─── Left Sidebar Navigation ──────────────────────────── */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="mb-8">
            <h2 className="text-2xl font-light uppercase tracking-tight text-primary">My Account</h2>
            <p className="text-xs text-secondary mt-1">Manage your preferences</p>
          </div>
          <nav className="flex flex-col border border-outline-variant/30 divide-y divide-outline-variant/30">
            <Link
              href="/profile"
              className="flex items-center gap-3 px-6 py-4 hover:bg-surface-container transition-colors text-sm text-secondary hover:text-primary"
            >
              <User size={16} />
              <span>Account Overview</span>
            </Link>
            <Link
              href="/order-history"
              className="flex items-center gap-3 px-6 py-4 hover:bg-surface-container transition-colors text-sm text-secondary hover:text-primary"
            >
              <History size={16} />
              <span>Order History</span>
            </Link>
            <Link
              href="/shipping-addresses"
              className="flex items-center gap-3 px-6 py-4 bg-surface-container-low text-sm font-semibold text-primary border-l-2 border-primary"
            >
              <MapPin size={16} />
              <span>Shipping Addresses</span>
            </Link>
          </nav>
        </aside>

        {/* ─── Main Content Area ────────────────────────────────── */}
        <section className="flex-grow">
          <header className="mb-8">
            <p className="text-xs label-caps text-secondary uppercase tracking-widest mb-1.5">ACCOUNT / SETTINGS</p>
            <h1 className="text-3xl font-light tracking-tight text-primary uppercase">Shipping Addresses</h1>
            <div className="h-[1px] bg-outline-variant/40 mt-4 w-full"></div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Render Addresses */}
            {addresses.map((addr, index) => (
              <motion.div
                key={addr.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`border p-6 bg-white flex flex-col justify-between min-h-[260px] transition-all duration-300 relative ${
                  addr.isDefault
                    ? "border-primary shadow-sm"
                    : "border-outline-variant/50 hover:border-primary/80"
                }`}
              >
                <div>
                  {/* Large Index Number background */}
                  <span className="absolute top-4 right-6 text-5xl font-light opacity-5 select-none pointer-events-none">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="font-semibold text-sm text-primary uppercase tracking-wide">
                      {addr.name}
                    </h3>
                    {addr.isDefault && (
                      <span className="bg-primary text-on-primary text-[9px] px-2 py-0.5 font-bold uppercase tracking-widest">
                        Default
                      </span>
                    )}
                  </div>

                  <address className="not-italic text-sm text-secondary space-y-1.5 leading-relaxed">
                    <p>{addr.line1}</p>
                    {addr.line2 && <p>{addr.line2}</p>}
                    <p>{addr.city}, {addr.postcode}</p>
                    <p className="uppercase tracking-wide">{addr.country}</p>
                  </address>
                </div>

                <div className="flex flex-wrap gap-4 mt-6 border-t border-outline-variant/30 pt-4 text-xs font-semibold">
                  <button
                    onClick={() => handleOpenEdit(addr)}
                    className="text-primary underline underline-offset-4 hover:text-secondary transition-colors uppercase tracking-wider"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeAddress(addr.id)}
                    className="text-primary underline underline-offset-4 hover:text-secondary transition-colors uppercase tracking-wider"
                  >
                    Delete
                  </button>
                  {!addr.isDefault && (
                    <button
                      onClick={() => setDefaultAddress(addr.id)}
                      className="text-secondary hover:text-primary transition-colors uppercase tracking-wider ml-auto font-normal"
                    >
                      Set As Default
                    </button>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Add New Address Card */}
            <button
              onClick={handleOpenAdd}
              className="border border-dashed border-outline-variant/60 p-6 flex flex-col items-center justify-center min-h-[260px] hover:border-primary transition-all duration-300 bg-surface-container-low group"
            >
              <Plus
                size={32}
                className="text-secondary group-hover:text-primary transition-colors mb-3 stroke-[1.25]"
              />
              <span className="text-xs label-caps font-semibold text-secondary group-hover:text-primary tracking-widest uppercase transition-colors">
                Add New Address
              </span>
            </button>
          </div>

          {/* ─── Global Service Policy Section ───────────────────── */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-t border-outline-variant/40 pt-16">
            <div className="md:col-span-5 aspect-[4/5] bg-surface-container-high overflow-hidden relative">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4XbDteC9T_dAvMXiPmGZHIqhsHCq6TUjCPcc-lro4-EJFOAjYVoWFAuRKcjzu8iXnANv1uqy6TsGbeng0SWLyuI-TSh9kmLYhYpekx5dEvkHJKoOzP8NH1M0VU_HlAMa39158dftjWtOIUI5EgHdwSK_5RenZ6tNjEQKpXCxRabEgzdVsBPA44sOuLV9R6FlsmYOWJ5Fop0sDXkCnHaJk8QF6hMGQYb69Kl3mAZLy6lMgMtIqgY66CgaMcOYpNXazZTiuv_31hQFe"
                alt="AESTHETE Editorial Leather Goods"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover grayscale hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            <div className="md:col-span-7 md:pl-6 space-y-6">
              <h3 className="text-2xl font-light uppercase tracking-tight text-primary">Global Service</h3>
              <p className="text-sm text-secondary leading-relaxed">
                We deliver to over 140 countries. Manage your global shipping portfolio with architectural precision.
                Each address is secured and verified for seamless logistics.
              </p>
              <Link
                href="/collection"
                className="inline-flex items-center gap-2 text-xs label-caps font-semibold text-primary border-b border-primary pb-1 hover:opacity-75 transition-opacity uppercase tracking-widest"
              >
                <span>Shipping Policy</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* ─── Address Form Modal ─────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Modal Body (Right-aligned Drawer style) */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg h-full bg-white shadow-xl flex flex-col z-10 rounded-none border-l border-outline-variant"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center px-8 py-6 border-b border-outline-variant/40">
                <h2 className="text-lg font-semibold uppercase tracking-wider text-primary">
                  {editAddressId ? "Edit Address" : "Add Address"}
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-surface-container transition-colors"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              {/* Modal Content */}
              <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto px-8 py-6 space-y-6">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
                    {error}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] label-caps uppercase tracking-widest text-secondary block font-semibold">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/60 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors rounded-none"
                    placeholder="e.g. Julian Vane"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] label-caps uppercase tracking-widest text-secondary block font-semibold">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    required
                    value={line1}
                    onChange={(e) => setLine1(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/60 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors rounded-none"
                    placeholder="e.g. 14 Brutalist Way, Apt 3C"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] label-caps uppercase tracking-widest text-secondary block font-semibold">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    value={line2}
                    onChange={(e) => setLine2(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/60 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors rounded-none"
                    placeholder="e.g. Suite 500, Studio AESTHETE"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] label-caps uppercase tracking-widest text-secondary block font-semibold">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/60 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors rounded-none"
                      placeholder="e.g. London"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] label-caps uppercase tracking-widest text-secondary block font-semibold">
                      Postcode / Zip *
                    </label>
                    <input
                      type="text"
                      required
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/60 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors rounded-none"
                      placeholder="e.g. EC1A 1BB"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] label-caps uppercase tracking-widest text-secondary block font-semibold">
                    Country *
                  </label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/60 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors rounded-none"
                    placeholder="e.g. United Kingdom"
                  />
                </div>

                {/* Default checkbox */}
                <label className="flex items-center gap-3 cursor-pointer pt-2 group select-none">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={isDefault}
                      onChange={(e) => setIsDefault(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 border transition-all flex items-center justify-center ${
                      isDefault ? "bg-primary border-primary" : "border-outline-variant group-hover:border-primary"
                    }`}>
                      {isDefault && <Check size={12} className="text-on-primary stroke-[3]" />}
                    </div>
                  </div>
                  <span className="text-xs text-secondary group-hover:text-primary transition-colors">
                    Set as default shipping address
                  </span>
                </label>

                {/* Footer Buttons */}
                <div className="pt-8 border-t border-outline-variant/30 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 border border-outline-variant text-secondary py-4 text-xs font-semibold uppercase tracking-widest hover:text-primary hover:border-primary transition-colors rounded-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-on-primary py-4 text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity rounded-none"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

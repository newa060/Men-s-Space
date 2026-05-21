"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, History, MapPin, X, Eye, Truck, Package, Calendar, CreditCard, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  date: string;
  status: "Delivered" | "In Transit" | "Processing";
  image: string;
  trackingNumber: string;
  size: string;
  color: string;
  quantity: number;
  address: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    country: string;
    postcode: string;
  };
  paymentMethod: string;
}

const ORDERS_DATABASE: OrderItem[] = [
  {
    id: "AES-892410",
    name: "Architectural Wool Overcoat",
    price: 1250,
    date: "Oct 14, 2024",
    status: "Delivered",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDul7DYJBd9hNSB_tbepgcfcRIBKw5k_Jz0bJ3qIaIfLwHharz5XPwCxe9zEjbeV3tJYwnB3g6nrFSiiLZ9HcFKSnyOva6BD-2JVrlxaNO0pMp-qWNkghhL87yjcqB7vORX9y1inDf-dTDhubJ74dJKqtrRCifJgsEgjx5gUtcFuu6LVwJE1lvf_92-HmRCkpnorMXAdUyya488sni4V5QxL04-bCPiWgju6wcKT0-YIuHbFlR-pWxbO05TsZbe5Xo7l-dndolNX6Wz",
    trackingNumber: "TRK-009823149",
    size: "L",
    color: "Charcoal",
    quantity: 1,
    address: {
      name: "Julian Vane",
      line1: "14 Brutalist Way, Apt 3C",
      city: "London",
      country: "United Kingdom",
      postcode: "EC1A 1BB",
    },
    paymentMethod: "Apple Pay (•••• 9876)",
  },
  {
    id: "AES-890214",
    name: "Monolith Technical Blazer",
    price: 890,
    date: "Sept 28, 2024",
    status: "Delivered",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBC_ojhcnHYUaJnXN2K-wP9H4XdDQVozCNdbp7Wep7tfEdW1qeFyTe6EUBRnM-D7sulLwWNGe7NCwpppRWeCamoXKlIJxDb0wxaJZ4EkHbvpQMtnFUjoeKMCf9aBcpL2w6fQJhRLsDgVAyzc0qSPNzcPNQJh5xV82Rhm4xllYyZhh7YVTNJHIoelbzQjDidKFv40nCwWU_FvRc1smEp5QgHJcJ9C0XXlNE2OSX9sFslRha7H3NolEzYH9_ftea90iHK6_VR-kwzpEQX",
    trackingNumber: "TRK-009112948",
    size: "M",
    color: "Black",
    quantity: 1,
    address: {
      name: "Julian Vane",
      line1: "14 Brutalist Way, Apt 3C",
      city: "London",
      country: "United Kingdom",
      postcode: "EC1A 1BB",
    },
    paymentMethod: "Visa Premium (•••• 4321)",
  },
  {
    id: "AES-881022",
    name: "Vanguard Leather Boots",
    price: 560,
    date: "Aug 05, 2024",
    status: "Delivered",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDlFrhgaX1HECLxzsU2RRIQZTAQUzTOZy46KNmSydSFxbvsqQ_EqHkiFkIFC-z9RNxALD319sAM3PBysAPLqETmEkzIktDCmI8Q5nvQQriFCxWhe7KPNhmD5i7Qy0vfDI43_HS-Vldlpnk0WRTHm72u-s7Cxi3l7XPjRNmYJSNS_UoqDAqy71FSBKwX1B4dY93Ux068WhfV66-UfFP5Gkzg0lcOzTfZfZs1FIUGy_6iLD_nV9iUujeiJh3TKk6wvK59Q8EDWa0MF2V",
    trackingNumber: "TRK-008129033",
    size: "43",
    color: "Black",
    quantity: 1,
    address: {
      name: "Julian Vane",
      line1: "14 Brutalist Way, Apt 3C",
      city: "London",
      country: "United Kingdom",
      postcode: "EC1A 1BB",
    },
    paymentMethod: "Mastercard (•••• 8820)",
  },
];

export default function OrderHistoryPage() {
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<OrderItem | null>(null);

  return (
    <div className="py-12 px-5 md:px-16 max-w-screen-xl mx-auto w-full min-h-screen">
      {/* ─── Breadcrumbs ────────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-xs text-secondary mb-10">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="text-secondary">/</span>
        <Link href="/profile" className="hover:text-primary transition-colors">My Account</Link>
        <span className="text-secondary">/</span>
        <span className="text-primary">Order History</span>
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
              className="flex items-center gap-3 px-6 py-4 bg-surface-container-low text-sm font-semibold text-primary border-l-2 border-primary"
            >
              <History size={16} />
              <span>Order History</span>
            </Link>
            <Link
              href="/shipping-addresses"
              className="flex items-center gap-3 px-6 py-4 hover:bg-surface-container transition-colors text-sm text-secondary hover:text-primary"
            >
              <MapPin size={16} />
              <span>Shipping Addresses</span>
            </Link>
          </nav>
        </aside>

        {/* ─── Main Content: Orders List ────────────────────────── */}
        <section className="flex-grow">
          <header className="mb-8">
            <p className="text-xs label-caps text-secondary uppercase tracking-widest mb-1.5">ACCOUNT / SETTINGS</p>
            <h1 className="text-3xl font-light tracking-tight text-primary uppercase">Order History</h1>
            <div className="h-[1px] bg-outline-variant/40 mt-4 w-full"></div>
          </header>

          <div className="space-y-8">
            {ORDERS_DATABASE.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group flex flex-col md:flex-row gap-6 border-b border-outline-variant/30 pb-8 items-start relative"
              >
                {/* Visual Order counter index */}
                <div className="text-4xl font-light text-outline-variant/50 flex-shrink-0 w-10">
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* Product Thumbnail image */}
                <div className="w-full md:w-36 aspect-[4/5] bg-surface-container overflow-hidden border border-outline-variant/20 flex-shrink-0">
                  <Image
                    src={order.image}
                    alt={order.name}
                    width={144}
                    height={180}
                    className="w-full h-full object-cover grayscale brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="144px"
                  />
                </div>

                {/* Product details & actions */}
                <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
                  <div className="md:col-span-8 flex flex-col gap-2">
                    <span className="text-[10px] font-semibold text-secondary uppercase tracking-widest">
                      Order ID: {order.id}
                    </span>
                    <h3 className="text-lg font-semibold uppercase tracking-tight text-primary">
                      {order.name}
                    </h3>
                    <p className="text-xs text-secondary flex items-center gap-1.5 mt-1">
                      <Calendar size={13} />
                      Ordered on {order.date}
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-xs">
                      <span className="text-secondary">Size: <strong className="text-primary">{order.size}</strong></span>
                      <span className="text-secondary">Color: <strong className="text-primary">{order.color}</strong></span>
                      <span className="text-secondary">Qty: <strong className="text-primary">{order.quantity}</strong></span>
                    </div>
                  </div>

                  <div className="md:col-span-4 flex flex-col md:items-end justify-between gap-4">
                    <div className="md:text-right">
                      <span className="text-lg font-light text-primary">
                        ${order.price.toLocaleString()}.00
                      </span>
                      <div className="flex items-center gap-1.5 md:justify-end mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                        <span className="text-[10px] label-caps uppercase tracking-wider text-primary font-semibold">
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-5 py-2.5 border border-primary text-[10px] label-caps font-semibold uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all duration-300 rounded-none"
                      >
                        View Details
                      </button>
                      {index === 0 && (
                        <button
                          onClick={() => setTrackingOrder(order)}
                          className="px-5 py-2.5 bg-primary text-on-primary text-[10px] label-caps font-semibold uppercase tracking-widest hover:opacity-85 transition-opacity rounded-none"
                        >
                          Track
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* ─── Details Overlay Drawer ─────────────────────────────── */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg h-full bg-white shadow-xl flex flex-col z-10 rounded-none border-l border-outline-variant"
            >
              <div className="flex justify-between items-center px-8 py-6 border-b border-outline-variant/40">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
                  Order Details
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 hover:bg-surface-container transition-colors"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto px-8 py-6 space-y-8">
                {/* Summary Info */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-semibold text-secondary uppercase tracking-widest block">Order ID</span>
                    <p className="text-sm font-medium text-primary uppercase mt-0.5">{selectedOrder.id}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-semibold text-secondary uppercase tracking-widest block">Order Date</span>
                    <p className="text-sm text-primary mt-0.5">{selectedOrder.date}</p>
                  </div>
                </div>

                {/* Product Detail Card */}
                <div className="flex gap-4 bg-surface-container-low border border-outline-variant/30 p-4">
                  <div className="relative w-16 h-20 bg-surface-container flex-shrink-0">
                    <Image
                      src={selectedOrder.image}
                      alt={selectedOrder.name}
                      fill
                      sizes="64px"
                      className="object-cover grayscale"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-primary uppercase tracking-wide">{selectedOrder.name}</h4>
                    <p className="text-[11px] text-secondary mt-1">Size: {selectedOrder.size} &middot; Color: {selectedOrder.color}</p>
                    <p className="text-[11px] text-secondary mt-0.5">Quantity: {selectedOrder.quantity}</p>
                    <p className="text-xs font-semibold text-primary mt-2">${selectedOrder.price.toLocaleString()}.00</p>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="space-y-2">
                  <h4 className="text-[10px] label-caps font-semibold text-primary tracking-widest uppercase flex items-center gap-1.5">
                    <MapPin size={13} /> Shipping Address
                  </h4>
                  <div className="text-xs text-secondary leading-relaxed bg-surface border border-outline-variant/20 p-4">
                    <p className="font-semibold text-primary uppercase">{selectedOrder.address.name}</p>
                    <p>{selectedOrder.address.line1}</p>
                    {selectedOrder.address.line2 && <p>{selectedOrder.address.line2}</p>}
                    <p>{selectedOrder.address.city}, {selectedOrder.address.postcode}</p>
                    <p className="uppercase">{selectedOrder.address.country}</p>
                  </div>
                </div>

                {/* Payment Detail */}
                <div className="space-y-2">
                  <h4 className="text-[10px] label-caps font-semibold text-primary tracking-widest uppercase flex items-center gap-1.5">
                    <CreditCard size={13} /> Payment Method
                  </h4>
                  <div className="text-xs text-secondary bg-surface border border-outline-variant/20 p-4">
                    <p className="font-semibold text-primary">{selectedOrder.paymentMethod}</p>
                    <p className="mt-1 text-[11px]">Transaction Reference: TXN-{selectedOrder.id.replace("AES-", "")}990</p>
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-3 pt-6 border-t border-outline-variant/30">
                  <div className="flex justify-between text-xs text-secondary">
                    <span>Subtotal</span>
                    <span>${selectedOrder.price.toLocaleString()}.00</span>
                  </div>
                  <div className="flex justify-between text-xs text-secondary">
                    <span>Complimentary Shipping</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between text-xs text-secondary">
                    <span>Duties &amp; Taxes</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-primary pt-2 border-t border-outline-variant/20">
                    <span>Total Payment</span>
                    <span>${selectedOrder.price.toLocaleString()}.00</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Tracking Overlay Drawer ─────────────────────────────── */}
      <AnimatePresence>
        {trackingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTrackingOrder(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg h-full bg-white shadow-xl flex flex-col z-10 rounded-none border-l border-outline-variant"
            >
              <div className="flex justify-between items-center px-8 py-6 border-b border-outline-variant/40">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-primary flex items-center gap-2">
                  <Truck size={16} /> Track Shipment
                </h2>
                <button
                  onClick={() => setTrackingOrder(null)}
                  className="p-1 hover:bg-surface-container transition-colors"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto px-8 py-6 space-y-8">
                <div>
                  <span className="text-[10px] font-semibold text-secondary uppercase tracking-widest block">Carrier</span>
                  <p className="text-sm font-semibold text-primary mt-0.5">AESTHETE Prime Express</p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-secondary uppercase tracking-widest block">Tracking Number</span>
                  <p className="text-sm font-semibold text-primary mt-0.5 select-all">{trackingOrder.trackingNumber}</p>
                </div>

                {/* Timeline status chart */}
                <div className="space-y-6 pt-4">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                      </div>
                      <div className="w-[1.5px] h-12 bg-primary"></div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-primary uppercase">Delivered</p>
                      <p className="text-[11px] text-secondary mt-0.5">Your package was handed off at the reception desk.</p>
                      <p className="text-[10px] text-secondary/60 mt-1 font-medium">Oct 16, 2024 at 14:32</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                      </div>
                      <div className="w-[1.5px] h-12 bg-primary"></div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-primary uppercase">Out For Delivery</p>
                      <p className="text-[11px] text-secondary mt-0.5">In transit with delivery courier.</p>
                      <p className="text-[10px] text-secondary/60 mt-1 font-medium">Oct 16, 2024 at 08:10</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                      </div>
                      <div className="w-[1.5px] h-12 bg-primary"></div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-primary uppercase">Arrived at London Hub</p>
                      <p className="text-[11px] text-secondary mt-0.5">Sorted and prepared for local dispatch.</p>
                      <p className="text-[10px] text-secondary/60 mt-1 font-medium">Oct 15, 2024 at 23:45</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-primary uppercase">Shipment Manifest Created</p>
                      <p className="text-[11px] text-secondary mt-0.5">Picked up from AESTHETE Logistics Fulfilment Center.</p>
                      <p className="text-[10px] text-secondary/60 mt-1 font-medium">Oct 14, 2024 at 18:20</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

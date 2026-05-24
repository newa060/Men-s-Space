"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  History,
  MapPin,
  X,
  Truck,
  Calendar,
  CreditCard,
  MessageSquarePlus,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderItem {
  id: string;
  name: string;
  price: number;
  date: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED";
  image: string;
  trackingNumber: string;
  size: string;
  color: string;
  quantity: number;
  itemsCount: number;
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

const STATUS_LABEL: Record<OrderItem["status"], string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  COMPLETED: "Delivered",
  CANCELLED: "Cancelled",
};

// ─── Review Drawer ────────────────────────────────────────────────────────────

function ReviewDrawer({
  order,
  onClose,
}: {
  order: OrderItem;
  onClose: () => void;
}) {
  const [text, setText] = useState("");
  const [location, setLocation] = useState(order.address.city || "");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (text.trim().length < 10) {
      setError("Please write at least 10 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, location, orderId: order.id }),
      });
      const json = await res.json();
      if (json.success) {
        setSubmitted(true);
      } else {
        setError(json.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-lg h-full bg-white shadow-xl flex flex-col z-10 border-l border-outline-variant"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-outline-variant/40">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary flex items-center gap-2">
            <MessageSquarePlus size={16} />
            Leave a Review
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-surface-container transition-colors"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto px-8 py-6">
          {submitted ? (
            /* ── Success state ── */
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center gap-5 py-16"
            >
              <CheckCircle size={48} strokeWidth={1} className="text-primary" />
              <div>
                <h3 className="text-lg font-light uppercase tracking-tight text-primary">
                  Thank you
                </h3>
                <p className="text-sm text-secondary mt-2 leading-relaxed max-w-xs">
                  Your review has been submitted and is pending approval. We appreciate
                  you sharing your experience.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-4 px-8 py-3 bg-primary text-on-primary text-xs font-bold tracking-widest uppercase hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            </motion.div>
          ) : (
            /* ── Form ── */
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 h-full">
              {/* Order context */}
              <div className="flex gap-4 bg-surface-container-low border border-outline-variant/30 p-4">
                <div className="relative w-14 h-18 flex-shrink-0 bg-surface-container overflow-hidden border border-outline-variant/20">
                  <Image
                    src={order.image}
                    alt={order.name}
                    fill
                    sizes="56px"
                    className="object-cover grayscale"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-[10px] font-semibold text-secondary uppercase tracking-widest">
                    Order {order.id}
                  </span>
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide mt-0.5 leading-snug">
                    {order.name}
                  </p>
                  <p className="text-[11px] text-secondary mt-1">{order.date}</p>
                </div>
              </div>

              {/* Review text */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-widest uppercase text-secondary">
                  Your Review *
                </label>
                <textarea
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    setError("");
                  }}
                  rows={6}
                  placeholder="Share your experience with this piece — the fit, the quality, how it made you feel..."
                  className="w-full bg-surface-container border border-outline-variant px-4 py-3 text-sm text-primary placeholder:text-outline focus:outline-none focus:border-primary transition-colors resize-none leading-relaxed"
                />
                <div className="flex justify-between items-center">
                  {error ? (
                    <p className="text-[11px] text-error">{error}</p>
                  ) : (
                    <p className="text-[11px] text-secondary">Minimum 10 characters</p>
                  )}
                  <span className="text-[11px] text-secondary">{text.length}</span>
                </div>
              </div>

              {/* Location */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-widest uppercase text-secondary">
                  Your City *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. London"
                  className="w-full bg-surface-container border border-outline-variant px-4 py-3 text-sm text-primary placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
                />
                <p className="text-[11px] text-secondary">
                  Shown as "Verified Purchase — {location || "Your City"}"
                </p>
              </div>

              {/* Disclaimer */}
              <p className="text-[11px] text-secondary leading-relaxed border-t border-outline-variant/30 pt-4">
                Reviews are submitted under your account name and go live after admin
                approval. We do not publish reviews that contain offensive language.
              </p>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-primary text-on-primary text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
              >
                {submitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Submitting…
                  </>
                ) : (
                  "Submit Review"
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Details Drawer ───────────────────────────────────────────────────────────

function DetailsDrawer({
  order,
  onClose,
  onReview,
}: {
  order: OrderItem;
  onClose: () => void;
  onReview: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-lg h-full bg-white shadow-xl flex flex-col z-10 border-l border-outline-variant"
      >
        <div className="flex justify-between items-center px-8 py-6 border-b border-outline-variant/40">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
            Order Details
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-surface-container transition-colors">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto px-8 py-6 space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-semibold text-secondary uppercase tracking-widest block">Order ID</span>
              <p className="text-sm font-medium text-primary uppercase mt-0.5">{order.id}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-semibold text-secondary uppercase tracking-widest block">Order Date</span>
              <p className="text-sm text-primary mt-0.5">{order.date}</p>
            </div>
          </div>

          <div className="flex gap-4 bg-surface-container-low border border-outline-variant/30 p-4">
            <div className="relative w-16 h-20 bg-surface-container flex-shrink-0 overflow-hidden border border-outline-variant/20">
              <Image src={order.image} alt={order.name} fill sizes="64px" className="object-cover grayscale" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-primary uppercase tracking-wide">{order.name}</h4>
              <p className="text-[11px] text-secondary mt-1">Size: {order.size} · Color: {order.color}</p>
              <p className="text-[11px] text-secondary mt-0.5">Quantity: {order.quantity}</p>
              <p className="text-xs font-semibold text-primary mt-2">${order.price.toLocaleString()}.00</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-[10px] font-semibold text-primary tracking-widest uppercase flex items-center gap-1.5">
              <MapPin size={13} /> Shipping Address
            </h4>
            <div className="text-xs text-secondary leading-relaxed bg-surface border border-outline-variant/20 p-4">
              <p className="font-semibold text-primary uppercase">{order.address.name}</p>
              <p>{order.address.line1}</p>
              {order.address.line2 && <p>{order.address.line2}</p>}
              <p>{order.address.city}, {order.address.postcode}</p>
              <p className="uppercase">{order.address.country}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-[10px] font-semibold text-primary tracking-widest uppercase flex items-center gap-1.5">
              <CreditCard size={13} /> Payment Method
            </h4>
            <div className="text-xs text-secondary bg-surface border border-outline-variant/20 p-4">
              <p className="font-semibold text-primary">{order.paymentMethod}</p>
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-outline-variant/30">
            <div className="flex justify-between text-xs text-secondary">
              <span>Subtotal</span><span>${order.price.toLocaleString()}.00</span>
            </div>
            <div className="flex justify-between text-xs text-secondary">
              <span>Complimentary Shipping</span><span>$0.00</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-primary pt-2 border-t border-outline-variant/20">
              <span>Total Payment</span><span>${order.price.toLocaleString()}.00</span>
            </div>
          </div>

          {/* Leave a review CTA — only for delivered orders */}
          {order.status === "COMPLETED" && (
            <div className="pt-2 border-t border-outline-variant/30">
              <button
                onClick={() => { onClose(); onReview(); }}
                className="w-full py-3.5 border border-primary text-primary text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-primary hover:text-on-primary transition-all"
              >
                <MessageSquarePlus size={14} />
                Leave a Review
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [reviewOrder, setReviewOrder] = useState<OrderItem | null>(null);

  useEffect(() => {
    fetch("/api/customer/orders")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setOrders(json.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-12 px-5 md:px-16 max-w-screen-xl mx-auto w-full min-h-screen">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-secondary mb-10">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link href="/profile" className="hover:text-primary transition-colors">My Account</Link>
        <span>/</span>
        <span className="text-primary">Order History</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="mb-8">
            <h2 className="text-2xl font-light uppercase tracking-tight text-primary">My Account</h2>
            <p className="text-xs text-secondary mt-1">Manage your preferences</p>
          </div>
          <nav className="flex flex-col border border-outline-variant/30 divide-y divide-outline-variant/30">
            <Link href="/profile" className="flex items-center gap-3 px-6 py-4 hover:bg-surface-container transition-colors text-sm text-secondary hover:text-primary">
              <User size={16} /><span>Account Overview</span>
            </Link>
            <Link href="/order-history" className="flex items-center gap-3 px-6 py-4 bg-surface-container-low text-sm font-semibold text-primary border-l-2 border-primary">
              <History size={16} /><span>Order History</span>
            </Link>
            <Link href="/shipping-addresses" className="flex items-center gap-3 px-6 py-4 hover:bg-surface-container transition-colors text-sm text-secondary hover:text-primary">
              <MapPin size={16} /><span>Shipping Addresses</span>
            </Link>
          </nav>
        </aside>

        {/* Orders list */}
        <section className="flex-grow">
          <header className="mb-8">
            <p className="text-xs text-secondary uppercase tracking-widest mb-1.5">Account / Settings</p>
            <h1 className="text-3xl font-light tracking-tight text-primary uppercase">Order History</h1>
            <div className="h-[1px] bg-outline-variant/40 mt-4 w-full" />
          </header>

          {loading ? (
            <div className="space-y-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse flex gap-6 pb-8 border-b border-outline-variant/30">
                  <div className="w-10 h-6 bg-surface-container rounded" />
                  <div className="w-36 aspect-[4/5] bg-surface-container flex-shrink-0" />
                  <div className="flex-grow space-y-3 pt-2">
                    <div className="h-3 w-24 bg-surface-container rounded" />
                    <div className="h-4 w-48 bg-surface-container rounded" />
                    <div className="h-3 w-32 bg-surface-container rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
              <History size={40} strokeWidth={1} className="text-outline" />
              <p className="text-sm text-secondary">No orders yet.</p>
              <Link href="/collection" className="text-xs font-bold tracking-widest uppercase border-b border-primary text-primary pb-0.5 hover:opacity-70 transition-opacity">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  className="group flex flex-col md:flex-row gap-6 border-b border-outline-variant/30 pb-8 items-start"
                >
                  {/* Index */}
                  <div className="text-4xl font-light text-outline-variant/50 flex-shrink-0 w-10">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  {/* Thumbnail */}
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

                  {/* Details */}
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
                          <span className="w-1.5 h-1.5 rounded-full bg-black" />
                          <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">
                            {STATUS_LABEL[order.status]}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-5 py-2.5 border border-primary text-[10px] font-semibold uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all duration-300"
                        >
                          View Details
                        </button>

                        {order.status === "SHIPPED" && (
                          <button className="px-5 py-2.5 bg-primary text-on-primary text-[10px] font-semibold uppercase tracking-widest hover:opacity-85 transition-opacity flex items-center gap-1.5">
                            <Truck size={12} /> Track
                          </button>
                        )}

                        {order.status === "COMPLETED" && (
                          <button
                            onClick={() => setReviewOrder(order)}
                            className="px-5 py-2.5 border border-outline-variant text-[10px] font-semibold uppercase tracking-widest hover:border-primary hover:text-primary transition-all duration-300 flex items-center gap-1.5 text-secondary"
                          >
                            <MessageSquarePlus size={12} />
                            Review
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ── Drawers ── */}
      <AnimatePresence>
        {selectedOrder && (
          <DetailsDrawer
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onReview={() => setReviewOrder(selectedOrder)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {reviewOrder && (
          <ReviewDrawer
            order={reviewOrder}
            onClose={() => setReviewOrder(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

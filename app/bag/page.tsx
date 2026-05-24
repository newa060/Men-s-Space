"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import {
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  MapPin,
  CheckCircle,
  Loader2,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Checkout Steps ───────────────────────────────────────────────────────────

type Step = "bag" | "checkout" | "confirmed";

export default function ShoppingBagPage() {
  const router = useRouter();
  const {
    items,
    updateQuantity,
    removeItem,
    subtotal,
    itemCount,
    addresses,
    user,
    placeOrder,
    clearCart,
  } = useCart();

  const [step, setStep] = useState<Step>("bag");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || ""
  );
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [confirmedOrderId, setConfirmedOrderId] = useState("");
  const [showAddressList, setShowAddressList] = useState(false);

  const shippingCost = subtotal > 500 ? 0 : 35;
  const grandTotal = subtotal - discount + shippingCost;

  const selectedAddress =
    addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  // ── Promo ──────────────────────────────────────────────────────────────────

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    if (promoCode.trim().toUpperCase() === "ARCHITECT") {
      setDiscount(subtotal * 0.1);
    } else {
      setPromoError("Invalid promo code.");
    }
  };

  // ── Checkout ───────────────────────────────────────────────────────────────

  const handleProceedToCheckout = () => {
    if (!user) {
      router.push("/sign-in?redirect=/bag");
      return;
    }
    // Sync selected address to default if not set
    if (!selectedAddressId && addresses.length > 0) {
      setSelectedAddressId(addresses.find((a) => a.isDefault)?.id || addresses[0].id);
    }
    setStep("checkout");
  };

  const handlePlaceOrder = async () => {
    if (!user) return;
    setPlacing(true);
    setOrderError("");

    const result = await placeOrder(user.fullName, user.email);

    if (result.success) {
      setConfirmedOrderId(result.data?.id || "AES-XXXXXX");
      setStep("confirmed");
    } else {
      setOrderError(result.error || "Something went wrong. Please try again.");
    }
    setPlacing(false);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // CONFIRMED
  // ─────────────────────────────────────────────────────────────────────────

  if (step === "confirmed") {
    return (
      <div className="py-24 px-5 md:px-16 max-w-screen-xl mx-auto w-full min-h-[70vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center gap-6 max-w-md"
        >
          <CheckCircle size={56} strokeWidth={1} className="text-primary" />
          <div>
            <h1 className="text-3xl font-light uppercase tracking-tight text-primary">
              Order Confirmed
            </h1>
            <p className="text-sm text-secondary mt-2 leading-relaxed">
              Thank you for your order. We&apos;ll send a confirmation to{" "}
              <span className="text-primary font-medium">{user?.email}</span>.
            </p>
          </div>
          <div className="bg-surface-container border border-outline-variant/40 px-8 py-4 w-full">
            <p className="text-xs text-secondary uppercase tracking-widest">Order ID</p>
            <p className="text-lg font-light text-primary mt-1 tracking-wide">
              {confirmedOrderId}
            </p>
          </div>
          <div className="flex gap-4 mt-2 w-full">
            <Link
              href="/order-history"
              className="flex-1 py-3.5 border border-primary text-primary text-xs font-bold tracking-widest uppercase text-center hover:bg-primary hover:text-on-primary transition-all"
            >
              View Orders
            </Link>
            <Link
              href="/collection"
              className="flex-1 py-3.5 bg-primary text-on-primary text-xs font-bold tracking-widest uppercase text-center hover:opacity-90 transition-opacity"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // EMPTY BAG
  // ─────────────────────────────────────────────────────────────────────────

  if (items.length === 0 && step !== "confirmed") {
    return (
      <div className="py-12 px-5 md:px-16 max-w-screen-xl mx-auto w-full min-h-[70vh]">
        <div className="border-b border-outline-variant/60 pb-6 mb-10">
          <h1 className="text-3xl md:text-4xl font-light uppercase tracking-tight text-primary">
            Shopping Bag
          </h1>
          <p className="text-sm text-secondary mt-1">0 items in your bag</p>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center gap-6">
          <ShoppingBag size={48} strokeWidth={1} className="text-outline" />
          <p className="text-secondary">Your shopping bag is currently empty.</p>
          <Link
            href="/collection"
            className="bg-primary text-on-primary px-8 py-4 text-xs tracking-widest font-bold hover:opacity-90 transition-opacity uppercase"
          >
            Explore Collection
          </Link>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // BAG + CHECKOUT
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="py-12 px-5 md:px-16 max-w-screen-xl mx-auto w-full min-h-[70vh]">
      {/* Header */}
      <div className="border-b border-outline-variant/60 pb-6 mb-10">
        <div className="flex items-center gap-3">
          {step === "checkout" && (
            <button
              onClick={() => setStep("bag")}
              className="text-secondary hover:text-primary transition-colors text-xs uppercase tracking-widest font-semibold"
            >
              ← Back
            </button>
          )}
          <h1 className="text-3xl md:text-4xl font-light uppercase tracking-tight text-primary">
            {step === "checkout" ? "Checkout" : "Shopping Bag"}
          </h1>
        </div>
        <p className="text-sm text-secondary mt-1">
          {itemCount} item{itemCount !== 1 ? "s" : ""} in your bag
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* ── Left: Items / Checkout details ── */}
        <section className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            {step === "bag" ? (
              <motion.div
                key="bag-items"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="flex gap-6 pb-6 border-b border-outline-variant/40"
                  >
                    <div className="relative w-28 h-36 bg-surface-container flex-shrink-0 border border-outline-variant/20 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                        sizes="112px"
                      />
                    </div>

                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h2 className="text-sm font-medium tracking-wide uppercase text-primary">
                            {item.name}
                          </h2>
                          <span className="text-sm font-semibold">
                            ${(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-secondary mt-1">
                          Size:{" "}
                          <span className="text-primary font-medium">{item.size}</span>{" "}
                          &middot; Color:{" "}
                          <span className="text-primary font-medium">{item.color}</span>
                        </p>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center border border-outline-variant">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.size, item.quantity - 1)
                            }
                            className="p-2 hover:bg-surface-container transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-4 text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.size, item.quantity + 1)
                            }
                            className="p-2 hover:bg-surface-container transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id, item.size)}
                          className="text-xs text-secondary hover:text-primary transition-colors flex items-center gap-1"
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="checkout-details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* ── Delivery Address ── */}
                <div className="space-y-4">
                  <h2 className="text-xs font-bold tracking-widest uppercase text-primary flex items-center gap-2">
                    <MapPin size={14} /> Delivery Address
                  </h2>

                  {addresses.length === 0 ? (
                    <div className="border border-outline-variant p-5 text-sm text-secondary">
                      No saved addresses.{" "}
                      <Link
                        href="/shipping-addresses"
                        className="text-primary underline underline-offset-2"
                      >
                        Add one
                      </Link>{" "}
                      before placing your order.
                    </div>
                  ) : (
                    <div className="border border-outline-variant">
                      {/* Selected address */}
                      {selectedAddress && (
                        <div className="p-5 flex justify-between items-start">
                          <div className="text-sm leading-relaxed">
                            <p className="font-semibold text-primary uppercase">
                              {selectedAddress.name}
                            </p>
                            <p className="text-secondary mt-0.5">{selectedAddress.line1}</p>
                            {selectedAddress.line2 && (
                              <p className="text-secondary">{selectedAddress.line2}</p>
                            )}
                            <p className="text-secondary">
                              {selectedAddress.city}, {selectedAddress.postcode}
                            </p>
                            <p className="text-secondary uppercase">
                              {selectedAddress.country}
                            </p>
                          </div>
                          {addresses.length > 1 && (
                            <button
                              onClick={() => setShowAddressList((v) => !v)}
                              className="text-xs text-primary flex items-center gap-1 hover:opacity-70 transition-opacity ml-4 flex-shrink-0"
                            >
                              Change{" "}
                              {showAddressList ? (
                                <ChevronUp size={12} />
                              ) : (
                                <ChevronDown size={12} />
                              )}
                            </button>
                          )}
                        </div>
                      )}

                      {/* Address picker */}
                      <AnimatePresence>
                        {showAddressList && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-outline-variant/40"
                          >
                            {addresses
                              .filter((a) => a.id !== selectedAddressId)
                              .map((addr) => (
                                <button
                                  key={addr.id}
                                  onClick={() => {
                                    setSelectedAddressId(addr.id);
                                    setShowAddressList(false);
                                  }}
                                  className="w-full text-left p-5 hover:bg-surface-container transition-colors border-b border-outline-variant/20 last:border-0"
                                >
                                  <p className="text-xs font-semibold text-primary uppercase">
                                    {addr.name}
                                  </p>
                                  <p className="text-xs text-secondary mt-0.5">
                                    {addr.line1}, {addr.city}, {addr.country}
                                  </p>
                                </button>
                              ))}
                            <Link
                              href="/shipping-addresses"
                              className="block p-5 text-xs text-primary hover:bg-surface-container transition-colors"
                            >
                              + Manage addresses
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                {/* ── Order items summary ── */}
                <div className="space-y-4">
                  <h2 className="text-xs font-bold tracking-widest uppercase text-primary">
                    Order Summary
                  </h2>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={`${item.id}-${item.size}`}
                        className="flex gap-4 items-center"
                      >
                        <div className="relative w-12 h-16 bg-surface-container flex-shrink-0 border border-outline-variant/20 overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="48px"
                            className="object-cover grayscale"
                          />
                        </div>
                        <div className="flex-grow">
                          <p className="text-xs font-medium uppercase text-primary">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-secondary mt-0.5">
                            {item.size} · {item.color} · Qty {item.quantity}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-primary">
                          ${(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Error ── */}
                {orderError && (
                  <div className="bg-error/10 border border-error/30 text-error text-xs p-4 uppercase tracking-wider">
                    {orderError}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ── Right: Order summary panel ── */}
        <section className="lg:col-span-4 bg-surface-container-low border border-outline-variant/55 p-8 space-y-6 sticky top-24">
          <h3 className="text-xs font-bold text-primary tracking-widest border-b border-outline-variant/60 pb-3 uppercase">
            Price Details
          </h3>

          <div className="space-y-3.5 text-sm text-secondary border-b border-outline-variant/40 pb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-primary font-medium">${subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Discount (10%)</span>
                <span>-${discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-primary font-medium">
                {shippingCost === 0 ? "Complimentary" : `$${shippingCost}`}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center text-base text-primary font-semibold">
            <span>Estimated Total</span>
            <span>${grandTotal.toLocaleString()}</span>
          </div>

          {/* Promo — only on bag step */}
          {step === "bag" && (
            <form onSubmit={handleApplyPromo} className="flex flex-col gap-1.5">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="PROMO CODE"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value);
                    setPromoError("");
                  }}
                  className="flex-grow bg-background border border-outline-variant px-3 py-2 text-xs focus:outline-none focus:border-primary uppercase placeholder:text-outline/70"
                />
                <button
                  type="submit"
                  className="bg-primary text-on-primary px-4 py-2 text-xs font-bold uppercase hover:opacity-90 transition-opacity"
                >
                  Apply
                </button>
              </div>
              {promoError && (
                <p className="text-[11px] text-error">{promoError}</p>
              )}
              {discount > 0 && (
                <p className="text-[11px] text-primary">
                  ✓ Code applied — 10% off
                </p>
              )}
            </form>
          )}

          {/* CTA */}
          {step === "bag" ? (
            <button
              onClick={handleProceedToCheckout}
              className="w-full bg-primary text-on-primary py-4 text-xs tracking-[0.2em] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity uppercase"
            >
              {user ? (
                <>
                  Proceed to Checkout <ArrowRight size={14} />
                </>
              ) : (
                <>
                  Sign In to Checkout <ArrowRight size={14} />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handlePlaceOrder}
              disabled={placing || addresses.length === 0}
              className="w-full bg-primary text-on-primary py-4 text-xs tracking-[0.2em] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity uppercase disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {placing ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Placing Order…
                </>
              ) : (
                <>
                  <Lock size={13} /> Place Order · ${grandTotal.toLocaleString()}
                </>
              )}
            </button>
          )}

          <p className="text-[11px] text-secondary text-center leading-relaxed">
            {step === "checkout"
              ? "By placing your order you agree to our terms of service."
              : "Free shipping on orders over $500. Duties calculated at checkout."}
          </p>
        </section>
      </div>
    </div>
  );
}

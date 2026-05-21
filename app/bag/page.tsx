"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";

export default function ShoppingBag() {
  const { items, updateQuantity, removeItem, subtotal, itemCount } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const handleApplyPromo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "ARCHITECT") {
      setDiscount(subtotal * 0.1);
    } else {
      alert("Invalid promo code. Use 'ARCHITECT' for 10% off.");
    }
  };

  const shippingCost = subtotal > 500 ? 0 : 35;
  const grandTotal = subtotal - discount + shippingCost;

  return (
    <div className="py-12 px-5 md:px-16 max-w-screen-xl mx-auto w-full min-h-[70vh]">
      <div className="border-b border-outline-variant/60 pb-6 mb-10">
        <h1 className="text-3xl md:text-4xl font-light uppercase tracking-tight text-primary">
          Shopping Bag
        </h1>
        <p className="text-sm text-secondary mt-1">
          {itemCount} item{itemCount !== 1 ? "s" : ""} in your bag
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-6">
          <p className="text-secondary text-lg">Your shopping bag is currently empty.</p>
          <Link
            href="/collection"
            className="bg-primary text-on-primary px-8 py-4 text-label-caps tracking-widest font-semibold hover:bg-neutral-800 transition-colors uppercase"
          >
            Explore Collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <section className="lg:col-span-8 space-y-6">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="flex gap-6 pb-6 border-b border-outline-variant/40"
              >
                <div className="relative w-28 h-36 bg-surface-container flex-shrink-0 border border-outline-variant/20">
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
                      <span className="text-sm font-semibold">${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-secondary mt-1">
                      Size: <span className="text-primary font-medium">{item.size}</span> &middot; Color:{" "}
                      <span className="text-primary font-medium">{item.color}</span>
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center border border-outline-variant">
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        className="p-2 hover:bg-surface-container transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-4 text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        className="p-2 hover:bg-surface-container transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="flex gap-4 items-center">
                      <button
                        onClick={() => removeItem(item.id, item.size)}
                        className="text-xs text-secondary hover:text-primary transition-colors flex items-center gap-1"
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                      <span className="text-xs text-outline-variant">|</span>
                      <button className="text-xs text-secondary hover:text-primary transition-colors">
                        Save for later
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>

          <section className="lg:col-span-4 bg-surface-container-low border border-outline-variant/55 p-8 space-y-6">
            <h3 className="text-label-caps text-primary tracking-widest border-b border-outline-variant/60 pb-3 uppercase font-semibold">
              Order Summary
            </h3>

            <div className="space-y-3.5 text-sm text-secondary border-b border-outline-variant/40 pb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-primary font-medium">${subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount</span>
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

            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                placeholder="ENTER CODE"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-grow bg-background border border-outline-variant px-3 py-2 text-xs focus:outline-none focus:border-primary uppercase placeholder:text-outline/70"
              />
              <button
                type="submit"
                className="bg-primary text-on-primary px-4 py-2 text-xs font-semibold label-caps hover:bg-neutral-800 transition-colors uppercase"
              >
                Apply
              </button>
            </form>

            <button
              onClick={() => alert("Checkout flow simulation. Thank you for shopping with AESTHETE.")}
              className="w-full bg-primary text-on-primary py-4 text-label-caps tracking-[0.2em] font-semibold flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors uppercase"
            >
              Proceed to Checkout <ArrowRight size={14} />
            </button>
          </section>
        </div>
      )}
    </div>
  );
}

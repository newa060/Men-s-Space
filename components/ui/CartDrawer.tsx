"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { items, removeItem, updateQuantity, subtotal, itemCount } = useCart();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-background flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant">
              <div>
                <p className="label-caps text-secondary">Your Bag</p>
                <p className="text-sm text-on-surface-variant mt-0.5">{itemCount} item{itemCount !== 1 ? "s" : ""}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-surface-container transition-colors" aria-label="Close cart">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                  <ShoppingBag size={48} strokeWidth={1} className="text-outline" />
                  <p className="text-on-surface-variant">Your bag is empty</p>
                  <button onClick={onClose} className="label-caps border border-primary px-6 py-3 hover:bg-primary hover:text-on-primary transition-colors">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative w-24 h-32 bg-surface-container flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={onClose}
                          className="text-sm font-medium tracking-wide hover:opacity-60 transition-opacity"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-secondary mt-1">
                          {item.size} · {item.color}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-outline-variant">
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                            className="p-1.5 hover:bg-surface-container transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-3 text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                            className="p-1.5 hover:bg-surface-container transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Price & Remove */}
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-sm font-medium">${(item.price * item.quantity).toLocaleString()}</span>
                          <button
                            onClick={() => removeItem(item.id, item.size)}
                            className="text-xs text-secondary hover:text-primary transition-colors underline underline-offset-2"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-outline-variant px-6 py-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-secondary">Subtotal</span>
                  <span className="font-medium">${subtotal.toLocaleString()}</span>
                </div>
                <p className="text-xs text-secondary">Shipping and taxes calculated at checkout</p>
                <Link
                  href="/bag"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 w-full bg-primary text-on-primary py-4 label-caps hover:bg-primary-container transition-colors"
                >
                  View Bag <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

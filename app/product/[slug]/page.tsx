"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Shield, Truck, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAdmin } from "@/context/AdminContext";

export default function ProductPage() {
  const { products } = useAdmin();
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const { addItem, openCart } = useCart();

  const product = products.find(p => p.slug === slug || p.id === slug) || products.find(p => p.category === "Outerwear") || products[0];

  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState(
    product?.colors?.[0]?.name || "Default"
  );

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-secondary text-xs tracking-widest uppercase">
        Product not found
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      image: product.images?.[0] || product.image,
      slug: product.slug,
    });
    openCart();
  };

  return (
    <div className="min-h-screen pt-12 pb-24 px-5 md:px-16 max-w-screen-xl mx-auto w-full">
      {/* ─── Breadcrumb ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-xs text-secondary mb-10">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/collection" className="hover:text-primary transition-colors">Collection</Link>
        <ChevronRight size={12} />
        <span className="text-primary">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        {/* ─── Column 1: Details (Desktop Sticky Left) ───────────── */}
        <section className="md:col-span-3 space-y-8 order-2 md:order-1 md:sticky md:top-24">
          <div className="space-y-2">
            <span className="text-label-caps text-secondary tracking-widest block uppercase">
              {product.category}
            </span>
            <h1 className="text-3xl font-light uppercase text-primary tracking-tight">
              {product.name}
            </h1>
          </div>

          <div className="space-y-3">
            <h3 className="text-label-caps text-primary tracking-widest">Architectural Form</h3>
            <p className="text-sm text-secondary leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="space-y-4 pt-6 border-t border-outline-variant/60">
            <h3 className="text-label-caps text-primary tracking-widest">Technical Specifications</h3>
            <ul className="text-xs text-secondary space-y-2.5">
              <li className="flex justify-between">
                <span>Material</span>
                <span className="text-primary font-medium">{product.materials || "Curated Materials"}</span>
              </li>
              <li className="flex justify-between">
                <span>Waterproof</span>
                <span className="text-primary font-medium">{product.waterproof || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span>Breathability</span>
                <span className="text-primary font-medium">{product.breathability || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span>Hardware</span>
                <span className="text-primary font-medium">{product.hardware || "Premium Details"}</span>
              </li>
              <li className="flex justify-between">
                <span>Seams</span>
                <span className="text-primary font-medium">{product.seams || "Reinforced Seams"}</span>
              </li>
            </ul>
          </div>
        </section>

        {/* ─── Column 2: Gallery (Scroll Center) ─────────────────── */}
        <section className="md:col-span-6 space-y-8 order-1 md:order-2">
          {(product.images || [product.image]).map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="aspect-[4/5] bg-surface-container relative overflow-hidden group border border-outline-variant/20"
            >
              <Image
                src={src}
                alt={`${product.name} view ${index + 1}`}
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index === 0}
              />
            </motion.div>
          ))}
        </section>

        {/* ─── Column 3: Actions (Desktop Sticky Right) ──────────── */}
        <section className="md:col-span-3 space-y-8 order-3 md:sticky md:top-24">
          <div className="space-y-1 border-b border-outline-variant/40 pb-4">
            <p className="text-2xl font-light text-primary">${product.price.toLocaleString()}.00</p>
            <p className="text-xs text-secondary">Excl. duties &amp; taxes</p>
          </div>

          {/* Size Select */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-label-caps text-primary tracking-widest">Select Size</span>
              <button className="text-secondary underline hover:text-primary transition-colors">
                Size Guide
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {["S", "M", "L", "XL"].map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`py-3 text-xs tracking-wider border font-medium transition-colors ${
                    selectedSize === sz
                      ? "border-primary bg-primary text-on-primary"
                      : "border-outline-variant text-secondary hover:border-primary hover:text-primary"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Color Select */}
          <div className="space-y-3">
            <h3 className="text-label-caps text-primary tracking-widest">Select Color</h3>
            <div className="flex gap-4">
              {(product.colors || [{ name: "Default", hex: "#000000" }]).map((col) => (
                <button
                  key={col.name}
                  onClick={() => setSelectedColor(col.name)}
                  className="flex flex-col items-center gap-1.5 group focus:outline-none"
                >
                  <div
                    className={`w-9 h-9 rounded-full border p-0.5 transition-all ${
                      selectedColor === col.name ? "border-primary" : "border-transparent group-hover:border-outline"
                    }`}
                  >
                    <div
                      className="w-full h-full rounded-full border border-black/10"
                      style={{ backgroundColor: col.hex }}
                    />
                  </div>
                  <span className="text-[10px] text-secondary group-hover:text-primary transition-colors tracking-wide uppercase">
                    {col.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="pt-4">
            <button
              onClick={handleAddToCart}
              className="w-full bg-primary text-on-primary py-4 text-label-caps tracking-[0.2em] font-semibold hover:bg-primary-container transition-colors border border-primary uppercase"
            >
              Add to Bag
            </button>
          </div>

          {/* Features */}
          <div className="pt-6 border-t border-outline-variant/40 space-y-3">
            <div className="flex items-center gap-3 text-secondary text-xs">
              <Truck size={16} strokeWidth={1.5} />
              <span>Complimentary Express Shipping</span>
            </div>
            <div className="flex items-center gap-3 text-secondary text-xs">
              <Shield size={16} strokeWidth={1.5} />
              <span>2 Year Technical Warranty</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

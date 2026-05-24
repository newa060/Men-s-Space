"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Shield, Truck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/context/AdminContext";
import { resolveColorHex } from "@/components/admin/productColorUtils";

export default function ProductPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const { addItem, openCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Default");
  const [activeSlide, setActiveSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setProduct(json.data);
          setSelectedColor(json.data.colors?.[0]?.name || "Default");
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-secondary text-xs tracking-widest uppercase">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-secondary text-xs tracking-widest uppercase">
        Product not found
      </div>
    );
  }

  // Build gallery: primary image + any additional images
  const gallery = [
    product.image,
    ...(product.images || []).filter((img) => img && img !== product.image),
  ].filter(Boolean);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      image: product.image,
      slug: product.slug,
    });
    openCart();
  };

  return (
    <div className="min-h-screen pt-12 pb-24 px-5 md:px-16 max-w-screen-xl mx-auto w-full">
      {/* Breadcrumb removed */}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        {/* ── Left: Details ── */}
        <section className="md:col-span-3 space-y-8 order-2 md:order-1 md:sticky md:top-24 self-start">
          <div className="space-y-2">
            <span className="text-label-caps text-secondary tracking-widest block uppercase">
              {product.category}
            </span>
            <h1 className="text-3xl font-light uppercase text-primary tracking-tight">
              {product.name}
            </h1>
          </div>

          {product.description && (
            <div className="space-y-3">
              <h3 className="text-label-caps text-primary tracking-widest">About</h3>
              <p className="text-sm text-secondary leading-relaxed">{product.description}</p>
            </div>
          )}

          {(() => {
            const hasSpecs = product.materials || product.waterproof || product.breathability || product.hardware || product.seams;
            if (!hasSpecs) return null;
            return (
              <div className="space-y-4 pt-6 border-t border-outline-variant/60">
                <h3 className="text-label-caps text-primary tracking-widest">Technical Specifications</h3>
                <ul className="text-xs text-secondary space-y-2.5">
                  {product.materials && (
                    <li className="flex justify-between">
                      <span>Material</span>
                      <span className="text-primary font-medium">{product.materials}</span>
                    </li>
                  )}
                  {product.waterproof && (
                    <li className="flex justify-between">
                      <span>Waterproof</span>
                      <span className="text-primary font-medium">{product.waterproof}</span>
                    </li>
                  )}
                  {product.breathability && (
                    <li className="flex justify-between">
                      <span>Breathability</span>
                      <span className="text-primary font-medium">{product.breathability}</span>
                    </li>
                  )}
                  {product.hardware && (
                    <li className="flex justify-between">
                      <span>Hardware</span>
                      <span className="text-primary font-medium">{product.hardware}</span>
                    </li>
                  )}
                  {product.seams && (
                    <li className="flex justify-between">
                      <span>Seams</span>
                      <span className="text-primary font-medium">{product.seams}</span>
                    </li>
                  )}
                </ul>
              </div>
            );
          })()}
        </section>

        {/* ── Center: Gallery ── */}
        <section className="md:col-span-6 order-1 md:order-2">
          {/* Mobile: single-image slider */}
          <div className="block md:hidden">
            <div
              className="relative aspect-[4/5] bg-surface-container overflow-hidden border border-outline-variant/20 -mx-5"
              onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
              onTouchEnd={(e) => {
                if (touchStartX.current === null) return;
                const diff = touchStartX.current - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 40) {
                  if (diff > 0 && activeSlide < gallery.length - 1) {
                    setSlideDirection(1);
                    setActiveSlide((p) => p + 1);
                  } else if (diff < 0 && activeSlide > 0) {
                    setSlideDirection(-1);
                    setActiveSlide((p) => p - 1);
                  }
                }
                touchStartX.current = null;
              }}
            >
              <AnimatePresence initial={false} custom={slideDirection} mode="popLayout">
                <motion.div
                  key={activeSlide}
                  custom={slideDirection}
                  variants={{
                    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
                    center: { x: 0, opacity: 1 },
                    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.45, ease: [0.32, 0, 0.67, 0] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={gallery[activeSlide]}
                    alt={`${product.name} view ${activeSlide + 1}`}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority={activeSlide === 0}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Slide counter */}
              {gallery.length > 1 && (
                <span className="absolute top-3 right-4 text-[10px] tracking-widest text-white/80 bg-black/30 px-2 py-0.5 backdrop-blur-sm">
                  {activeSlide + 1} / {gallery.length}
                </span>
              )}
            </div>

            {/* Dot indicators */}
            {gallery.length > 1 && (
              <div className="flex justify-center gap-2 mt-3">
                {gallery.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setSlideDirection(i > activeSlide ? 1 : -1); setActiveSlide(i); }}
                    className={`transition-all duration-300 rounded-full ${
                      i === activeSlide
                        ? "w-5 h-1.5 bg-primary"
                        : "w-1.5 h-1.5 bg-outline-variant"
                    }`}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Desktop: vertical stack */}
          <div className="hidden md:flex flex-col space-y-4">
            {gallery.map((src, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="aspect-[4/5] bg-surface-container relative overflow-hidden border border-outline-variant/20"
              >
                <Image
                  src={src}
                  alt={`${product.name} view ${index + 1}`}
                  fill
                  className="object-cover transition-all duration-700 ease-out"
                  sizes="50vw"
                  priority={index === 0}
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Right: Actions ── */}
        <section className="md:col-span-3 space-y-8 order-3 md:sticky md:top-24 self-start">
          <div className="space-y-1 border-b border-outline-variant/40 pb-4">
            <p className="text-2xl font-light text-primary">${product.price.toLocaleString()}.00</p>
            <p className="text-xs text-secondary">Excl. duties &amp; taxes</p>
          </div>

          {/* Size Select */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-label-caps text-primary tracking-widest">Select Size</span>
                <button className="text-secondary underline hover:text-primary transition-colors">
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((sz) => (
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
          )}

          {/* Color Select */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-label-caps text-primary tracking-widest">Select Color</h3>
              <div className="flex gap-4">
                {product.colors.map((col) => (
                  <button
                    key={col.name}
                    onClick={() => setSelectedColor(col.name)}
                    className="flex flex-col items-center gap-1.5 group focus:outline-none"
                  >
                    <div
                      className={`w-9 h-9 rounded-full border p-0.5 transition-all ${
                        selectedColor === col.name
                          ? "border-primary"
                          : "border-transparent group-hover:border-outline"
                      }`}
                    >
                      <div
                        className="w-full h-full rounded-full border border-black/10"
                        style={{ backgroundColor: resolveColorHex(col.hex, col.name) }}
                      />
                    </div>
                    <span className="text-[10px] text-secondary group-hover:text-primary transition-colors tracking-wide uppercase">
                      {col.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <div className="pt-4">
            <button
              onClick={handleAddToCart}
              className="w-full bg-primary text-on-primary py-4 text-label-caps tracking-[0.2em] font-semibold hover:bg-primary-container transition-colors border border-primary uppercase"
            >
              Add to Bag
            </button>
          </div>

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

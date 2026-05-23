"use client";

import { useEffect, useRef, useState } from "react";
import type { GalleryItem } from "@/lib/gallery/format";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAdmin } from "@/context/AdminContext";
import { ProductCardImage } from "@/components/ui/ProductCardImage";

export default function NewArrivals() {
  const { products, cmsData } = useAdmin();
  const archiveRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [archiveSlides, setArchiveSlides] = useState<GalleryItem[]>([]);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data?.length) {
          setArchiveSlides(json.data);
        }
      })
      .catch(console.error);
  }, []);

  const dynamicNewArrivals = products.filter(
    (p) => p.isNewArrival && p.status === "Active"
  );

  const categories = ["All", ...Array.from(new Set(dynamicNewArrivals.map((p) => p.category)))];

  const filteredNewArrivals = selectedCategory === "All"
    ? dynamicNewArrivals
    : dynamicNewArrivals.filter((p) => p.category === selectedCategory);

  const scrollArchive = (direction: "left" | "right") => {
    if (archiveRef.current) {
      const scrollAmount = 432; // card width + gap
      archiveRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* ─── Hero Section ─────────────────────────────────────────── */}
      <section className="relative h-[80vh] min-h-[500px] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-neutral-950">
          <Image
            src={cmsData.promoImage}
            alt={cmsData.promoHeading}
            fill
            priority
            unoptimized
            className="object-cover opacity-70"
            sizes="100vw"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6"
        >
          <p className="text-label-caps tracking-[0.4em] mb-4 text-on-primary/95">
            {cmsData.promoIntro}
          </p>
          <h1 className="text-4xl md:text-7xl font-light text-on-primary tracking-tighter uppercase mb-8">
            {cmsData.promoHeading}
          </h1>
          <Link
            href="/collection"
            className="inline-block bg-on-primary text-primary px-8 py-4 text-label-caps tracking-widest font-semibold hover:bg-white/90 transition-colors"
          >
            {cmsData.promoCtaText}
          </Link>
        </motion.div>
      </section>

      {/* ─── Category Sidebar & Grid ────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-5 md:px-16 py-24 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Sidebar */}
          <aside className="md:col-span-3 border-r border-outline-variant/50 pr-8">
            <h3 className="text-label-caps text-primary border-b border-primary pb-2 inline-block mb-6 tracking-widest">
              CATEGORIES
            </h3>
            <ul className="space-y-4 text-sm text-secondary">
              {categories.map((cat) => {
                const count = cat === "All"
                  ? dynamicNewArrivals.length
                  : dynamicNewArrivals.filter((p) => p.category === cat).length;
                const isSelected = selectedCategory === cat;
                return (
                  <li
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`hover:text-primary cursor-pointer transition-colors ${
                      isSelected
                        ? "font-medium text-primary underline underline-offset-4"
                        : ""
                    }`}
                  >
                    {cat} ({count.toString().padStart(2, "0")})
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Grid */}
          <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
            {filteredNewArrivals.length === 0 ? (
              <div className="col-span-3 text-center py-20 text-secondary text-xs uppercase tracking-widest">
                No new arrivals available in this category.
              </div>
            ) : (
              filteredNewArrivals.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="group cursor-pointer"
                >
                  <Link href={`/product/${product.slug}`}>
                    <div className="aspect-[4/5] overflow-hidden bg-surface-container mb-4 relative">
                      <ProductCardImage
                        image={product.image}
                        images={product.images}
                        alt={product.name}
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium tracking-wide uppercase text-primary mb-1">
                          {product.name}
                        </h4>
                        <p className="text-xs text-secondary tracking-wider uppercase">
                          {product.series || "Series 02 / Item"}
                        </p>
                      </div>
                      <span className="text-label-caps text-primary">${product.price.toFixed(2)}</span>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ─── Archive Slider ───────────────────────────────────────── */}
      <section className="bg-surface-container py-24 overflow-hidden w-full border-t border-outline-variant/20">
        <div className="max-w-screen-xl mx-auto px-5 md:px-16 mb-10 flex justify-between items-end">
          <div>
            <span className="text-label-caps text-secondary uppercase tracking-widest">
              Insta ID: @Aesthete_Official
            </span>
            <h2 className="text-3xl font-light uppercase tracking-tight text-primary mt-2">
              Studio Archives
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scrollArchive("left")}
              className="p-3 bg-background hover:bg-primary hover:text-on-primary transition-colors border border-outline-variant"
              aria-label="Previous archive images"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scrollArchive("right")}
              className="p-3 bg-background hover:bg-primary hover:text-on-primary transition-colors border border-outline-variant"
              aria-label="Next archive images"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div
          ref={archiveRef}
          className="flex gap-6 overflow-x-auto no-scrollbar px-5 md:px-16 cursor-grab active:cursor-grabbing max-w-screen-xl mx-auto"
        >
          {archiveSlides.map((slide) => (
            <div
              key={slide.id}
              className="flex-none w-[340px] md:w-[400px] aspect-square bg-background relative overflow-hidden group border border-outline-variant/30"
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                unoptimized
                className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-700"
                sizes="(max-width: 768px) 340px, 400px"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ─── Critique Perspectives ───────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-5 md:px-16 py-24 w-full border-t border-outline-variant/40">
        <div className="max-w-3xl">
          <span className="text-label-caps text-secondary uppercase tracking-widest">
            Critic Perspectives
          </span>
          <blockquote className="mt-6">
            <p className="text-xl md:text-2xl font-light italic text-primary leading-relaxed">
              &ldquo;AESTHETE continues to redefine the boundary between urban gear and formal architecture. Series 02 is a masterclass in restraint, stripping away the noise to reveal pure structural intent.&rdquo;
            </p>
            <footer className="mt-4 text-label-caps text-primary tracking-widest font-semibold">
              — THE MONOLITH REVIEW
            </footer>
          </blockquote>
        </div>
      </section>
    </div>
  );
}

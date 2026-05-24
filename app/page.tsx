"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import type { GalleryItem } from "@/lib/gallery/format";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns";
import type { TestimonialItem } from "@/components/ui/testimonials-columns";

export default function Home() {
  const { cmsData } = useAdmin();
  // Gallery hover state for pausing the CSS animation
  const [isGalleryHovered, setIsGalleryHovered] = useState(false);

  const [gallerySlides, setGallerySlides] = useState<GalleryItem[]>([]);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data?.length) {
          setGallerySlides(json.data);
        }
      })
      .catch(console.error);
  }, []);


  // Dynamic categories derived from active products
  const [categories, setCategories] = useState<{ title: string; image: string; href: string }[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((json) => {
        if (!json.success || !json.data?.length) return;

        // Group products by category, preserving insertion order (already sorted by created_at desc)
        const seen = new Map<string, string>();
        for (const product of json.data as { category: string; image: string }[]) {
          if (product.category && product.image && !seen.has(product.category)) {
            seen.set(product.category, product.image);
          }
        }

        const derived = Array.from(seen.entries()).map(([title, image]) => ({
          title,
          image,
          href: `/collection?category=${encodeURIComponent(title.toLowerCase())}`,
        }));

        setCategories(derived);
      })
      .catch(console.error);
  }, []);

  // Fetch approved feedback dynamically from the public API
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);

  useEffect(() => {
    fetch("/api/feedback")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data?.length >= 1) {
          setTestimonials(
            json.data.map((f: { text: string; author: string; location: string }) => ({
              text: f.text,
              name: f.author,
              role: `Verified Purchase — ${f.location}`,
            }))
          );
        }
      })
      .catch(console.error);
  }, []);

  const fallbackTestimonials: TestimonialItem[] = [
    { text: "The silhouette of the trench coat is unmatched. Pure architectural bliss.", name: "Anonymous", role: "Verified Purchase — London" },
    { text: "Obsessed with the monochromatic palette. Getting ready every morning is an exercise in effortless luxury.", name: "Anonymous", role: "Verified Purchase — Tokyo" },
    { text: "Every piece feels considered. The weight of the fabric, the cut — nothing is accidental.", name: "Anonymous", role: "Verified Purchase — Paris" },
    { text: "I have never worn anything that draws this many compliments while saying so little.", name: "Anonymous", role: "Verified Purchase — New York" },
    { text: "Minimalism done right. These are not just clothes, they are a philosophy.", name: "Anonymous", role: "Verified Purchase — Berlin" },
    { text: "The quality justifies every penny. Pieces that look better with age.", name: "Anonymous", role: "Verified Purchase — Milan" },
    { text: "Wearing this brand changed how I think about getting dressed in the morning.", name: "Anonymous", role: "Verified Purchase — Seoul" },
    { text: "The outerwear collection is extraordinary. Structured, warm, and completely timeless.", name: "Anonymous", role: "Verified Purchase — Copenhagen" },
    { text: "I bought one piece and came back for three more within a month. That says everything.", name: "Anonymous", role: "Verified Purchase — Amsterdam" },
  ];

  const activeTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials;
  const col1 = activeTestimonials.slice(0, Math.ceil(activeTestimonials.length / 3));
  const col2 = activeTestimonials.slice(Math.ceil(activeTestimonials.length / 3), Math.ceil((activeTestimonials.length * 2) / 3));
  const col3 = activeTestimonials.slice(Math.ceil((activeTestimonials.length * 2) / 3));

  return (
    <div className="flex flex-col min-h-screen">
      {/* ─── Hero Section ─────────────────────────────────────────── */}
      <section className="relative h-[calc(100vh-4rem)] md:h-[90vh] min-h-[600px] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-neutral-900">
          <Image
            src={cmsData.heroImage}
            alt="High-end architectural fashion"
            fill
            priority
            className="object-cover opacity-80"
            sizes="100vw"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center px-6 max-w-4xl"
        >
          <h1 className="text-5xl md:text-8xl font-light text-on-primary tracking-tight uppercase leading-none mb-8">
            {cmsData.heroTitle.split(" ").map((word, i) => (
              <span key={i} className="block md:inline md:mr-4">
                {i % 2 === 1 ? <span className="italic font-serif">{word}</span> : word}
              </span>
            ))}
          </h1>
          <p className="text-lg md:text-xl text-on-primary/80 max-w-xl mx-auto mb-10 font-light leading-relaxed">
            {cmsData.heroSubtitle}
          </p>
          <div>
            <Link
              href="/collection"
              className="inline-block bg-on-primary text-primary px-10 py-4 text-label-caps tracking-widest font-semibold hover:bg-white/95 transition-colors border border-on-primary"
            >
              {cmsData.heroCtaText}
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ─── Category Selection ────────────────────────────────────── */}
      <section className="py-24 px-5 md:px-16 max-w-screen-xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <h2 className="text-3xl md:text-4xl font-light uppercase tracking-tight">Curated Selection</h2>
          <Link
            href="/collection"
            className="text-label-caps text-secondary hover:text-primary transition-colors border-b border-outline pb-1"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.length === 0
            ? // Skeleton placeholders while loading
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="animate-pulse">
                  <div className="aspect-[4/5] bg-surface-container mb-4" />
                  <div className="flex justify-between items-center px-1">
                    <div className="h-3 w-24 bg-surface-container rounded" />
                    <div className="h-4 w-4 bg-surface-container rounded" />
                  </div>
                </div>
              ))
            : categories.map((cat, idx) => (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group cursor-pointer"
                >
                  <Link href={cat.href}>
                    <div className="aspect-[4/5] bg-surface-container relative overflow-hidden mb-4">
                      <Image
                        src={cat.image}
                        alt={cat.title}
                        fill
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="flex justify-between items-center px-1">
                      <span className="text-label-caps text-primary tracking-widest uppercase">{cat.title}</span>
                      <ArrowUpRight size={16} className="text-secondary group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>
      </section>

      {/* ─── New Arrivals Promo ───────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-5 md:px-16 py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center border border-outline-variant/40 p-6 md:p-10 bg-surface-container">
          <div className="aspect-square relative overflow-hidden bg-surface-container-highest">
            <Image
              src={cmsData.promoImage}
              alt={cmsData.promoHeading}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="space-y-6">
            <span className="text-label-caps text-secondary uppercase tracking-widest">
              {cmsData.promoIntro}
            </span>
            <h2 className="text-3xl md:text-4xl font-light italic font-serif text-primary leading-tight">
              {cmsData.promoHeading}
            </h2>
            <Link
              href="/new-arrivals"
              className="inline-block bg-primary text-on-primary px-8 py-4 text-label-caps tracking-widest font-semibold hover:bg-primary-container transition-colors border border-primary uppercase"
            >
              {cmsData.promoCtaText}
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Social Gallery Slider ────────────────────────────────── */}
      <section className="bg-surface-container py-24 overflow-hidden w-full">
        {/* Header */}
        <div className="px-5 md:px-16 max-w-screen-xl mx-auto mb-10 flex items-center gap-4">
          <span className="text-label-caps text-secondary uppercase tracking-widest">Instagram</span>
          <h3 className="text-lg md:text-xl font-medium lowercase text-primary">@aesthete.studio</h3>
        </div>

        {/* Infinite scroll track */}
        <div
          className="overflow-hidden w-full"
          onMouseEnter={() => setIsGalleryHovered(true)}
          onMouseLeave={() => setIsGalleryHovered(false)}
        >
          {/* Fade edges */}
          <div className="relative">
            <div className="absolute left-0 top-0 h-full w-24 z-10 pointer-events-none"
              style={{ background: "linear-gradient(to right, var(--surface-container), transparent)" }}
            />
            <div className="absolute right-0 top-0 h-full w-24 z-10 pointer-events-none"
              style={{ background: "linear-gradient(to left, var(--surface-container), transparent)" }}
            />

            {/* Track — two identical copies for seamless loop */}
            <div
              className="flex gap-6"
              style={{
                width: "max-content",
                animation: "galleryScroll 40s linear infinite",
                animationPlayState: isGalleryHovered ? "paused" : "running",
                willChange: "transform",
              }}
            >
              {/* First copy */}
              {gallerySlides.map((slide, index) => (
                <div
                  key={`a-${slide.id}`}
                  className="flex-none w-72 md:w-80 aspect-square bg-background relative overflow-hidden group border border-outline-variant/30 cursor-pointer"
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    unoptimized
                    className="object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-[1.04] transition-all duration-700 ease-out"
                    sizes="320px"
                  />
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-all duration-700" />
                </div>
              ))}
              {/* Second copy — makes the loop invisible */}
              {gallerySlides.map((slide, index) => (
                <div
                  key={`b-${slide.id}`}
                  className="flex-none w-72 md:w-80 aspect-square bg-background relative overflow-hidden group border border-outline-variant/30 cursor-pointer"
                  aria-hidden="true"
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    unoptimized
                    className="object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-[1.04] transition-all duration-700 ease-out"
                    sizes="320px"
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-all duration-700" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* --- Testimonials ------------------------------------------------- */}
      <section className="py-24 px-5 md:px-16 max-w-screen-xl mx-auto w-full overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto mb-12"
        >
          <div className="flex justify-center mb-4">
            <span className="text-label-caps text-secondary uppercase tracking-widest border border-outline-variant px-4 py-1">
              Our Community
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-light uppercase tracking-tight text-center">
            What Our Clients Say
          </h2>
          <p className="text-center mt-4 text-on-surface-variant font-light text-sm">
            Worn and trusted by those who value craft over noise.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={col1} duration={15} />
          <TestimonialsColumn testimonials={col2} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={col3} className="hidden lg:block" duration={17} />
        </div>
      </section>
    </div>
  );
}

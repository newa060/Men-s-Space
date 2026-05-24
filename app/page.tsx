"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useAdmin } from "@/context/AdminContext";
import type { GalleryItem } from "@/lib/gallery/format";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns";
import type { TestimonialItem } from "@/components/ui/testimonials-columns";

export default function Home() {
  const { cmsData: adminCmsData } = useAdmin();
  
  // All state declarations first
  const [cmsData, setCmsData] = useState<typeof adminCmsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGalleryHovered, setIsGalleryHovered] = useState(false);
  const [gallerySlides, setGallerySlides] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<{ title: string; image: string; href: string }[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [newArrivals, setNewArrivals] = useState<{ id: string; name: string; image: string; price: number }[]>([]);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  // All effects together
  // Fetch fresh CMS data from the public endpoint on mount
  useEffect(() => {
    setIsLoading(true);
    fetch("/api/cms")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data) setCmsData(json.data);
        else setCmsData(adminCmsData);
      })
      .catch(() => setCmsData(adminCmsData))
      .finally(() => setIsLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Fetch new arrivals (products marked as new arrival, limit 3)
  useEffect(() => {
    fetch("/api/products?isNewArrival=true")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data?.length) {
          const latest = json.data.slice(0, 3).map((p: any) => ({
            id: p.id,
            name: p.name,
            image: p.image,
            price: p.price,
          }));
          setNewArrivals(latest);
        }
      })
      .catch(console.error);
  }, []);

  // Computed values
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

  // Show loading state until CMS data is fetched
  if (isLoading || !cmsData) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <div className="animate-pulse text-secondary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* ─── Hero Section ─────────────────────────────────────────── */}
      <section className="relative h-[calc(100vh-4rem)] md:h-[90vh] min-h-[600px] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-neutral-900/30">
          <Image
            key={cmsData.heroImage}
            src={cmsData.heroImage}
            alt="High-end architectural fashion"
            fill
            priority
            className="object-cover"
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
      <section className="py-16 px-4 md:px-12 lg:px-16 w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <h2 className="text-3xl md:text-4xl font-light uppercase tracking-tight">Curated Selection</h2>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (categoryScrollRef.current) {
                    categoryScrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
                  }
                }}
                className="p-2 border border-outline hover:border-primary hover:bg-surface-container transition-colors"
                aria-label="Previous categories"
              >
                <ChevronLeft size={20} className="text-secondary" />
              </button>
              <button
                onClick={() => {
                  if (categoryScrollRef.current) {
                    categoryScrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
                  }
                }}
                className="p-2 border border-outline hover:border-primary hover:bg-surface-container transition-colors"
                aria-label="Next categories"
              >
                <ChevronRight size={20} className="text-secondary" />
              </button>
            </div>
            <Link
              href="/collection"
              className="text-label-caps text-secondary hover:text-primary transition-colors border-b border-outline pb-1"
            >
              View All
            </Link>
          </div>
        </div>

        <div 
          ref={categoryScrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth"
        >
          {categories.length === 0
            ? // Skeleton placeholders while loading
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="flex-none w-[280px] md:w-[320px] animate-pulse">
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
                  className="flex-none w-[280px] md:w-[320px] group cursor-pointer"
                >
                  <Link href={cat.href}>
                    <div className="aspect-[4/5] bg-surface-container relative overflow-hidden mb-4">
                      <Image
                        src={cat.image}
                        alt={cat.title}
                        fill
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                        sizes="320px"
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

      {/* ─── New Arrivals / Shop Now ───────────────────────────────── */}
      <section className="px-4 md:px-12 lg:px-16 py-16 w-full">
        <div className="border border-outline-variant/40 p-8 md:p-12 bg-surface-container">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-outline-variant" />
              <span className="text-label-caps text-secondary uppercase tracking-widest">New Arrivals</span>
              <div className="w-8 h-[1px] bg-outline-variant" />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight mb-6">SHOP NOW</h2>
            <div className="flex justify-center gap-3 mb-8">
              <button className="px-6 py-2 bg-primary text-on-primary text-label-caps tracking-widest font-semibold uppercase">
                NEW ARRIVALS
              </button>
              <button className="px-6 py-2 border border-outline text-secondary text-label-caps tracking-widest font-semibold uppercase hover:border-primary hover:text-primary transition-colors">
                TRENDING
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {newArrivals.length === 0
              ? // Skeleton placeholders
                Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="animate-pulse">
                    <div className="aspect-[3/4] bg-surface-container-highest mb-4" />
                  </div>
                ))
              : newArrivals.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="group cursor-pointer"
                  >
                    <Link href={`/product/${product.id}`}>
                      <div className="aspect-[3/4] bg-surface-container-highest relative overflow-hidden mb-4">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    </Link>
                  </motion.div>
                ))}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link
              href="/new-arrivals"
              className="inline-block bg-primary text-on-primary px-12 py-4 text-label-caps tracking-widest font-semibold hover:bg-primary-container transition-colors uppercase"
            >
              EXPLORE THE SERIES
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
          <div className="relative">
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

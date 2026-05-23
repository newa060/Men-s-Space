"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import type { GalleryItem } from "@/lib/gallery/format";

export default function Home() {
  const { cmsData, feedbackItems } = useAdmin();
  const sliderRef = useRef<HTMLDivElement>(null);
  const scrollAnimationRef = useRef<any>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveredRef = useRef(false);

  const animateScroll = (target: number, duration = 1800) => {
    if (sliderRef.current) {
      const container = sliderRef.current;
      
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
      }

      const start = container.scrollLeft;
      const change = target - start;
      let startTime: number | null = null;

      const easeOutCubic = (t: number) => {
        return 1 - Math.pow(1 - t, 3);
      };

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);

        container.scrollLeft = start + change * easedProgress;

        if (progress < 1) {
          scrollAnimationRef.current = requestAnimationFrame(step);
        } else {
          scrollAnimationRef.current = null;
        }
      };

      scrollAnimationRef.current = requestAnimationFrame(step);
    }
  };

  const scrollSlider = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const container = sliderRef.current;
      const card = container.querySelector("div");
      const cardWidth = card ? card.clientWidth : 384;
      const gap = 24;
      const scrollAmount = cardWidth + gap;
      
      const start = container.scrollLeft;
      const end = direction === "left" ? start - scrollAmount : start + scrollAmount;
      
      const maxScroll = container.scrollWidth - container.clientWidth;
      const target = Math.max(0, Math.min(end, maxScroll));
      
      animateScroll(target, 1800);
      resetAutoplay();
    }
  };

  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimerRef.current = setInterval(() => {
      if (isHoveredRef.current) return;
      if (sliderRef.current) {
        const container = sliderRef.current;
        const card = container.querySelector("div");
        const cardWidth = card ? card.clientWidth : 384;
        const gap = 24;
        const scrollAmount = cardWidth + gap;
        const maxScroll = container.scrollWidth - container.clientWidth;
        
        let target = container.scrollLeft + scrollAmount;
        let duration = 1800;

        if (container.scrollLeft >= maxScroll - 10) {
          target = 0;
          duration = 2600;
        }

        animateScroll(target, duration);
      }
    }, 6000);
  };

  const stopAutoplay = () => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  };

  const resetAutoplay = () => {
    startAutoplay();
  };

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

  useEffect(() => {
    if (gallerySlides.length === 0) return;
    startAutoplay();
    return () => stopAutoplay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gallerySlides.length]);

  const categories = [
    {
      title: "Outerwear",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNTiPV-94sOcCV_ZNissk31ncdN23HhehqmCWT8-FQ9ITtuZ3kdB0pD9N0PXXGVaEX_EIzmeyjUC5exi5h2aw3rE-HfiHFKIzp71GbIWjsnAVXBixywaMgWLfxZiQim5ROHDjmCy-Qs5DOHUrz8AmFXqE-x4kqrP6Nr62IWNxEx8tf1luJjCKnvwft0BTid4PD2r7PGqjkHcbpbq03O7lMrnTthhPpi0VVHRpY6EF1yd_jZ-pZg5fnu6SKMgNKHUt47F6n_D0x3fqZ",
      href: "/collection?category=outerwear",
    },
    {
      title: "Essentials",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBe-urTEgU8HFiuU0ltKxyrWf9d9frl5rnmCLRUZ8Os0ZnnlFLqKLjC7A_axSSggPJxFspGPfAA2vN9BqhkgSEIBO-STI0_XTqtWfe2Lk8Hg4hTo_V_yyUGywUu8CGn05_KCLVFwka3VQZvtxOUBseW3eeyHPQQJ-2EJ8b1UoeJN54lNT62DFjT6ImY9O0RDMyapKzNZ0KfBKSnTqDIr3cmBB1A5-BRuk0QoliF-rNk5nk1YoECMvdtf21AbfJ11DdqWX3hC_gg91Rd",
      href: "/collection?category=essentials",
    },
    {
      title: "Accessories",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBP1Czxk8SBKNJnynu5FMitMWwj7ftDzxlNMvQH4zFa1dBS7ilq-SFtRP0upepE6tTAk7LCL0vxPh7xxau8EbSaSAXx4sRe1GSL5a2POJzZHbml3-HlDlmI3ZVA8E7q4c6LvZTXkuV4snTWHscaMxJX8szK4itrrUIpsGjY1NkgpW5RB0TaEKWY_cohQZ-zrxUt2avgmbQIjTBNJGcj5Sltpg8dJ7pP8Ygmr2MDnBMEvZUL74WvAaE6to7FKJT7p7c4XdUb5b2umVMS",
      href: "/collection?category=accessories",
    },
  ];

  // Dynamic feedback rendering
  const approvedFeedback = feedbackItems.filter((f) => f.approved);
  const featuredFeedback = approvedFeedback[0] || {
    text: "Aesthete represents more than apparel. It’s a deliberate study of form, function, and the silence of exceptional design.",
    author: "Elena Vorski",
    location: "Architectural Critic",
  };
  const secondaryFeedback = approvedFeedback.slice(1);

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
          {categories.map((cat, idx) => (
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
        <div className="px-5 md:px-16 max-w-screen-xl mx-auto mb-10 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-label-caps text-secondary uppercase tracking-widest">Instagram</span>
            <h3 className="text-lg md:text-xl font-medium lowercase text-primary">@aesthete.studio</h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scrollSlider("left")}
              className="p-3 bg-background hover:bg-primary hover:text-on-primary transition-colors border border-outline-variant"
              aria-label="Previous posts"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scrollSlider("right")}
              className="p-3 bg-background hover:bg-primary hover:text-on-primary transition-colors border border-outline-variant"
              aria-label="Next posts"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div
          ref={sliderRef}
          onMouseEnter={() => { isHoveredRef.current = true; }}
          onMouseLeave={() => { isHoveredRef.current = false; }}
          style={{ scrollBehavior: "auto" }}
          className="flex gap-6 overflow-x-auto no-scrollbar px-5 md:px-16 cursor-grab active:cursor-grabbing max-w-screen-xl mx-auto"
        >
          {gallerySlides.map((slide, index) => (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "200px" }}
              transition={{ duration: 0.6, delay: index * 0.05, ease: "easeOut" }}
              className="flex-none w-72 md:w-96 aspect-square bg-background relative overflow-hidden group border border-outline-variant/30"
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                unoptimized
                className="object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-700"
                sizes="(max-width: 768px) 288px, 384px"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Feedback / Testimonials ─────────────────────────────── */}
      <section className="py-24 px-5 md:px-16 max-w-screen-xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
          <div className="space-y-6">
            <span className="text-label-caps text-secondary uppercase tracking-widest">Our Community</span>
            <blockquote className="text-3xl md:text-4xl font-light italic leading-tight text-primary">
              &ldquo;{featuredFeedback.text}&rdquo;
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-12 h-[1px] bg-primary"></div>
              <span className="text-sm font-semibold tracking-wide text-primary">
                {featuredFeedback.author}, {featuredFeedback.location}
              </span>
            </div>
          </div>

          <div className="space-y-8 border-l border-outline-variant pl-0 md:pl-12">
            {secondaryFeedback.length > 0 ? (
              secondaryFeedback.map((f) => (
                <div key={f.id} className="pb-6 border-b border-outline-variant/50">
                  <p className="text-base text-on-surface-variant mb-2">
                    &ldquo;{f.text}&rdquo;
                  </p>
                  <p className="text-label-caps text-secondary">
                    Verified Purchase — {f.location}
                  </p>
                </div>
              ))
            ) : (
              <>
                <div className="pb-6 border-b border-outline-variant/50">
                  <p className="text-base text-on-surface-variant mb-2">
                    &ldquo;The silhouette of the trench coat is unmatched. Pure architectural bliss.&rdquo;
                  </p>
                  <p className="text-label-caps text-secondary">Verified Purchase — London</p>
                </div>
                <div className="pb-6 border-b border-outline-variant/50">
                  <p className="text-base text-on-surface-variant mb-2">
                    &ldquo;Obsessed with the monochromatic palette. It makes getting ready every morning an exercise in effortless luxury.&rdquo;
                  </p>
                  <p className="text-label-caps text-secondary">Verified Purchase — Tokyo</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

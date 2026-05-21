"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, animate } from "framer-motion";
import { useRef, useEffect } from "react";

export default function Home() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const scrollAnimationRef = useRef<any>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveredRef = useRef(false);

  const animateScroll = (target: number, duration = 2500) => {
    if (sliderRef.current) {
      const container = sliderRef.current;
      
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
      }

      const start = container.scrollLeft;
      const change = target - start;
      let startTime: number | null = null;

      const easeInOutCubic = (t: number) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeInOutCubic(progress);

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
      const gap = 24; // gap-6 is 24px
      const scrollAmount = cardWidth + gap;
      
      const start = container.scrollLeft;
      const end = direction === "left" ? start - scrollAmount : start + scrollAmount;
      
      const maxScroll = container.scrollWidth - container.clientWidth;
      const target = Math.max(0, Math.min(end, maxScroll));
      
      animateScroll(target, 2500); // Slow transition (2.5s)
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
        let duration = 2500; // Slow transition (2.5s)

        if (container.scrollLeft >= maxScroll - 10) {
          target = 0;
          duration = 3500; // Extra slow returning transition
        }

        animateScroll(target, duration);
      }
    }, 6000); // Slide every 6 seconds
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

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, []);

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

  const instagramPosts = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAfdtI5a5YkOqPU2FO-xAA5JgA3UBM9h7Jt8chGmUhDCEXl49_HKDCwGjcGdGMt-1glmbgnXmE68iUjKit-nmh4LlpjWW6fSLcN7Tw4pje_ek12giXHtONGW9QfBtbbFjtmgKfSLqHIt0qTPQheQ0KWzpS8X6R5hxxcjttu105kgm0d262Obvwaec0TMK-LEUQcs1OPhX3ZPUkSgLlt-xpcVmp3T8qIIpRlfeG3Z8-gKqvpM8cQCgW5YT_qWhvQ8sYCMFgwDjqvk-pS",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC43_-tNSM-iUaKdXVN2nHj8ROOOQ7yv_I8xePDRHsStdz0SN53HikOMB2WUU-QVLOVSRDTKN7yYTOUXnAAARemaVyBxgfJ5qm1I3HJDuHUkVLWA-BW2ck055-ry2s5POS1ovdXvlEU5CCZx9qFaz5jQS9eO5SQkpidMZ8dRWBEE9lz8xVge5-Wjda9c1JTTQbjvhS6gEVJlywzJB_-1XdKXyLFTr3E4Aw56mpgnvghFEapwC3sozoISotVux9385c8EFBRIVwlYHuS",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDqUGTmPsZppO7pXHheuqcGX-lzF_0iVKIEhWoJJh4mfLd_M1bsIoCgiW0Q_Eao3at5eAgvEXjWcYubnbXTZl8XdF42LsYyG7NGXC9sbEjCSgNYNr-jlqun1kcImrEL1tIjSe9uZPnpAuT6cmyg7yVjb8-U-G_5krHRBs9gT7w8BugWD6k0MaH_QSNeCsUIfWOTnUMbAdQz7nfITw2kzF0vkXROyNA5AThKVWqdOhKS8fxtmNegbEjPY-CE-_qq_HUt7n7CidwZk_zs",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDHtO2GNB3P90uvg8mE1u6Yikqhd2mDAcfcJJz7Shgj9n0YJ3EQstaGiwKDWVg1KbVHVkWxfAQRS6z5kicEQ4UhudNCHIoL0g7JrAXVjoAP33ksrEVZ4qxlBeyv7WKeAbfFoBxZ04OvhGk7tVY2SvawvtH9OWDeWwgtq8tIx3WEz6THbjY_Z97eJ0NCRwfEinsznyomaMd3xkgExFV0Na77hKEbanX1KdMmSV3Mtrv8qXRKcfhqikgno5XKHP8Q1FIP2_PH8v7GZoD-",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA88lduMSp6lRFR2RNqhrq6s7avvsDYDxkYxeuLiHQwx0ggl0p13M9awx7xextB-6JYx58YnlwFoZmLZKBDROgjBPo4O8BXi2U6IDEev0CflZXYGRvshsgIofi25hziWadEvV__VSKr75FB69jBMVSRRzKZErNi-PqcoeEdYxUEEnnbYdrGouQ1M_VTIWK403DyjKAZi_3RDqt_Cnb9fY6xlyCIbBe9JcJNhLxMbP-USVLRPKwxDZsrItGvPy3pJ8c8sDPvT960YCaP",
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* ─── Hero Section ─────────────────────────────────────────── */}
      <section className="relative h-[calc(100vh-4rem)] md:h-[90vh] min-h-[600px] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-neutral-900">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBga5lcdNTZo5qWObfMmw_RL3ZwUJtQp_vG9UficR9a_WYSqzsoM3FkgcXjOx82IytbLGbcK72QerzF5Ince2lrPNcUUzGEMXs9SSriYR26pfPLsI9dzJjz3DOrvGmj28_gJ23g7xOcCrMqTbfU8SlatF2I1fmA134UU9on7OKs_SdNhYINdOOO3g5JMlqk5Pxpik_5FRN77rU_4Hr_KhJnyX3F96SSsLQtEwSh5zGTrTqAY7N9w3TwaBn0ZsZ-nNmGmd2Adj_J5THD"
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
            Architectural <br />
            <span className="italic font-serif">Forms</span>
          </h1>
          <p className="text-lg md:text-xl text-on-primary/80 max-w-xl mx-auto mb-10 font-light leading-relaxed">
            A dialogue between human structure and sartorial precision. Collection 04 is now available.
          </p>
          <div>
            <Link
              href="/collection"
              className="inline-block bg-on-primary text-primary px-10 py-4 text-label-caps tracking-widest font-semibold hover:bg-white/95 transition-colors border border-on-primary"
            >
              Shop Collection
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
          {instagramPosts.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.4, delay: index * 0.15, ease: [0.25, 1, 0.5, 1] }}
              className="flex-none w-72 md:w-96 aspect-square bg-background relative overflow-hidden group border border-outline-variant/30"
            >
              <Image
                src={src}
                alt={`Instagram post ${index + 1}`}
                fill
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
              &ldquo;Aesthete represents more than apparel. It’s a deliberate study of form, function, and the silence of exceptional design.&rdquo;
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-12 h-[1px] bg-primary"></div>
              <span className="text-sm font-semibold tracking-wide text-primary">Elena Vorski, Architectural Critic</span>
            </div>
          </div>

          <div className="space-y-8 border-l border-outline-variant pl-0 md:pl-12">
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
          </div>
        </div>
      </section>
    </div>
  );
}

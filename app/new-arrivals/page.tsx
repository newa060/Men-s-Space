"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const NEW_ARRIVALS = [
  {
    id: "kinetics-shell",
    name: "Kinetics Shell",
    price: 450,
    series: "Series 02 / Tech",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjlDZs_2O1NSuBgZHH5C_cQ8qd_5g_g528jbVybnpwq8Z7b9bo0hoWoxC10n_fDn29SrzpuKEo951YqsQ65aNU1fjuwVwSWJLUTDuzkQHBs630cGJAhK4oyCwElemH7g8iuYlYr9wrokGjwNgPQYnzmWafxEV0_0qRsOuRxWFXfx-9suHvEJfXoVMtH1tUhjBhkptdxl72iTacAux2HHt0h7Fvd3Gc4AN7wMPXG8FwuootqK0Use4gI8d5sLKwskV8Xveetgg8mALW",
    slug: "kinetics-shell",
  },
  {
    id: "modular-tote",
    name: "Modular Tote",
    price: 280,
    series: "Series 02 / Acc",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqb49rc1xOonG_T8wEIQznPcyiq2GDIJDHB8K2MyNQKsuzmZUhUu2YJ2CBbdjKy-wk-PZTTIFoB2iIl7Sqj3dQT-DwG-HaBCHyvk16J_DW0Ehabd2dsgkEd_Epf473bIkAAkfquGcdiixzHETJu0sESqpJjSNYOPU8Y6IwtXdHQyO8YVds2Ny5ocV9vtcT8sIJ15M39vPcPrRzhXPoo6oe2oYpP1KoJO4lyVEj1F6rSJ-6kVWe2HzYZEt0kroPI50JvkPNHL3hIPSZ",
    slug: "modular-tote",
  },
  {
    id: "tectonic-vest",
    name: "Tectonic Vest",
    price: 320,
    series: "Series 02 / Layer",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-Dki32HOcAtGS59CpGySwRHehmArKtJx8GfNseF_Q-IG3mvgcwdC1KCr0zgVXCJPbAkpqSmx1e51-BuGc6LeknvBVid9oRRbVXBWTDODmup6Nyt_E4mQL29WFzw3Y6IiiylZQ46RvyLe4Uzh8YYTfA6u6SvSgrslt8aP9B3tkPyFHtzKc363nXlQArpHAy4z3F14RCfPL_SS-HduWAPYZZC28g4E0J4sHGBmnIhq39Lo9cM-OCZ03GgEMN1wJg-sDKwVRNLnGlRda",
    slug: "tectonic-vest",
  },
];

const ARCHIVE_SLIDES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDKY5VkcHZAdan2pUTOU_GC3FbEBM3vMRcOXjhprRMHnGiJmQKkBCkuT7KuAdKstLUaARMHt0O2wkLVwBRdn-tnbqlcH92jgL3bcFf2HGtG4kRWDgm20QkfYbDMMfJOko7Jv6bdvgd9oh4-pyVAvRUTnBhk0b4FGd77AQ_u_1IwcFtAIFU-AQWQ4EV0o48WJ-UPdKqgkIq84Ue1m2NbNEp8WpJHCKFkSP91-JsQvE3xFjxTSUK8AfHSB-YMGxq69wR4mNNc1qX-6sn-",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC75mDsWHE3V5HvHksqRd8_CaJx5WYNOONsRCCNJMdwpKXwqAaMe_PMH6l0a1czzB9TXURIN54Ds0dfYF60LiieT52Dw2Vy8-ydRfXb-xCcYVZ0exn3bdLU1XFDk7g-UrUj-d4mKi1AKGOVndQ2flQ8-aWZCQSuEbxhpm8FXdg1qlzENRUx32EPaXa-NYb0-iMBdNGl3xMebvEoenYeia1m1BeTiAI5rR00UPlGDzEHhnMWqp25iBHNSOPW0fHrJn3PxR0BntWIyizG",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD_zgefi49hxiCPA-qZjUBWWgDOkSsY1S1JRPLfO_7xcixpnbP0xnX-XWMtTHbvE-5FDtVsBNuxno1tj-qSbaT6imW0dKWC9DXJ-HmzTqQaBBFcyNeQ5cnMbWIl_w-JA3zL8fCB9XXBq6E2f-BSh7hD0hqniLZUVn75p79KZaVfXm_UGtPbSe98o117eeqUMlIS-xTYcKBj9Mp19a0zZ2xTAgzjzBCLsFDLva7g6Qdsu-YQM5XMC6h-FzWBKZ4SDoyjhC5g-uhB2uOL",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAzNzUR7jhIyhaNWy9bwUK3pD5Gagjvnsk7Bmy1ibEzNNtVJ9ASs-HMYkDhqsdViTcI5IW4A5m0WZvZeIiK_VsCfO6xPejtMS7i5-tfM5pncQqsQHzQ5pdAWqLcqnNBraE_Ii_-mDkf_80ngLppJpkF8ew9YyJ7xGLVbaZ3JKjPAP2nmnqIGmgX2q-1Qtc2xq47Q9zLL4IrTT-tA2bzSzVVZSJXub8LPZTeAWIlf1V9yFedWZ03dClMPr0NYLpWZlvPdziFt9fW7WvP",
];

export default function NewArrivals() {
  const archiveRef = useRef<HTMLDivElement>(null);

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
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2040&auto=format&fit=crop"
            alt="New Arrivals Series 02 Hero"
            fill
            priority
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
            COLLECTION 2026
          </p>
          <h1 className="text-4xl md:text-7xl font-light text-on-primary tracking-tighter uppercase mb-8">
            New Arrivals / Series 02
          </h1>
          <button className="bg-on-primary text-primary px-8 py-4 text-label-caps tracking-widest font-semibold hover:bg-white/90 transition-colors">
            Explore the Series
          </button>
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
              <li className="hover:text-primary cursor-pointer transition-colors font-medium text-primary underline underline-offset-4">
                All Series
              </li>
              <li className="hover:text-primary cursor-pointer transition-colors">
                Outerwear (12)
              </li>
              <li className="hover:text-primary cursor-pointer transition-colors">
                Accessories (08)
              </li>
              <li className="hover:text-primary cursor-pointer transition-colors">
                Tectonic Layering (05)
              </li>
            </ul>
          </aside>

          {/* Grid */}
          <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
            {NEW_ARRIVALS.map((product, idx) => (
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
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-[1.04] transition-all duration-700"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium tracking-wide uppercase text-primary mb-1">
                        {product.name}
                      </h4>
                      <p className="text-xs text-secondary tracking-wider uppercase">
                        {product.series}
                      </p>
                    </div>
                    <span className="text-label-caps text-primary">${product.price.toFixed(2)}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
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
          {ARCHIVE_SLIDES.map((src, index) => (
            <div
              key={index}
              className="flex-none w-[340px] md:w-[400px] aspect-square bg-background relative overflow-hidden group border border-outline-variant/30"
            >
              <Image
                src={src}
                alt={`Archive Slide ${index + 1}`}
                fill
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

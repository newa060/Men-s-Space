"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Shield, Truck, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const PRODUCT_DATABASE: Record<
  string,
  {
    id: string;
    name: string;
    price: number;
    category: string;
    description: string;
    materials: string;
    waterproof: string;
    breathability: string;
    hardware: string;
    seams: string;
    images: string[];
    colors: { name: string; hex: string }[];
  }
> = {
  "monolith-parka": {
    id: "monolith-parka",
    name: "Monolith Parka",
    price: 1250,
    category: "Outerwear / Series 01",
    description: "The Monolith Parka is a study in brutalist silhouette and environmental resilience. Constructed with laser-cut precision, its structural panels create a sharp, protective volume that maintains its geometric integrity regardless of movement.",
    materials: "3L Graphene Shell",
    waterproof: "20,000mm",
    breathability: "15,000g/m²",
    hardware: "Matte Cobalt YKK",
    seams: "Ultrasonic Welded",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB_Ct1FuIuegBipTc_zn4OdzDzFfm3pU_wd41IEOmbpdJSF-QO_0GDIEF1gJq4d0j8hZseSVpVd5ACa_0eRHDaoYdVHJu7N6mXRz8QIri6hl01rqi7VJPf25KTcmIrlcTdP3jHYRqKnhX1AY_XIRUFNkFPCi_fNxJe-KWF9MgqkLpp0Y0079rsGJgXFerVzCkfDAWAv7CUxwXQv1Z_RcFcwlDWce4jRalgFOou3yjfrXosXfCx2ySplccUTomuVni7URqgkaFrytdXs",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDsRayMEAab_Rvn-ZKJoYxJ4KuZfFdaKvCP0BRRWI3YSGJp5QpzF6BwaQbojgaINUicOizRH8HwsuQ5xdYMxF1n7Kk4WccnG4u7QoI7azo1lPdEV6FOhi6n3qbOCF9n6N26EFSRbl4C_6oazhBr6gxnNRvKod6JULuI4yHLtqMmncDhJ5yb957vZix3owp5wDEx1xW6Y3rmdh7Qq9YTgcIJlAUicfJBSUuD_Ng5l9vSMzHkDAU77I_CuU_XBUGn6txSNeherfVfMdIG",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCkL8zb_7llZX0kn_yyCNctXTsACdI1urlFOj_paqU4W7vzTHyFiIe8Lf4E3eEFJp1ZzgX2jE-sBY_yjx1alf9324oxXZK7HTnWVNB2tNBd1wgqOzKrl14jVqdtebhvjiUeeZHNRnFdhi-xC9hlvMnQrLR6BEnQ3VymANAbYBeX2Uu8bXF_qq3e0twttRcTGy-m2pKxXis3Y4bsvmYfgkWSUxWo6O9DlcDpWJ1Jyf93qkNt2WCX49pLLxJS34YKgCHi2-RXu9X247MN",
    ],
    colors: [
      { name: "Charcoal", hex: "#1b1b1b" },
      { name: "Slate", hex: "#4c4c4c" },
    ],
  },
  "structural-wool-coat": {
    id: "structural-wool-coat",
    name: "Structural Wool Coat",
    price: 1090,
    category: "Outerwear / Series 02",
    description: "Featuring a custom structured wool weave, this coat defines class and performance. Its sharp collar line and architectural cut are designed to hang perfectly in any pose.",
    materials: "100% Virgin Melton Wool",
    waterproof: "Water-resistant",
    breathability: "Natural Breathability",
    hardware: "Horn Buttons",
    seams: "Felled Tailoring Seams",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBNTiPV-94sOcCV_ZNissk31ncdN23HhehqmCWT8-FQ9ITtuZ3kdB0pD9N0PXXGVaEX_EIzmeyjUC5exi5h2aw3rE-HfiHFKIzp71GbIWjsnAVXBixywaMgWLfxZiQim5ROHDjmCy-Qs5DOHUrz8AmFXqE-x4kqrP6Nr62IWNxEx8tf1luJjCKnvwft0BTid4PD2r7PGqjkHcbpbq03O7lMrnTthhPpi0VVHRpY6EF1yd_jZ-pZg5fnu6SKMgNKHUt47F6n_D0x3fqZ",
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Ash", hex: "#8e8e8e" },
    ],
  },
  "architectural-overcoat": {
    id: "architectural-overcoat",
    name: "ARCHITECTURAL OVERCOAT",
    price: 1290,
    category: "Outerwear / Series 01",
    description: "An oversized double-breasted overcoat engineered from a dense wool composite. Architectural structuring defines the shoulders and back panel for a silent, powerful luxury drape.",
    materials: "Brutalist Felted Wool Blend",
    waterproof: "Semi-waterproof treatment",
    breathability: "Highly Breathable",
    hardware: "Custom Gunmetal Snaps",
    seams: "Taped interior seams",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCCcfKCQRNHLPYl7dMXPZtKcusxelsZrj-mrWmjZR1DmAe-g0aoYTRenVDu8DKtzqftVhoVWriovwbzBDXFCTsvM0f8HLvtB3O03lN5F1mpSSAfxLUtwnCzAoIiO3KLeXCr3zpH7NFNJG0NSvFlTAZgUXNes1dacFH-tfEGs_JDESeqpcztZN5XuirpsynZ6K_vqk0hYd0mpnHzqSYbD-L2wsis3Uu8-ruFC6QWt9CXuuGnBaHAeux4V1YwUtNXn5Zqo5KKMkpm_e8k",
    ],
    colors: [
      { name: "Charcoal", hex: "#2b2d2f" },
      { name: "Black", hex: "#000000" },
    ],
  },
  "structural-poplin-shirt": {
    id: "structural-poplin-shirt",
    name: "STRUCTURAL POPLIN SHIRT",
    price: 390,
    category: "Shirts / Essentials",
    description: "A high-density cotton poplin shirt with architectural details, featuring a stiff hidden-button placket and crisp geometrical angles.",
    materials: "100% Egyptian Giza Cotton",
    waterproof: "None",
    breathability: "Maximum",
    hardware: "Mother of Pearl Buttons",
    seams: "High-density single needle stitching",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBGSmMOfcvIAwNxaNcO-y6uyVRZLptLlQl5PXdN7KEYnLCfgclkZ6O-Yp4zvkWx0lbdneArQFFqbAEkm3Pn4dE8pJUAgLNF-HXjP1WlMApyvv9dEKIf7CfMfLEYevTdnnHYxCk3paEx9b3el07bSJaTzAuvwHUV_Ohg3eEqPqxK0yFsTH3wBeudmIsHhRqsgeJLZTkHJDgVOfVcNk1myT3IH3TSb-jgAKmdURbiypoUwPoMgvK2shkHJkEK2Pi8-wDE6cDi-Jcnz6dz",
    ],
    colors: [
      { name: "White", hex: "#ffffff" },
      { name: "Black", hex: "#0a0a0a" },
    ],
  },
  "kinetics-shell": {
    id: "kinetics-shell",
    name: "Kinetics Shell",
    price: 450,
    category: "Outerwear / Tech",
    description: "A technical lightweight windbreaker built with performance layers and laser ventilation ports, mapping to the form of kinetic movement.",
    materials: "Tech Nylon Composite",
    waterproof: "15,000mm",
    breathability: "20,000g/m²",
    hardware: "Waterproof YKK Aquaguard",
    seams: "Fully taped seams",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCjlDZs_2O1NSuBgZHH5C_cQ8qd_5g_g528jbVybnpwq8Z7b9bo0hoWoxC10n_fDn29SrzpuKEo951YqsQ65aNU1fjuwVwSWJLUTDuzkQHBs630cGJAhK4oyCwElemH7g8iuYlYr9wrokGjwNgPQYnzmWafxEV0_0qRsOuRxWFXfx-9suHvEJfXoVMtH1tUhjBhkptdxl72iTacAux2HHt0h7Fvd3Gc4AN7wMPXG8FwuootqK0Use4gI8d5sLKwskV8Xveetgg8mALW",
    ],
    colors: [
      { name: "Black", hex: "#111111" },
      { name: "Slate", hex: "#444648" },
    ],
  },
};

export default function ProductPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const { addItem, openCart } = useCart();

  const product = PRODUCT_DATABASE[slug] || PRODUCT_DATABASE["monolith-parka"];

  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || "Black");

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      image: product.images[0],
      slug: product.id,
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
                <span className="text-primary font-medium">{product.materials}</span>
              </li>
              <li className="flex justify-between">
                <span>Waterproof</span>
                <span className="text-primary font-medium">{product.waterproof}</span>
              </li>
              <li className="flex justify-between">
                <span>Breathability</span>
                <span className="text-primary font-medium">{product.breathability}</span>
              </li>
              <li className="flex justify-between">
                <span>Hardware</span>
                <span className="text-primary font-medium">{product.hardware}</span>
              </li>
              <li className="flex justify-between">
                <span>Seams</span>
                <span className="text-primary font-medium">{product.seams}</span>
              </li>
            </ul>
          </div>
        </section>

        {/* ─── Column 2: Gallery (Scroll Center) ─────────────────── */}
        <section className="md:col-span-6 space-y-8 order-1 md:order-2">
          {product.images.map((src, index) => (
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
              {product.colors.map((col) => (
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

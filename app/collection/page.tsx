"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const PRODUCTS = [
  {
    id: "structural-wool-coat",
    name: "Structural Wool Coat",
    price: 1250,
    category: "outerwear",
    color: "Charcoal Black",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuApcOfKWU7BfH3JP4UnANqEkd7L_FTB9CF2VB-zYpGWZK7plt79e0VIDigGCckjfleClBrsFrPZ827b7_uOuWuJPtfWPAsm-WSioaz6kmcshh3t0h6PmVKrTIhTMPKQfR5rFCUMFneUGWJh1JbpHsQ41IeY8aDWKEPE52XlnmVDG83dmkL-0rkSBnHdcUzyOulo7c23VzrSqgJTKIotSoO2m79J8pStdeH5n2jMshG4mdfXpfiaG672VIKKSu4xnXc0sqCLidMrT6UO",
    slug: "structural-wool-coat",
  },
  {
    id: "monolith-parka",
    name: "Monolith Parka",
    price: 1800,
    category: "outerwear",
    color: "Slate Gray",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC8kinebXhyIy_wmYM2m9czkFBZngnP3f9wAfS7oiKWrZ6p7KMBOQ-A6BNK2zirG8BF8MWQQOo4FHMMHx2wJAYftT8P7gC8_kK8n1YIHBHj1qU_jfBYA7pA_0RK0iJ1HOTiGGEaTtJ7zqVPOQFbP30gRZRpHPDV4tDt6wBi3hV07ZQT7eQ36itke-6sTE4JMwHGaj4hZQYK1yXJZVdppCC5YrIcbLeiCK9yInhmJyyBstIU3tjAotsB94HkOIs5BWW2jj-dwKLOhNzJ",
    slug: "monolith-parka",
  },
  {
    id: "architectural-blazer",
    name: "Architectural Blazer",
    price: 950,
    category: "outerwear",
    color: "Pure White",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCg8ZtOU_uiqG2KZwNs6txbcik_jozZZ-B16Kh8qXgdDLRUcp5-VBhIrJ9DWGQ_ma7w3qFycT8vp-_HpHLaLskpQw4bUfGzAh6YP0vTMFE1xyl17Xdp2gIyOMy0z3RX22KFKnUiQ1MEUtb-45vR0FUFV0OJ0yMe9KeXHlb5rzY1vrHr4I36tfbG5sSp1Zok1Pk0gpinLIsLtSMJrp4BgMYGhnpCpIqmG7ZXeqfDACbzPmmp7JtfP-Gcfz04WL4aUZX8Mjmbr5fjFGLQ",
    slug: "architectural-blazer",
  },
  {
    id: "void-biker-jacket",
    name: "Void Biker Jacket",
    price: 2100,
    category: "outerwear",
    color: "Matte Onyx",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDczKpOmR2DnBjmU33JPt2zX9CzXzMeaHymVMFYqHCuVBBmzuM1IX_PzCLIVG1oeADnjhgJpAJxK9sebeUvg2aOrRVjhS2ve0p25P_7Cpk2awhObH3KP7dwvEEhZNiY3Zs_WJtiNAhEtUvPsoQV_Udk2YBRJEzyC9CaHqTp45WeGc04z9Oa58OVzbTz0NRc3d8Rqq1OtveLUOKseNtpzwWBbH7DD5Q_DQSORMe6gGf4MeIjLitQSrfNAYlYiGIfjwblRA-DQOcNnP6B",
    slug: "void-biker-jacket",
  },
  {
    id: "translucent-shell",
    name: "Translucent Shell",
    price: 780,
    category: "outerwear",
    color: "Frost",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCePAGW5LfgIWxsQhog7lJXCYoR3ltubazkI1JIyDKEOqfDBH3BC-tizBiz0yq845DKDGVOLu3Oc76rZ8TwXxrI1s8kXVI2530ssZxAkvnSere06c6VJnELpVwwMvb0zpEJbWRWgVmzTf24abqg7CzyX9mpKftf4sVC1pYfN_lrjT0xZFPGHhL1RKscoWXuu0WfYi_RteT8er8e2G3KW8hSibS2IBPYGd4noghfhE5fkUw8GNaOB-dHdV__g-E0X_FY-Qoyc8KnycTU",
    slug: "translucent-shell",
  },
  {
    id: "volume-overcoat",
    name: "Volume Overcoat",
    price: 1450,
    category: "outerwear",
    color: "Deep Ash",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDiNVIRX7blr872PFvnvfOVUEuQlE5uHKbo6AJza7qIBfWZMMdoE4qrBuxsri4WjzujH-3zjhlvMW2_OsS_Q_zVQgDjx6JZDFzP0Ciu-yP82kE7Q5JSrAfW2s7FtmxoA3nbG6ZRSSyIYF-SQ2NqbLVBhqJS4xyzJKK_0wUQIH56tymIgwbUoW5TCIyg8d0M19LaBrQosDY1wEuATb7eYW-VSUwEmWsclWyUPx3EGKMlSTw3LIidxbR68TdsQK7jIfNUEOA6nwfKlo5b",
    slug: "volume-overcoat",
  },
];

const CATEGORIES = ["Outerwear", "Essentials", "Accessories", "Footwear", "Archive"];

function CollectionContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "outerwear";

  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("default");
  const [sizeOpen, setSizeOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  // Sorting logic
  const sortedProducts = [...PRODUCTS].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return 0;
  });

  // Category filter logic
  const filteredProducts =
    category === "all"
      ? sortedProducts
      : sortedProducts.filter((p) => p.category === category.toLowerCase());

  const toggleSize = (sz: string) => {
    setSelectedSizes((prev) =>
      prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz]
    );
  };

  return (
    <div className="py-12 px-5 md:px-16 max-w-screen-xl mx-auto w-full">
      <div className="flex flex-col md:flex-row gap-8">
        {/* ─── Left Sidebar ──────────────────────────────────────── */}
        <aside className="w-full md:w-1/5 shrink-0">
          <div className="md:sticky md:top-28 space-y-8">
            {/* Categories */}
            <section>
              <h3 className="text-[10px] font-semibold uppercase tracking-widest text-secondary mb-4">
                Categories
              </h3>
              <ul className="space-y-2">
                {CATEGORIES.map((cat) => {
                  const isActive = category === cat.toLowerCase();
                  return (
                    <li key={cat}>
                      <button
                        onClick={() => setCategory(cat.toLowerCase())}
                        className={`text-sm transition-colors ${
                          isActive
                            ? "text-primary font-bold"
                            : "text-secondary hover:text-primary"
                        }`}
                      >
                        {cat}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* Filters */}
            <section className="pt-8 border-t border-outline-variant">
              <h3 className="text-[10px] font-semibold uppercase tracking-widest text-secondary mb-4">
                Filter
              </h3>
              <div className="space-y-3">
                {/* Size Accordion */}
                <div>
                  <button
                    onClick={() => setSizeOpen(!sizeOpen)}
                    className="flex justify-between items-center w-full text-sm py-2 text-primary"
                  >
                    <span>Size</span>
                    <ChevronDown
                      size={16}
                      className={`text-secondary transition-transform duration-200 ${
                        sizeOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {sizeOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="grid grid-cols-3 gap-2 mt-2"
                    >
                      {["XS", "S", "M", "L", "XL"].map((sz) => (
                        <button
                          key={sz}
                          onClick={() => toggleSize(sz)}
                          className={`border py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                            selectedSizes.includes(sz)
                              ? "bg-primary text-on-primary border-primary"
                              : "border-outline-variant text-secondary hover:bg-primary hover:text-on-primary hover:border-primary"
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Sort Accordion */}
                <div>
                  <button
                    onClick={() => setSortOpen(!sortOpen)}
                    className="flex justify-between items-center w-full text-sm py-2 text-primary"
                  >
                    <span>Sort</span>
                    <ChevronDown
                      size={16}
                      className={`text-secondary transition-transform duration-200 ${
                        sortOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {sortOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-2 space-y-1"
                    >
                      {[
                        { label: "Newest", value: "default" },
                        { label: "Price: Low to High", value: "price-asc" },
                        { label: "Price: High to Low", value: "price-desc" },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setSortBy(opt.value)}
                          className={`block w-full text-left py-1.5 text-sm transition-colors ${
                            sortBy === opt.value
                              ? "text-primary font-semibold"
                              : "text-secondary hover:text-primary"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </aside>

        {/* ─── Right Content Area ────────────────────────────────── */}
        <div className="w-full md:w-4/5">
          <header className="mb-8 flex justify-between items-end border-b border-outline-variant/40 pb-6">
            <h1 className="text-3xl md:text-4xl font-light uppercase tracking-tight text-primary capitalize">
              {category === "all" ? "All" : category}
            </h1>
            <span className="text-sm text-secondary">
              {filteredProducts.length} Item{filteredProducts.length !== 1 ? "s" : ""}
            </span>
          </header>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group cursor-pointer"
              >
                <Link href={`/product/${product.slug}`} className="block">
                  <div className="aspect-[4/5] bg-surface-container overflow-hidden mb-4">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={400}
                      height={500}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-primary">
                        {product.name}
                      </h3>
                      <p className="text-[10px] uppercase tracking-widest text-secondary mt-1">
                        {product.color}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-primary">
                      ${product.price.toLocaleString()}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-16 flex justify-center items-center gap-6">
            <button className="text-secondary hover:text-primary transition-colors text-sm">
              &larr;
            </button>
            <div className="flex gap-4">
              <span className="text-sm border-b border-primary px-1 text-primary font-medium">1</span>
              <span className="text-sm text-secondary hover:text-primary cursor-pointer px-1">2</span>
              <span className="text-sm text-secondary hover:text-primary cursor-pointer px-1">3</span>
            </div>
            <button className="text-secondary hover:text-primary transition-colors text-sm">
              &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Collection() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-secondary text-xs tracking-widest uppercase">
          Loading Collection...
        </div>
      }
    >
      <CollectionContent />
    </Suspense>
  );
}

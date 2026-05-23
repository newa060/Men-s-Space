"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { ProductCardImage } from "@/components/ui/ProductCardImage";
import { useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/context/AdminContext";

function CollectionContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("default");
  const [sizeOpen, setSizeOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          const data: Product[] = json.data;
          setProducts(data);
          // Derive unique categories from actual products
          const unique = Array.from(new Set(data.map((p) => p.category))).sort();
          setCategories(unique);
        }
      })
      .catch(console.error);
  }, []);

  // Archive shows archived products (public API returns Active only, so archive will be empty by default)
  const statusFiltered = products.filter((p) =>
    category === "archive" ? p.status === "Archived" : true
  );

  // Sorting
  const sortedProducts = [...statusFiltered].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return 0;
  });

  // Category filter
  const categoryFiltered =
    category === "all" || category === "archive"
      ? sortedProducts
      : sortedProducts.filter((p) => p.category.toLowerCase() === category.toLowerCase());

  // Size filter
  const filteredProducts =
    selectedSizes.length > 0
      ? categoryFiltered.filter(
          (p) => p.sizes && p.sizes.some((sz) => selectedSizes.includes(sz))
        )
      : categoryFiltered;

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
                <li>
                  <button
                    onClick={() => setCategory("all")}
                    className={`text-sm transition-colors ${
                      category === "all"
                        ? "text-primary font-bold"
                        : "text-secondary hover:text-primary"
                    }`}
                  >
                    All
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => setCategory(cat.toLowerCase())}
                      className={`text-sm transition-colors ${
                        category === cat.toLowerCase()
                          ? "text-primary font-bold"
                          : "text-secondary hover:text-primary"
                      }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
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
            {filteredProducts.length === 0 ? (
              <p className="col-span-3 text-secondary text-sm py-16 text-center">
                No products found in this category.
              </p>
            ) : (
              filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group cursor-pointer"
                >
                  <Link href={`/product/${product.slug}`} className="block">
                    <div className="aspect-[4/5] bg-surface-container overflow-hidden mb-4">
                      <ProductCardImage
                        image={product.image}
                        images={product.images}
                        alt={product.name}
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium text-primary">
                          {product.name}
                        </h3>
                        <p className="text-[10px] uppercase tracking-widest text-secondary mt-1">
                          {product.colors?.[0]?.name || "Default"}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-primary">
                        ${product.price.toLocaleString()}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
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

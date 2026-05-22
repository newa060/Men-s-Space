"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import TopNavBar from "@/components/layout/TopNavBar";
import { useAdmin } from "@/context/AdminContext";

const CATEGORIES = ["Architecture", "Furniture", "Textiles", "Editorial", "Collections"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "OS"];

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { products, updateProduct } = useAdmin();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [status, setStatus] = useState<"Active" | "Draft" | "Archived">("Draft");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [series, setSeries] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setName(product.name);
      setSlug(product.slug);
      setDescription(product.description || "");
      setPrice(product.price.toString());
      setStock(product.stock.toString());
      setCategory(product.category);
      setStatus(product.status);
      setSelectedSizes(product.sizes || []);
      setImageUrl(product.image);
      setIsNewArrival(!!product.isNewArrival);
      setSeries(product.series || "");
    } else {
      setNotFound(true);
    }
  }, [id, products]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    updateProduct(id, {
      name,
      slug,
      description,
      price: parseFloat(price) || 0,
      stock: parseInt(stock) || 0,
      category,
      status,
      sizes: selectedSizes,
      image: imageUrl,
      isNewArrival,
      series,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => router.push("/admin/collections"), 1000);
  };

  if (notFound) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <TopNavBar
          breadcrumbs={[
            { label: "Console", href: "/admin/dashboard" },
            { label: "Collections", href: "/admin/collections" },
            { label: "Edit Product" },
          ]}
        />
        <div className="flex-1 flex flex-col items-center justify-center text-on-surface-variant p-10">
          <span className="material-symbols-outlined text-[48px] text-error mb-4">warning</span>
          <h2 className="text-[20px] font-light text-on-surface italic font-serif">Product Not Found</h2>
          <p className="text-[13px] mt-2">The product you are trying to edit does not exist or has been deleted.</p>
          <button
            onClick={() => router.push("/admin/collections")}
            className="mt-6 px-6 py-2.5 bg-primary text-on-primary text-[11px] font-bold tracking-widest uppercase"
          >
            Back to Collections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopNavBar
        breadcrumbs={[
          { label: "Console", href: "/admin/dashboard" },
          { label: "Collections", href: "/admin/collections" },
          { label: `Edit ${name || "Product"}` },
        ]}
      />

      <div className="p-10 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <h2 className="text-[28px] font-light text-on-surface italic font-serif mb-2">Edit Product</h2>
          <p className="text-[13px] text-on-surface-variant mb-8">
            Modify the product details below. Changes will immediately update storefront inventory.
          </p>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column — Core Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Name + Slug */}
              <div className="bg-surface-container-low border border-outline-variant p-6 space-y-5">
                <h3 className="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant border-b border-outline-variant pb-3">
                  Product Identity
                </h3>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
                    Product Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Obsidian Pedestal"
                    className="w-full bg-surface-container border border-outline-variant px-4 py-3 text-[14px] text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
                    URL Slug
                  </label>
                  <div className="flex items-center border border-outline-variant bg-surface-container focus-within:border-primary transition-colors">
                    <span className="pl-4 pr-2 text-[13px] text-on-surface-variant select-none">/product/</span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="flex-1 bg-transparent py-3 pr-4 text-[14px] text-on-surface focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Describe the piece..."
                    className="w-full bg-surface-container border border-outline-variant px-4 py-3 text-[14px] text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Pricing + Stock */}
              <div className="bg-surface-container-low border border-outline-variant p-6 space-y-5">
                <h3 className="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant border-b border-outline-variant pb-3">
                  Pricing & Inventory
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
                      Price (USD) *
                    </label>
                    <div className="flex items-center border border-outline-variant bg-surface-container focus-within:border-primary transition-colors">
                      <span className="pl-4 pr-2 text-[13px] text-on-surface-variant">$</span>
                      <input
                        required
                        type="number"
                        min="0"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                        className="flex-1 bg-transparent py-3 pr-4 text-[14px] text-on-surface focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
                      Stock Quantity *
                    </label>
                    <input
                      required
                      type="number"
                      min="0"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="0"
                      className="w-full bg-surface-container border border-outline-variant px-4 py-3 text-[14px] text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Sizes */}
              <div className="bg-surface-container-low border border-outline-variant p-6 space-y-5">
                <h3 className="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant border-b border-outline-variant pb-3">
                  Size Variants
                </h3>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`w-12 h-12 text-[11px] font-bold tracking-widest border transition-all ${
                        selectedSizes.includes(size)
                          ? "bg-primary text-on-primary border-primary"
                          : "bg-transparent text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  {selectedSizes.length === 0
                    ? "No sizes selected"
                    : `Selected: ${selectedSizes.join(", ")}`}
                </p>
              </div>
            </div>

            {/* Right Column — Media + Status */}
            <div className="space-y-6">
              {/* Media Upload */}
              <div className="bg-surface-container-low border border-outline-variant p-6 space-y-4">
                <h3 className="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant border-b border-outline-variant pb-3">
                  Media
                </h3>
                <div className="aspect-[4/5] bg-surface-container border border-outline-variant border-dashed flex flex-col items-center justify-center gap-3 text-on-surface-variant cursor-pointer hover:border-primary hover:text-primary transition-all group overflow-hidden relative">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt="Preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[40px] opacity-40 group-hover:opacity-70 transition-opacity">
                        add_photo_alternate
                      </span>
                      <p className="text-[11px] font-semibold tracking-widest uppercase text-center">
                        Upload Image
                      </p>
                    </>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
                    Or paste image URL
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-surface-container border border-outline-variant px-4 py-2.5 text-[13px] text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Category + Status */}
              <div className="bg-surface-container-low border border-outline-variant p-6 space-y-5">
                <h3 className="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant border-b border-outline-variant pb-3">
                  Organisation
                </h3>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
                    Category *
                  </label>
                  <select
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant px-4 py-3 text-[14px] text-on-surface focus:outline-none focus:border-primary transition-colors cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-surface-container">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* New Arrivals Toggle */}
                <div className="space-y-3 pt-2 border-t border-outline-variant/30">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div
                      onClick={() => setIsNewArrival(!isNewArrival)}
                      className={`w-4 h-4 border flex items-center justify-center transition-all ${
                        isNewArrival
                          ? "bg-primary border-primary"
                          : "border-outline-variant group-hover:border-primary"
                      }`}
                    >
                      {isNewArrival && (
                        <span className="material-symbols-outlined text-on-primary text-[12px]">check</span>
                      )}
                    </div>
                    <span className="text-[12px] font-semibold tracking-widest uppercase text-on-surface">
                      Feature in New Arrivals
                    </span>
                  </label>
 
                  {isNewArrival && (
                    <div className="space-y-1.5 pl-7">
                      <label className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
                        Series / Label
                      </label>
                      <input
                        type="text"
                        value={series}
                        onChange={(e) => setSeries(e.target.value)}
                        placeholder="e.g. Series 02 / Tech"
                        className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-[13px] text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
                    Status *
                  </label>
                  <div className="flex flex-col gap-2">
                    {(["Active", "Draft", "Archived"] as const).map((s) => (
                      <label key={s} className="flex items-center gap-3 cursor-pointer group">
                        <div
                          onClick={() => setStatus(s)}
                          className={`w-4 h-4 border flex items-center justify-center transition-all ${
                            status === s
                              ? "bg-primary border-primary"
                              : "border-outline-variant group-hover:border-primary"
                          }`}
                        >
                          {status === s && (
                            <span className="material-symbols-outlined text-on-primary text-[12px]">check</span>
                          )}
                        </div>
                        <span className="text-[12px] font-semibold tracking-widest uppercase text-on-surface">
                          {s}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={saving || saved}
                className={`w-full py-4 text-[11px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all ${
                  saved
                    ? "bg-primary/30 text-on-primary/60 cursor-not-allowed"
                    : "bg-primary text-on-primary hover:opacity-90"
                }`}
              >
                {saved ? (
                  <>
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    Saved — Redirecting…
                  </>
                ) : saving ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                    Saving…
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">save</span>
                    Save Changes
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                className="w-full py-3 text-[11px] font-bold tracking-widest uppercase border border-outline-variant text-on-surface-variant hover:border-outline hover:text-on-surface transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

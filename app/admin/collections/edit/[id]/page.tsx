"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import TopNavBar from "@/components/layout/TopNavBar";
import {
  ProductColorsEditor,
  normalizeProductColors,
  type ProductColor,
} from "@/components/admin/ProductColorsEditor";
import { useAdmin } from "@/context/AdminContext";

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
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState("");

  // Load categories from DB
  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data.length > 0) {
          setCategories(json.data);
        }
      })
      .catch(console.error);
  }, []);
  const [status, setStatus] = useState<"Active" | "Draft" | "Archived">("Draft");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<ProductColor[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [series, setSeries] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [notFound, setNotFound] = useState(false);

  // New category state
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [newCategoryError, setNewCategoryError] = useState("");

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
      setAdditionalImages(
        (product.images || []).filter((img) => img && img !== product.image)
      );
      setIsNewArrival(!!product.isNewArrival);
      setSeries(product.series || "");
      setColors(product.colors || []);

      // If the product's category isn't already in the list, add it
      setCategories((prev) =>
        prev.includes(product.category) ? prev : [...prev, product.category].sort()
      );
    } else if (products.length > 0) {
      setNotFound(true);
    }
  }, [id, products]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleAddCategory = () => {
    const trimmed = newCategoryInput.trim();
    if (!trimmed) {
      setNewCategoryError("Category name cannot be empty.");
      return;
    }
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      setNewCategoryError("This category already exists.");
      return;
    }
    setCategories((prev) => [...prev, trimmed]);
    setCategory(trimmed);
    setNewCategoryInput("");
    setNewCategoryError("");
    setShowNewCategory(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError("");

    await updateProduct(id, {
      name,
      slug,
      description,
      price: parseFloat(price) || 0,
      stock: parseInt(stock) || 0,
      category,
      status,
      sizes: selectedSizes,
      image: imageUrl,
      images: [imageUrl, ...additionalImages.filter(Boolean)],
      isNewArrival,
      series,
      colors: normalizeProductColors(colors),
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
          <p className="text-[13px] mt-2">
            The product you are trying to edit does not exist or has been deleted.
          </p>
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
          <h2 className="text-[28px] font-light text-on-surface italic font-serif mb-2">
            Edit Product
          </h2>
          <p className="text-[13px] text-on-surface-variant mb-8">
            Modify the product details below. Changes will immediately update storefront inventory.
          </p>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── Left Column ── */}
            <div className="lg:col-span-2 space-y-6">
              {saveError && (
                <div className="bg-error/10 border border-error/30 text-error text-xs p-4 uppercase tracking-wider">
                  {saveError}
                </div>
              )}

              {/* Product Identity */}
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
                    <span className="pl-4 pr-2 text-[13px] text-on-surface-variant select-none">
                      /product/
                    </span>
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

              {/* Pricing & Inventory */}
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

              <ProductColorsEditor colors={colors} onChange={setColors} />

              {/* Size Variants */}
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

            {/* ── Right Column ── */}
            <div className="space-y-6">
              {/* Media */}
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

                {/* Additional Images */}
                <div className="space-y-2 pt-2 border-t border-outline-variant/30">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
                    Additional Images
                  </label>
                  <p className="text-[10px] text-on-surface-variant">
                    Add more image URLs for the product gallery.
                  </p>
                  <div className="space-y-2">
                    {additionalImages.map((url, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => {
                            const updated = [...additionalImages];
                            updated[i] = e.target.value;
                            setAdditionalImages(updated);
                          }}
                          placeholder="https://..."
                          className="flex-1 bg-surface-container border border-outline-variant px-3 py-2 text-[13px] text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setAdditionalImages((prev) => prev.filter((_, idx) => idx !== i))}
                          className="text-on-surface-variant hover:text-error transition-colors"
                          aria-label="Remove image"
                        >
                          <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setAdditionalImages((prev) => [...prev, ""])}
                      className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-primary hover:opacity-70 transition-opacity"
                    >
                      <span className="material-symbols-outlined text-[14px]">add</span>
                      Add Image URL
                    </button>
                  </div>
                </div>
              </div>

              {/* Organisation */}
              <div className="bg-surface-container-low border border-outline-variant p-6 space-y-5">
                <h3 className="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant border-b border-outline-variant pb-3">
                  Organisation
                </h3>

                {/* Category selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold tracking-widests uppercase text-on-surface-variant">
                      Category *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewCategory((v) => !v);
                        setNewCategoryInput("");
                        setNewCategoryError("");
                      }}
                      className="flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-primary hover:opacity-70 transition-opacity"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {showNewCategory ? "close" : "add"}
                      </span>
                      {showNewCategory ? "Cancel" : "New Category"}
                    </button>
                  </div>

                  {/* Dropdown */}
                  <select
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant px-4 py-3 text-[14px] text-on-surface focus:outline-none focus:border-primary transition-colors cursor-pointer"
                  >
                    {categories.length === 0 && (
                      <option value="" disabled>Loading categories...</option>
                    )}
                    {categories.map((c) => (
                      <option key={c} value={c} className="bg-surface-container">
                        {c}
                      </option>
                    ))}
                  </select>

                  {/* New category inline form */}
                  <AnimatePresence>
                    {showNewCategory && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2 space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newCategoryInput}
                              onChange={(e) => {
                                setNewCategoryInput(e.target.value);
                                setNewCategoryError("");
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddCategory();
                                }
                              }}
                              placeholder="e.g. Outerwear"
                              autoFocus
                              className="flex-1 bg-surface-container border border-primary/50 px-3 py-2.5 text-[13px] text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
                            />
                            <button
                              type="button"
                              onClick={handleAddCategory}
                              className="px-4 py-2.5 bg-primary text-on-primary text-[11px] font-bold tracking-widest uppercase hover:opacity-90 transition-opacity whitespace-nowrap"
                            >
                              Add
                            </button>
                          </div>
                          {newCategoryError && (
                            <p className="text-[11px] text-error">{newCategoryError}</p>
                          )}
                          <p className="text-[10px] text-on-surface-variant">
                            Press Enter or click Add. The new category will be selected automatically.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                        <span className="material-symbols-outlined text-on-primary text-[12px]">
                          check
                        </span>
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

                {/* Status */}
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
                            <span className="material-symbols-outlined text-on-primary text-[12px]">
                              check
                            </span>
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
                    <span className="material-symbols-outlined text-[16px] animate-spin">
                      progress_activity
                    </span>
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

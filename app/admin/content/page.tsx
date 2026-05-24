"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import TopNavBar from "@/components/layout/TopNavBar";
import { AdminImageField } from "@/components/admin/AdminImageField";
import { uploadImageFile } from "@/lib/upload/client";
import { useAdmin } from "@/context/AdminContext";
import type { GalleryItem } from "@/lib/gallery/format";

type TabType = "hero" | "gallery" | "feedback" | "arrivals";

export default function ContentPage() {
  const { cmsData, updateCmsData, feedbackItems, toggleFeedbackApproval } = useAdmin();
  const [activeTab, setActiveTab] = useState<TabType>("hero");

  // Hero form state local (or direct update)
  const [heroTitle, setHeroTitle] = useState(cmsData.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(cmsData.heroSubtitle);
  const [heroImage, setHeroImage] = useState(cmsData.heroImage);
  const [heroCtaText, setHeroCtaText] = useState(cmsData.heroCtaText);
  const [featuredCategory, setFeaturedCategory] = useState(cmsData.featuredCategory);
  const [promoImage, setPromoImage] = useState(cmsData.promoImage);
  const [promoHeading, setPromoHeading] = useState(cmsData.promoHeading);
  const [promoCtaText, setPromoCtaText] = useState(cmsData.promoCtaText);
  const [promoIntro, setPromoIntro] = useState(cmsData.promoIntro);
  const [featuredNewArrivals, setFeaturedNewArrivals] = useState<string[]>(cmsData.featuredNewArrivals || []);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Products state for New Arrivals selection
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<null | "publish" | "discard">(null);

  const hasUnsavedChanges =
    heroTitle !== cmsData.heroTitle ||
    heroSubtitle !== cmsData.heroSubtitle ||
    heroImage !== cmsData.heroImage ||
    heroCtaText !== cmsData.heroCtaText ||
    featuredCategory !== cmsData.featuredCategory ||
    promoImage !== cmsData.promoImage ||
    promoHeading !== cmsData.promoHeading ||
    promoCtaText !== cmsData.promoCtaText ||
    promoIntro !== cmsData.promoIntro ||
    JSON.stringify(featuredNewArrivals) !== JSON.stringify(cmsData.featuredNewArrivals || []);

  const handlePublishChanges = async () => {
    setConfirmModal(null);
    setSaving(true);
    setSaved(false);
    try {
      await updateCmsData({
        heroTitle,
        heroSubtitle,
        heroImage,
        heroCtaText,
        featuredCategory,
        promoImage,
        promoHeading,
        promoCtaText,
        promoIntro,
        featuredNewArrivals,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Publish failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setConfirmModal(null);
    setHeroTitle(cmsData.heroTitle);
    setHeroSubtitle(cmsData.heroSubtitle);
    setHeroImage(cmsData.heroImage);
    setHeroCtaText(cmsData.heroCtaText);
    setFeaturedCategory(cmsData.featuredCategory);
    setPromoImage(cmsData.promoImage);
    setPromoHeading(cmsData.promoHeading);
    setPromoCtaText(cmsData.promoCtaText);
    setPromoIntro(cmsData.promoIntro);
    setFeaturedNewArrivals(cmsData.featuredNewArrivals || []);
  };

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);

  const galleryReplaceRef = useRef<HTMLInputElement>(null);
  const [replacingGalleryId, setReplacingGalleryId] = useState<string | null>(null);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryError, setGalleryError] = useState("");

  const [showAddGallery, setShowAddGallery] = useState(false);
  const [newGalleryTitle, setNewGalleryTitle] = useState("");
  const [newGalleryImage, setNewGalleryImage] = useState("");

  const fetchGalleryItems = useCallback(async () => {
    setGalleryLoading(true);
    try {
      const res = await fetch("/api/admin/gallery");
      const json = await res.json();
      if (json.success) setGalleryItems(json.data);
      else setGalleryError(json.error || "Failed to load gallery");
    } catch {
      setGalleryError("Failed to load gallery");
    } finally {
      setGalleryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGalleryItems();
  }, [fetchGalleryItems]);

  useEffect(() => {
    setHeroTitle(cmsData.heroTitle);
    setHeroSubtitle(cmsData.heroSubtitle);
    setHeroImage(cmsData.heroImage);
    setHeroCtaText(cmsData.heroCtaText);
    setFeaturedCategory(cmsData.featuredCategory);
    setPromoImage(cmsData.promoImage);
    setPromoHeading(cmsData.promoHeading);
    setPromoCtaText(cmsData.promoCtaText);
    setPromoIntro(cmsData.promoIntro);
    setFeaturedNewArrivals(cmsData.featuredNewArrivals || []);
  }, [cmsData]);

  // Fetch all products for selection
  useEffect(() => {
    if (activeTab === "arrivals") {
      setProductsLoading(true);
      fetch("/api/admin/products?isNewArrival=true")
        .then((r) => r.json())
        .then((json) => {
          if (json.success) setAllProducts(json.data || []);
        })
        .catch(console.error)
        .finally(() => setProductsLoading(false));
    }
  }, [activeTab]);

  const removeGalleryItem = async (id: string) => {
    setGalleryError("");
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to delete slide");
      setGalleryItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err: unknown) {
      setGalleryError(err instanceof Error ? err.message : "Failed to delete slide");
    }
  };

  const handleUpdateGalleryTitle = (id: string, newTitle: string) => {
    setGalleryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, title: newTitle } : item))
    );
  };

  const saveGalleryTitle = async (id: string, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmed }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to save title");
    } catch (err: unknown) {
      setGalleryError(err instanceof Error ? err.message : "Failed to save title");
    }
  };

  const handleReplaceGalleryImage = async (file: File) => {
    if (!replacingGalleryId) return;
    setGalleryError("");
    setGalleryUploading(true);
    try {
      const url = await uploadImageFile(file, "studio");
      const res = await fetch(`/api/admin/gallery/${replacingGalleryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: url }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to save image");
      setGalleryItems((prev) =>
        prev.map((item) => (item.id === replacingGalleryId ? json.data : item))
      );
    } catch (err: unknown) {
      setGalleryError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setGalleryUploading(false);
      setReplacingGalleryId(null);
      if (galleryReplaceRef.current) galleryReplaceRef.current.value = "";
    }
  };

  const handleAddGallerySlide = async () => {
    if (!newGalleryImage.trim()) {
      setGalleryError("Add an image before saving the slide.");
      return;
    }
    setGalleryError("");
    setGalleryUploading(true);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newGalleryTitle.trim() || "New Slide",
          image: newGalleryImage.trim(),
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to add slide");
      setGalleryItems((prev) => [...prev, json.data]);
      setNewGalleryTitle("");
      setNewGalleryImage("");
      setShowAddGallery(false);
    } catch (err: unknown) {
      setGalleryError(err instanceof Error ? err.message : "Failed to add slide");
    } finally {
      setGalleryUploading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopNavBar
        breadcrumbs={[
          { label: "Console", href: "/admin/dashboard" },
          { label: "Studio Assets" },
        ]}
      />

      <main className="flex-1 flex flex-col">
        {/* Header & Tabs */}
        <div className="px-10 pt-8 border-b border-outline-variant bg-surface sticky top-0 z-30 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-[28px] font-light text-on-surface italic font-serif mb-2">Content Management</h2>
              <p className="text-[13px] text-on-surface-variant">Update and curate your studio&apos;s public storefront interface.</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => hasUnsavedChanges && setConfirmModal("discard")}
                disabled={!hasUnsavedChanges || saving}
                className="border border-outline-variant text-on-surface text-[11px] font-bold tracking-widest uppercase px-6 py-3 hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Discard
              </button>
              <button
                onClick={() => hasUnsavedChanges && setConfirmModal("publish")}
                disabled={!hasUnsavedChanges || saving}
                className="bg-primary text-on-primary font-bold text-[11px] uppercase tracking-widest px-6 py-3 flex items-center gap-2 hover:opacity-90 transition-all shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                {saved ? "Changes Published" : saving ? "Publishing..." : "Publish Changes"}
              </button>
            </div>
          </div>

          <div className="flex gap-8 border-b border-outline-variant/30">
            {([
              { key: "hero", label: "Hero & Home" },
              { key: "gallery", label: "Gallery Carousel" },
              { key: "feedback", label: "Customer Reviews" },
              { key: "arrivals", label: "New Arrivals" },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`text-[11px] font-bold tracking-widest uppercase pb-4 transition-colors relative ${
                  activeTab === tab.key
                    ? "text-primary border-b-2 border-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-10 flex-1 max-w-5xl">
          <AnimatePresence mode="wait">
            {activeTab === "hero" && (
              <motion.section
                key="hero"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                <div className="flex flex-col gap-2">
                  <h3 className="text-[20px] font-light text-on-surface italic font-serif">Hero &amp; Home Banner</h3>
                  <p className="text-[13px] text-on-surface-variant">Manage the landing banner&apos;s title, subtitle, image, and CTA.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Main Title</label>
                      <input
                        type="text"
                        value={heroTitle}
                        onChange={(e) => setHeroTitle(e.target.value)}
                        className="bg-surface-container border border-outline-variant text-on-surface p-3 font-serif italic text-[18px] focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Subtitle / Intro</label>
                      <textarea
                        rows={3}
                        value={heroSubtitle}
                        onChange={(e) => setHeroSubtitle(e.target.value)}
                        className="bg-surface-container border border-outline-variant text-on-surface p-3 text-[13px] focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-none"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Featured CTA Text</label>
                      <input
                        type="text"
                        value={heroCtaText}
                        onChange={(e) => setHeroCtaText(e.target.value)}
                        className="bg-surface-container border border-outline-variant text-on-surface p-3 text-[12px] font-semibold tracking-widest uppercase focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                      />
                    </div>
                  </div>

                  <div className="bg-surface-container border border-outline-variant p-6">
                    <AdminImageField
                      value={heroImage}
                      onChange={setHeroImage}
                      label="Hero Background Visual"
                      aspectClass="aspect-[16/9]"
                      folder="studio"
                      acceptVideo={true}
                    />
                  </div>
                </div>
              </motion.section>
            )}

            {activeTab === "gallery" && (
              <motion.section
                key="gallery"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                <div className="flex flex-col gap-2">
                  <h3 className="text-[20px] font-light text-on-surface italic font-serif">Storefront Slide Gallery</h3>
                  <p className="text-[13px] text-on-surface-variant">
                    Curate the horizontal slide carousel on the homepage. Changes save automatically.
                  </p>
                </div>

                <input
                  ref={galleryReplaceRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleReplaceGalleryImage(file);
                  }}
                />

                {galleryLoading ? (
                  <p className="text-[13px] text-on-surface-variant italic">Loading gallery…</p>
                ) : (
                <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
                  {galleryItems.map((item) => (
                    <div key={item.id} className="shrink-0 w-64 group bg-surface-container p-3 border border-outline-variant">
                      <div className="aspect-[3/4] bg-surface-container-highest relative mb-3">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          unoptimized
                          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setReplacingGalleryId(item.id);
                              galleryReplaceRef.current?.click();
                            }}
                            disabled={galleryUploading}
                            className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-primary hover:scale-105 transition-all disabled:opacity-50"
                            aria-label="Replace image"
                          >
                            <span className="material-symbols-outlined text-[16px]">upload</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => removeGalleryItem(item.id)}
                            className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-error hover:scale-105 transition-all"
                            aria-label="Delete slide"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleUpdateGalleryTitle(item.id, e.target.value)}
                        onBlur={(e) => saveGalleryTitle(item.id, e.target.value)}
                        className="w-full bg-transparent border-none border-b border-outline-variant py-1 text-[12px] text-on-surface focus:border-primary focus:ring-0 outline-none"
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => setShowAddGallery((v) => !v)}
                    className="shrink-0 w-64 border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-2 text-on-surface-variant hover:border-primary hover:text-primary transition-all bg-surface-container-low/20 min-h-[280px]"
                  >
                    <span className="material-symbols-outlined text-[36px]">add_circle</span>
                    <span className="text-[10px] font-bold tracking-widest uppercase">Add Slide</span>
                  </button>
                </div>
                )}

                {showAddGallery && (
                  <div className="max-w-sm bg-surface-container border border-outline-variant p-4 space-y-4">
                    <AdminImageField
                      value={newGalleryImage}
                      onChange={setNewGalleryImage}
                      aspectClass="aspect-[3/4]"
                      folder="studio"
                      emptyLabel="Upload slide image"
                    />
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">
                        Slide Title
                      </label>
                      <input
                        type="text"
                        value={newGalleryTitle}
                        onChange={(e) => setNewGalleryTitle(e.target.value)}
                        placeholder="e.g. Concrete Study 02"
                        className="w-full bg-surface border border-outline-variant px-3 py-2 text-[12px] text-on-surface focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleAddGallerySlide}
                        disabled={galleryUploading}
                        className="flex-1 py-2 bg-primary text-on-primary text-[10px] font-bold tracking-widest uppercase hover:opacity-90 disabled:opacity-50"
                      >
                        {galleryUploading ? "Saving…" : "Add to Gallery"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddGallery(false);
                          setNewGalleryTitle("");
                          setNewGalleryImage("");
                        }}
                        className="px-4 py-2 border border-outline-variant text-[10px] font-bold tracking-widest uppercase text-on-surface-variant hover:text-on-surface"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {galleryError && (
                  <p className="text-[11px] text-error">{galleryError}</p>
                )}
              </motion.section>
            )}

            {activeTab === "feedback" && (
              <motion.section
                key="feedback"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                <div className="flex flex-col gap-2">
                  <h3 className="text-[20px] font-light text-on-surface italic font-serif">Customer Testimonials</h3>
                  <p className="text-[13px] text-on-surface-variant">Moderate client responses and check live toggle controls.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {feedbackItems.map((item) => (
                    <div
                      key={item.id}
                      className={`p-6 bg-surface-container border rounded flex flex-col gap-4 transition-all ${
                        item.approved ? "border-primary" : "border-outline-variant"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                            {item.author} • {item.location}
                          </span>
                          <div className="flex gap-0.5 text-primary mt-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <span key={s} className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                star
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-[13px] text-on-surface italic">
                        &ldquo;{item.text}&rdquo;
                      </p>
                      <div className="mt-auto pt-4 border-t border-outline-variant flex justify-between items-center">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${item.approved ? "text-primary" : "text-on-surface-variant"}`}>
                          Status: {item.approved ? "Live" : "Inactive"}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase text-on-surface-variant">Approve</span>
                          <button
                            onClick={() => toggleFeedbackApproval(item.id)}
                            className={`w-9 h-5 rounded-full relative p-0.5 transition-colors ${
                              item.approved ? "bg-primary" : "bg-outline-variant"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 bg-background rounded-full transition-transform ${
                                item.approved ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {activeTab === "arrivals" && (
              <motion.section
                key="arrivals"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                {/* Promo Banner Section */}
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[20px] font-light text-on-surface italic font-serif">Promo Banner</h3>
                    <p className="text-[13px] text-on-surface-variant">
                      This banner is no longer used on the homepage. You can remove this section or repurpose it.
                    </p>
                  </div>

                  <div className="bg-surface-container border border-outline-variant p-6 flex flex-col gap-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div>
                        <AdminImageField
                          value={promoImage}
                          onChange={setPromoImage}
                          label="Promo Visual"
                          aspectClass="aspect-square"
                          folder="studio"
                          emptyLabel="Upload promo image"
                        />
                      </div>
                      <div className="lg:col-span-2 space-y-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Promotion Heading</label>
                          <input
                            type="text"
                            value={promoHeading}
                            onChange={(e) => setPromoHeading(e.target.value)}
                            className="bg-background border border-outline-variant text-on-surface p-3 font-serif italic text-[16px] focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Eyebrow / Series Label</label>
                          <input
                            type="text"
                            value={promoIntro}
                            onChange={(e) => setPromoIntro(e.target.value)}
                            className="bg-background border border-outline-variant text-on-surface p-3 text-[11px] font-semibold tracking-widest uppercase focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">CTA Button Label</label>
                          <input
                            type="text"
                            value={promoCtaText}
                            onChange={(e) => setPromoCtaText(e.target.value)}
                            className="bg-background border border-outline-variant text-on-surface p-3 text-[11px] font-semibold tracking-widest uppercase focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Featured Products Section */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-[20px] font-light text-on-surface italic font-serif">Featured New Arrivals</h3>
                  <p className="text-[13px] text-on-surface-variant">
                    Select up to 3 products to feature in the New Arrivals section on the homepage. Click Publish Changes to save.
                  </p>
                </div>

                {productsLoading ? (
                  <p className="text-[13px] text-on-surface-variant italic">Loading products…</p>
                ) : (
                  <div className="space-y-6">
                    {/* Selected Products */}
                    {featuredNewArrivals.length > 0 && (
                      <div className="bg-surface-container border border-primary p-6 space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="material-symbols-outlined text-primary text-[20px]">star</span>
                          <h4 className="text-[13px] font-bold uppercase tracking-widest text-primary">
                            Featured Products ({featuredNewArrivals.length}/3)
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {featuredNewArrivals.map((productId, index) => {
                            const product = allProducts.find((p) => p.id === productId);
                            if (!product) return null;
                            return (
                              <div key={productId} className="bg-surface border border-outline-variant p-3 relative group">
                                <div className="aspect-[3/4] bg-surface-container-highest relative mb-2">
                                  <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    sizes="200px"
                                  />
                                  <button
                                    onClick={() => setFeaturedNewArrivals((prev) => prev.filter((id) => id !== productId))}
                                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-error text-on-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label="Remove"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">close</span>
                                  </button>
                                  <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-[11px] font-bold">
                                    {index + 1}
                                  </div>
                                </div>
                                <p className="text-[11px] text-on-surface font-medium truncate">{product.name}</p>
                                <p className="text-[10px] text-on-surface-variant">${product.price}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Available Products */}
                    <div className="space-y-3">
                      <h4 className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                        Available Products (Click to Add)
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[600px] overflow-y-auto p-1">
                        {allProducts
                          .filter((p) => !featuredNewArrivals.includes(p.id))
                          .map((product) => (
                            <button
                              key={product.id}
                              onClick={() => {
                                if (featuredNewArrivals.length < 3) {
                                  setFeaturedNewArrivals((prev) => [...prev, product.id]);
                                }
                              }}
                              disabled={featuredNewArrivals.length >= 3}
                              className="bg-surface-container border border-outline-variant p-2 hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left group"
                            >
                              <div className="aspect-[3/4] bg-surface-container-highest relative mb-2">
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform"
                                  sizes="150px"
                                />
                              </div>
                              <p className="text-[10px] text-on-surface font-medium truncate">{product.name}</p>
                              <p className="text-[9px] text-on-surface-variant">${product.price}</p>
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* ── Confirmation Modal ───────────────────────────────────── */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setConfirmModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.18 }}
              className="bg-surface-container-high border border-outline-variant w-full max-w-sm p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {confirmModal === "publish" ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-primary text-[28px]">save</span>
                    <h3 className="text-[16px] font-light text-on-surface italic font-serif">
                      Publish Changes
                    </h3>
                  </div>
                  <p className="text-[13px] text-on-surface-variant mb-8 leading-relaxed">
                    This will save and publish all your current edits to the live storefront. Are you sure you want to continue?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setConfirmModal(null)}
                      className="flex-1 py-2.5 border border-outline-variant text-[11px] font-bold tracking-widest uppercase text-on-surface-variant hover:bg-surface-container-highest transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePublishChanges}
                      className="flex-1 py-2.5 bg-primary text-on-primary text-[11px] font-bold tracking-widest uppercase hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px]">save</span>
                      Publish
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-error text-[28px]">undo</span>
                    <h3 className="text-[16px] font-light text-on-surface italic font-serif">
                      Discard Changes
                    </h3>
                  </div>
                  <p className="text-[13px] text-on-surface-variant mb-8 leading-relaxed">
                    All unsaved edits will be lost and the form will reset to the last published state. This cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setConfirmModal(null)}
                      className="flex-1 py-2.5 border border-outline-variant text-[11px] font-bold tracking-widest uppercase text-on-surface-variant hover:bg-surface-container-highest transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDiscard}
                      className="flex-1 py-2.5 bg-error text-on-error text-[11px] font-bold tracking-widest uppercase hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px]">undo</span>
                      Discard
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

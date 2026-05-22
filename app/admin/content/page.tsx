"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import TopNavBar from "@/components/layout/TopNavBar";
import { useAdmin, FeedbackItem } from "@/context/AdminContext";

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

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveHero = () => {
    setSaving(true);
    setTimeout(() => {
      updateCmsData({
        heroTitle,
        heroSubtitle,
        heroImage,
        heroCtaText,
        featuredCategory,
      });
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 600);
  };

  // Mock Gallery data state
  const [galleryItems, setGalleryItems] = useState([
    { id: "g-1", title: "Concrete Study 01", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCRza8SyWDjM8Z6rfUc0uu9Lx_tvZudo6A_50JtEn2m4VFogGAhbcbX5wRcK-s3QJeOTyNWRwZ19OWmpHin275qsTGARqqShf7IO2TZBed4BLBRRPFDYg5C6l8PzYew1DIXC1oVU1w2-v-w7JKUNoUGv3s8SABkUb9MGrpj7SVCfN1rMenAJ6c9AghQxEl0fMZR8JKG3WI5cvLFS9YbdPokYbiSjnQSmpcwL08P8ccYEhukQGA9VFJ_rKgeyTINosOzxoY_VXHOdZA" },
    { id: "g-2", title: "Raw Silk Detail", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBo0FPqj-UsM-qhu96rxn5suXidLzzqFBwyKaGWHOjZpxaKGZAAN5Aa-YzM2mNw4baIbYzEp8t6d_Rs6qUHOtRmYqbKOmbnKUX7NLAizJZQdeIxQlf9nq1FWvIC98Goi7_f_SqN6cZiyn3GOY1ISCJAa_woqcFGpSJr3noZh0mNr3tm_a_A6joaWe9LPfeTDRnVDl87Bu4BZxpRS3nNT6WhjPntSxxZ5zJtANbK1tf86-JMzFqrkjg_HFWQv4sJXjRJUZ8ZSsXceSxP" },
  ]);

  const removeGalleryItem = (id: string) => {
    setGalleryItems(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateGalleryTitle = (id: string, newTitle: string) => {
    setGalleryItems(prev => prev.map(item => item.id === id ? { ...item, title: newTitle } : item));
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
              <button className="border border-outline-variant text-on-surface text-[11px] font-bold tracking-widest uppercase px-6 py-3 hover:bg-surface-container transition-colors">
                Discard
              </button>
              <button
                onClick={handleSaveHero}
                className="bg-primary text-on-primary font-bold text-[11px] uppercase tracking-widest px-6 py-3 flex items-center gap-2 hover:opacity-90 transition-all shadow-lg"
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

                  <div className="bg-surface-container border border-outline-variant p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Hero Background Visual</label>
                    </div>
                    <div className="aspect-[16/9] bg-surface-container-highest border border-outline-variant overflow-hidden relative">
                      <Image
                        src={heroImage}
                        alt="Hero background preview"
                        fill
                        className="object-cover opacity-80"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">Image URL</label>
                      <input
                        type="url"
                        value={heroImage}
                        onChange={(e) => setHeroImage(e.target.value)}
                        className="w-full bg-surface border border-outline-variant px-3 py-2 text-[12px] text-on-surface focus:outline-none focus:border-primary"
                        placeholder="https://..."
                      />
                    </div>
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
                  <p className="text-[13px] text-on-surface-variant">Curate the horizontal slide carousel featured on the main index.</p>
                </div>

                <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
                  {galleryItems.map((item) => (
                    <div key={item.id} className="shrink-0 w-64 group bg-surface-container p-3 border border-outline-variant">
                      <div className="aspect-[3/4] bg-surface-container-highest relative mb-3">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            onClick={() => removeGalleryItem(item.id)}
                            className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-error hover:scale-105 transition-all"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleUpdateGalleryTitle(item.id, e.target.value)}
                        className="w-full bg-transparent border-none border-b border-outline-variant py-1 text-[12px] text-on-surface focus:border-primary focus:ring-0 outline-none"
                      />
                    </div>
                  ))}

                  <div className="shrink-0 w-64 border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-2 text-on-surface-variant hover:border-primary hover:text-primary cursor-pointer transition-all bg-surface-container-low/20">
                    <span className="material-symbols-outlined text-[36px]">add_circle</span>
                    <span className="text-[10px] font-bold tracking-widest uppercase">Add Slide</span>
                  </div>
                </div>
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
                <div className="flex flex-col gap-2">
                  <h3 className="text-[20px] font-light text-on-surface italic font-serif">Promo Banner &amp; Editorial Drops</h3>
                  <p className="text-[13px] text-on-surface-variant">Adjust banner titles and copy for mid-page promotion sections.</p>
                </div>

                <div className="bg-surface-container border border-outline-variant p-6 flex flex-col gap-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="aspect-square bg-surface-container-highest border border-outline-variant relative">
                      <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBo0FPqj-UsM-qhu96rxn5suXidLzzqFBwyKaGWHOjZpxaKGZAAN5Aa-YzM2mNw4baIbYzEp8t6d_Rs6qUHOtRmYqbKOmbnKUX7NLAizJZQdeIxQlf9nq1FWvIC98Goi7_f_SqN6cZiyn3GOY1ISCJAa_woqcFGpSJr3noZh0mNr3tm_a_A6joaWe9LPfeTDRnVDl87Bu4BZxpRS3nNT6WhjPntSxxZ5zJtANbK1tf86-JMzFqrkjg_HFWQv4sJXjRJUZ8ZSsXceSxP"
                        alt="Promo image"
                        fill
                        className="object-cover grayscale"
                      />
                    </div>
                    <div className="lg:col-span-2 space-y-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Promotion Heading</label>
                        <input
                          type="text"
                          defaultValue="THE FALL EDIT: TEXTILE STUDY"
                          className="bg-background border border-outline-variant text-on-surface p-3 font-serif italic text-[16px] focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">CTA Button Label</label>
                        <input
                          type="text"
                          defaultValue="EXPLORE THE COLLECTION"
                          className="bg-background border border-outline-variant text-on-surface p-3 text-[11px] font-semibold tracking-widest uppercase focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Intro Copy</label>
                        <textarea
                          rows={3}
                          defaultValue="Discover the intersection of raw silk and structural oak. A collection designed for the tactile minimalist."
                          className="bg-background border border-outline-variant text-on-surface p-3 text-[13px] focus:outline-none focus:border-primary resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

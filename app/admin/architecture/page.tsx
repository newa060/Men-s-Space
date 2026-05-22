"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import TopNavBar from "@/components/layout/TopNavBar";
import { useAdmin, Installation } from "@/context/AdminContext";

const statusColors: Record<Installation["status"], string> = {
  Completed: "text-primary border-primary/30 bg-primary/5",
  "In Progress": "text-secondary border-secondary/30 bg-secondary/5",
  Concept: "text-on-surface-variant border-outline-variant/50 bg-surface-container-high/5",
};

export default function ArchitecturePage() {
  const { installations, addInstallation } = useAdmin();
  const [filter, setFilter] = useState<"All" | Installation["status"]>("All");
  const [sortBy, setSortBy] = useState<"Recent" | "A-Z" | "Status">("Recent");
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New installation form state
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<Installation["status"]>("Concept");
  const [structure, setStructure] = useState("");
  const [image, setImage] = useState("");

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    addInstallation({
      title,
      location,
      status,
      structure,
      image: image || "https://lh3.googleusercontent.com/aida-public/AB6AXuB-K5S7L2SMwsPD27sV6m8MyjkorZ_6i8fVwK-1-s1x1Td0C7qNCvvsOHUg5_hUi5X7RWqlC8b8YqzLKFSIQD5jyaEsqwMzreKZwsw3GcENZy7mTvz2kDLV8UIgc2hb3pFEPtCdGUC6peBQ95Of384Ttd1y3sB9jzmu1N3JqZsgPCiEa24Tn6UIo1kOnrLzZQkU0Uqo7zlokTeViYPy8k35_6XqyhGGTpJIKt02wNkd5gC-W5YZsG8YdLZi_jhKcl3WMH08YNEci_Fq",
    });
    // Reset Form
    setTitle("");
    setLocation("");
    setStatus("Concept");
    setStructure("");
    setImage("");
    setIsAddOpen(false);
  };

  const filtered = installations.filter((inst) => {
    if (filter === "All") return true;
    return inst.status === filter;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "A-Z") return a.title.localeCompare(b.title);
    if (sortBy === "Status") return a.status.localeCompare(b.status);
    return 0; // Recent is chronological based on seed / insertion
  });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopNavBar
        breadcrumbs={[
          { label: "Console", href: "/admin/dashboard" },
          { label: "Architecture" },
        ]}
      />

      <main className="flex-1 p-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 className="text-[32px] md:text-[40px] font-light text-on-surface italic font-serif mb-2">
              Architecture
            </h2>
            <p className="text-[14px] text-on-surface-variant max-w-xl">
              Manage spatial installations, structural blueprints, and environmental design projects across global locations.
            </p>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-primary-container text-on-primary-fixed font-bold text-[11px] uppercase tracking-widest px-6 py-3 rounded hover:bg-primary transition-all duration-200 border border-transparent"
          >
            New Project
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-8 border-b border-[#2A2A2A] pb-4">
          <div className="flex gap-2">
            {(["All", "Completed", "In Progress", "Concept"] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`px-4 py-1.5 border transition-all text-[10px] font-bold uppercase tracking-widest ${
                  filter === opt
                    ? "border-primary text-primary bg-primary/5"
                    : "border-outline-variant text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-0 border-b border-outline-variant text-on-surface text-[10px] font-bold uppercase tracking-widest focus:ring-0 focus:border-primary py-1 pr-8 cursor-pointer outline-none"
            >
              <option value="Recent" className="bg-surface-container">Recent</option>
              <option value="A-Z" className="bg-surface-container">A-Z</option>
              <option value="Status" className="bg-surface-container">Status</option>
            </select>
          </div>
        </div>

        {/* Project Grid (Bento Style) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[320px]">
          {sorted.length === 0 ? (
            <div className="col-span-12 py-20 text-center text-on-surface-variant text-[14px]">
              No installations found in this category.
            </div>
          ) : (
            sorted.map((item, index) => {
              // Bento layout rules: First card is large (col-span-8, row-span-2), subsequent are col-span-4, row-span-1
              const isLarge = index === 0 && filter === "All";
              return (
                <article
                  key={item.id}
                  className={`group relative border border-[#2A2A2A] overflow-hidden bg-surface-container flex flex-col justify-end transition-all ${
                    isLarge ? "md:col-span-8 row-span-2" : "md:col-span-4 row-span-1"
                  }`}
                >
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover opacity-50 group-hover:opacity-75 transition-opacity duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#110e08] via-[#110e08]/40 to-transparent"></div>
                  </div>
                  <div className={`relative z-10 flex flex-col ${isLarge ? "p-8 gap-4" : "p-6 h-full justify-between"}`}>
                    <div className="flex justify-between items-start">
                      <span
                        className={`inline-flex items-center px-3 py-1 text-[9px] font-bold uppercase tracking-widest border rounded-full ${
                          statusColors[item.status]
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                        {item.location}
                      </p>
                      <h3
                        className={`text-on-surface font-serif italic ${
                          isLarge ? "text-[24px] md:text-[32px] mb-2" : "text-[18px] md:text-[22px]"
                        }`}
                      >
                        {item.title}
                      </h3>
                      {isLarge && (
                        <p className="text-[13px] text-on-surface-variant max-w-lg mt-1">
                          {item.structure}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          )}

          {/* Static archives bottom row */}
          <div className="md:col-span-12 flex flex-col gap-4 mt-8">
            <h4 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-[#2A2A2A] pb-2">
              Recent Archives
            </h4>
            <div className="flex items-center justify-between py-4 border-b border-[#2A2A2A] hover:bg-surface-container-low transition-colors px-4 -mx-4 group cursor-pointer">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-surface-container border border-[#2A2A2A] overflow-hidden shrink-0 hidden sm:block relative">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhcsO34NxfZTupQXNN2KWlRYNIXsPw4LHlXJJkHR0qMZ2NO-KIkytHfkVIYMP5eSvUGmgHi6pbZ9divOhjy_v1yEeKPuuI18PaTRID5I0EIzTz3qV2yLX7tX-9KnYR7mUmFjlBlz3YDp8lWd3FdfB58dD64kiuWEu3bYJEvDmcQQD6xz3RBaoOcKQs4U64lRsWH2lwymtboJPBYkVmqJOopxl0UCBYwxbjaeoh9dfXNuHoIU04lfKARxt3MhUYkRFBGbR7yeRKE34C"
                    alt="Bridge"
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div>
                  <h4 className="text-[16px] text-on-surface font-serif italic">Nordic Walkway Intervention</h4>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">
                    Oslo, Norway • Installation
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                2023
              </span>
            </div>
            <div className="flex items-center justify-between py-4 border-b border-[#2A2A2A] hover:bg-surface-container-low transition-colors px-4 -mx-4 group cursor-pointer">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-surface-container border border-[#2A2A2A] overflow-hidden shrink-0 hidden sm:block relative">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4dYRB_UWcSk92D_CD0EVerAjYcIGIdaG6kH885KhPqDfnqhwxtan7QxIUxboAYs5ykH4Ous3_9spQnmNWLYjCRWea_p1P_ovmMyCGifIOZhwblrLK1ZC341AeRaKYjfV-CwcDymbvZ0GW4xEUoTJrryFVDBrpb8c9CtCW5IastPUSHAXd-IAIgxlJ1FTLn8T17w5DkRsEZOjaZxjBMKFco5Zw0sslLNsoHKfTitoqr2dpEUuQ5LhmVi6qczPO7WSofCrzrhRal4EW"
                    alt="Office"
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div>
                  <h4 className="text-[16px] text-on-surface font-serif italic">Studio HQ Refurbishment</h4>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">
                    London, UK • Interior Architecture
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                2022
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Add Project Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface-container-high border border-outline-variant max-w-lg w-full p-6 shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-[20px] font-light text-on-surface italic font-serif">
                  New Spatial Project
                </h3>
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <form onSubmit={handleAddProject} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Project Title *
                  </label>
                  <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Concrete Pavillion"
                    className="w-full bg-surface border border-outline-variant px-3 py-2 text-[13px] text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Location *
                  </label>
                  <input
                    required
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Kyoto, Japan"
                    className="w-full bg-surface border border-outline-variant px-3 py-2 text-[13px] text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Structure Type / Materials *
                  </label>
                  <input
                    required
                    type="text"
                    value={structure}
                    onChange={(e) => setStructure(e.target.value)}
                    placeholder="e.g. Pre-cast Ribbed Concrete Frame"
                    className="w-full bg-surface border border-outline-variant px-3 py-2 text-[13px] text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-surface border border-outline-variant px-3 py-2 text-[13px] text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-surface border border-outline-variant px-3 py-2 text-[13px] text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="Concept">Concept</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="flex-1 py-2 border border-outline-variant text-[11px] font-bold uppercase tracking-widest text-on-surface hover:bg-surface-container"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-primary text-on-primary text-[11px] font-bold uppercase tracking-widest hover:opacity-90"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

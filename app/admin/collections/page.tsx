"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import TopNavBar from "@/components/layout/TopNavBar";
import { useAdmin, Product } from "@/context/AdminContext";

const statusBadge: Record<Product["status"], string> = {
  Active: "bg-primary/10 text-primary border-primary/20",
  Draft: "bg-outline/10 text-on-surface-variant border-outline/20",
  Archived: "bg-surface-container text-on-surface-variant border-outline-variant/30",
};

const stockDot: Record<string, string> = {
  high: "bg-primary",
  low: "bg-primary/40",
  out: "bg-error",
};

export default function CollectionsPage() {
  const { products, deleteProduct } = useAdmin();
  const [category, setCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = products.filter((p) => {
    const catMatch = category === "All" || p.category === category;
    const statMatch = statusFilter === "All" || p.status === statusFilter;
    return catMatch && statMatch;
  });

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];
  const statuses = ["All", "Active", "Draft", "Archived"];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopNavBar
        breadcrumbs={[
          { label: "Console", href: "/admin/dashboard" },
          { label: "Collections" },
        ]}
      />

      <div className="p-10 flex-1 flex flex-col gap-8">
        {/* Header Row */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
        >
          <div>
            <nav className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant mb-2 uppercase tracking-widest">
              <a href="/admin/dashboard" className="hover:text-primary transition-colors">Dashboard</a>
              <span className="opacity-30">/</span>
              <span className="text-on-surface">Collections</span>
            </nav>
            <h2 className="text-[28px] font-light text-on-surface italic font-serif">Curated Inventory</h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Category filter */}
            <div className="flex border border-outline-variant">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-transparent border-none text-[11px] font-bold tracking-widest uppercase text-on-surface px-4 py-2 focus:ring-0 cursor-pointer hover:bg-surface-container transition-colors outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-surface-container text-on-surface">
                    Category: {c}
                  </option>
                ))}
              </select>
              <div className="w-px bg-outline-variant my-2" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent border-none text-[11px] font-bold tracking-widest uppercase text-on-surface px-4 py-2 focus:ring-0 cursor-pointer hover:bg-surface-container transition-colors outline-none"
              >
                {statuses.map((s) => (
                  <option key={s} value={s} className="bg-surface-container text-on-surface">
                    Status: {s}
                  </option>
                ))}
              </select>
            </div>

            <Link
              href="/admin/collections/new"
              className="bg-primary-container text-on-primary-fixed text-[11px] font-bold tracking-widest uppercase px-6 py-2.5 hover:opacity-90 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Add Product
            </Link>
          </div>
        </motion.section>

        {/* Table */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-surface-container-lowest border border-outline-variant overflow-hidden flex-1"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant border-b border-outline-variant">
                  {["Thumbnail", "Name", "Category", "Price", "Stock", "Status", "Actions"].map((h, i) => (
                    <th
                      key={h}
                      className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest ${
                        i === 3 || i === 6 ? "text-right" : ""
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center text-on-surface-variant text-[13px]">
                      No products match the selected filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((product) => {
                    const stockState =
                      product.stock === 0 ? "out" : product.stock <= 5 ? "low" : "high";
                    return (
                      <tr
                        key={product.id}
                        className="group hover:bg-surface-container-low transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4">
                          <div className="w-12 h-16 bg-surface-container-high overflow-hidden border border-outline-variant">
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={48}
                              height={64}
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-[14px] text-on-surface font-medium">{product.name}</span>
                            <span className="text-[10px] text-on-surface-variant opacity-60">SKU: {product.sku}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[13px] text-on-surface-variant">{product.category}</td>
                        <td className="px-6 py-4 text-[14px] text-on-surface text-right font-semibold tracking-tight">
                          ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${stockDot[stockState]}`} />
                            <span className="text-[11px] font-semibold text-on-surface">
                              {product.stock === 0 ? "Out of Stock" : `${product.stock} in Stock`}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 text-[9px] font-bold tracking-widest uppercase border rounded-full ${
                              statusBadge[product.status]
                            }`}
                          >
                            {product.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenu(openMenu === product.id ? null : product.id);
                            }}
                            className="text-on-surface-variant hover:text-on-surface transition-colors p-2"
                          >
                            <span className="material-symbols-outlined text-[20px]">more_vert</span>
                          </button>
                          {openMenu === product.id && (
                            <div className="absolute right-8 top-12 z-50 bg-surface-container-high border border-outline-variant shadow-lg min-w-[140px]">
                              <Link
                                href={`/admin/collections/edit/${product.id}`}
                                className="flex items-center gap-2 px-4 py-2.5 text-[12px] text-on-surface hover:bg-surface-container-highest transition-colors"
                                onClick={() => setOpenMenu(null)}
                              >
                                <span className="material-symbols-outlined text-[16px]">edit</span>
                                Edit
                              </Link>
                              <button
                                onClick={() => {
                                  deleteProduct(product.id);
                                  setOpenMenu(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-[12px] text-error hover:bg-error/10 transition-colors"
                              >
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination footer */}
          <div className="px-6 py-4 bg-surface-container-low border-t border-outline-variant flex justify-between items-center">
            <span className="text-[11px] text-on-surface-variant">
              Showing {filtered.length} of {products.length} curated items
            </span>
            <div className="flex gap-2">
              <button className="p-2 text-on-surface-variant hover:text-primary transition-colors opacity-30 cursor-not-allowed">
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

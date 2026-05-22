"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import TopNavBar from "@/components/layout/TopNavBar";
import { useAdmin, Order } from "@/context/AdminContext";

const badgeStyles: Record<Order["status"], string> = {
  PENDING: "bg-outline/10 text-on-surface-variant border-outline/20",
  PROCESSING: "bg-primary/10 text-primary border-primary/20",
  SHIPPED: "bg-primary-container/20 text-on-primary-container border-primary/20",
  COMPLETED: "bg-tertiary-container/10 text-tertiary border-tertiary/20",
  CANCELLED: "bg-error/15 text-error border-error/20",
};

export default function OrdersPage() {
  const { orders, updateOrderStatus } = useAdmin();
  const [activeTab, setActiveTab] = useState<"ALL" | Order["status"]>("ALL");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (activeTab === "ALL") return true;
    return o.status === activeTab;
  });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopNavBar
        breadcrumbs={[
          { label: "Console", href: "/admin/dashboard" },
          { label: "Orders" },
        ]}
      />

      <div className="p-10 flex-1 flex flex-col gap-8">
        {/* Header */}
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
              <span className="text-on-surface">Orders</span>
            </nav>
            <h2 className="text-[28px] font-light text-on-surface italic font-serif">Customer Orders</h2>
            <p className="text-[13px] text-on-surface-variant mt-1">
              Manage client acquisitions, tracking, and editorial fulfillment across the Aesthete ecosystem.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-2 border border-outline text-[11px] font-bold tracking-widest uppercase text-on-surface hover:bg-surface-container-high transition-all">
              Export CSV
            </button>
            <button className="px-6 py-2 bg-primary-container text-on-primary-fixed text-[11px] font-bold tracking-widest uppercase hover:opacity-90 transition-all">
              Process Batch
            </button>
          </div>
        </motion.section>

        {/* Filters and Tabs */}
        <div className="bg-surface-container-lowest border border-outline-variant p-6 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex gap-6 border-b border-outline-variant/30 flex-1">
              {(["ALL", "PENDING", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[11px] font-bold tracking-widest uppercase pb-2 transition-colors relative ${
                    activeTab === tab
                      ? "text-primary border-b-2 border-primary"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4 text-on-surface-variant">
              <div className="flex items-center gap-2 px-3 py-1.5 border border-outline-variant text-[10px] font-bold tracking-widest uppercase cursor-pointer hover:border-outline transition-colors">
                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                Aug 01 - Aug 31, 2024
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 border border-outline-variant text-[10px] font-bold tracking-widest uppercase cursor-pointer hover:border-outline transition-colors">
                <span className="material-symbols-outlined text-[16px]">filter_list</span>
                Advanced Filters
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-surface border border-outline-variant overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr>
                  {["Order ID", "Customer Name", "Date", "Items Count", "Total", "Status", "Actions"].map((h, i) => (
                    <th
                      key={h}
                      className={`px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ${
                        i === 3 ? "text-center" : i === 4 || i === 6 ? "text-right" : ""
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center text-on-surface-variant text-[13px]">
                      No orders found under this status.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-primary/5 transition-colors group"
                    >
                      <td className="px-6 py-5 text-[13px] font-semibold text-primary">{order.id}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant overflow-hidden relative">
                            <Image
                              src={order.customerImage}
                              alt={order.customerName}
                              fill
                              className="object-cover grayscale"
                            />
                          </div>
                          <span className="text-[13px] text-on-surface font-medium">{order.customerName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-[13px] text-on-surface-variant">{order.date}</td>
                      <td className="px-6 py-5 text-[13px] text-on-surface text-center font-medium">
                        {order.itemsCount.toString().padStart(2, "0")}
                      </td>
                      <td className="px-6 py-5 text-[14px] text-on-surface text-right font-semibold tracking-tight">
                        ${order.totalPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase border ${
                            badgeStyles[order.status]
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right relative">
                        <button
                          onClick={() => setOpenMenu(openMenu === order.id ? null : order.id)}
                          className="text-on-surface-variant hover:text-primary transition-colors p-2"
                        >
                          <span className="material-symbols-outlined text-[20px]">more_vert</span>
                        </button>
                        {openMenu === order.id && (
                          <div className="absolute right-8 top-12 z-50 bg-surface-container-high border border-outline-variant shadow-lg min-w-[150px] text-left">
                            <div className="px-3 py-1.5 text-[9px] font-bold text-on-surface-variant border-b border-outline-variant/30 uppercase tracking-widest">
                              Update Status
                            </div>
                            {(["PENDING", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"] as const).map((s) => (
                              <button
                                key={s}
                                onClick={() => {
                                  updateOrderStatus(order.id, s);
                                  setOpenMenu(null);
                                }}
                                className="w-full text-left px-4 py-2 text-[11px] text-on-surface hover:bg-surface-container-highest transition-colors uppercase tracking-wide"
                              >
                                {s.toLowerCase()}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-surface-container-low flex items-center justify-between border-t border-outline-variant">
            <span className="text-[11px] text-on-surface-variant">
              Showing 1-{filteredOrders.length} of {orders.length} orders
            </span>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:border-primary transition-all">
                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center border border-primary text-primary bg-primary/5 text-[11px] font-bold">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:border-primary transition-all">
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

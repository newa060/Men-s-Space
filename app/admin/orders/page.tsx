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

const ALL_STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"] as const;

export default function OrdersPage() {
  const { orders, updateOrderStatus } = useAdmin();
  const [activeTab, setActiveTab] = useState<"ALL" | Order["status"]>("ALL");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Batch selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [batchStatus, setBatchStatus] = useState<Order["status"]>("PROCESSING");
  const [batchLoading, setBatchLoading] = useState(false);

  // Date filter state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePreset, setDatePreset] = useState<string>("ALL");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");

  // Advanced filter state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minItems, setMinItems] = useState("");
  const [maxItems, setMaxItems] = useState("");

  const getDateRangeLabel = () => {
    if (datePreset === "ALL") return "ALL TIME";
    if (datePreset === "TODAY") return "TODAY";
    if (datePreset === "YESTERDAY") return "YESTERDAY";
    if (datePreset === "LAST_7") return "LAST 7 DAYS";
    if (datePreset === "LAST_30") return "LAST 30 DAYS";
    if (datePreset === "THIS_MONTH") return "THIS MONTH";
    if (datePreset === "LAST_MONTH") return "LAST MONTH";
    if (datePreset === "CUSTOM") {
      if (customStartDate && customEndDate) {
        const startStr = new Date(customStartDate).toLocaleDateString("en-US", { month: "short", day: "2-digit" });
        const endStr = new Date(customEndDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
        return `${startStr} - ${endStr}`.toUpperCase();
      }
      return "CUSTOM RANGE";
    }
    return "DATE RANGE";
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab !== "ALL" && o.status !== activeTab) return false;

    // Date Filter
    if (datePreset !== "ALL") {
      const orderDate = new Date(o.date);
      orderDate.setHours(0, 0, 0, 0);

      let start: Date | null = null;
      let end: Date | null = null;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (datePreset === "TODAY") {
        start = today;
        end = new Date(today);
        end.setHours(23, 59, 59, 999);
      } else if (datePreset === "YESTERDAY") {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        start = yesterday;
        end = new Date(yesterday);
        end.setHours(23, 59, 59, 999);
      } else if (datePreset === "LAST_7") {
        const past7 = new Date(today);
        past7.setDate(past7.getDate() - 7);
        start = past7;
        end = new Date(today);
        end.setHours(23, 59, 59, 999);
      } else if (datePreset === "LAST_30") {
        const past30 = new Date(today);
        past30.setDate(past30.getDate() - 30);
        start = past30;
        end = new Date(today);
        end.setHours(23, 59, 59, 999);
      } else if (datePreset === "THIS_MONTH") {
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        start = firstDay;
        end = new Date(today);
        end.setHours(23, 59, 59, 999);
      } else if (datePreset === "LAST_MONTH") {
        const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        start = firstDayLastMonth;
        end = lastDayLastMonth;
        end.setHours(23, 59, 59, 999);
      } else if (datePreset === "CUSTOM") {
        if (customStartDate) {
          start = new Date(customStartDate);
          start.setHours(0, 0, 0, 0);
        }
        if (customEndDate) {
          end = new Date(customEndDate);
          end.setHours(23, 59, 59, 999);
        }
      }

      if (start && orderDate < start) return false;
      if (end && orderDate > end) return false;
    }

    // Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const idMatch = o.id.toLowerCase().includes(q);
      const nameMatch = o.customerName.toLowerCase().includes(q);
      const itemsMatch = o.items.toLowerCase().includes(q);
      if (!idMatch && !nameMatch && !itemsMatch) return false;
    }

    // Price Range
    if (minPrice !== "" && o.totalPrice < Number(minPrice)) return false;
    if (maxPrice !== "" && o.totalPrice > Number(maxPrice)) return false;

    // Items Count Range
    if (minItems !== "" && o.itemsCount < Number(minItems)) return false;
    if (maxItems !== "" && o.itemsCount > Number(maxItems)) return false;

    return true;
  });

  // ── Export CSV ──────────────────────────────────────────────
  const handleExportCSV = () => {
    const rows = [
      ["Order ID", "Customer Name", "Date", "Items Count", "Total ($)", "Status"],
      ...filteredOrders.map((o) => [
        o.id,
        o.customerName,
        o.date,
        o.itemsCount,
        o.totalPrice.toFixed(2),
        o.status,
      ]),
    ];

    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `orders-${activeTab.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // ── Batch selection helpers ──────────────────────────────────
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredOrders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredOrders.map((o) => o.id)));
    }
  };

  // ── Process Batch ────────────────────────────────────────────
  const handleProcessBatch = async () => {
    if (selectedIds.size === 0) return;
    setBatchLoading(true);
    await Promise.all(Array.from(selectedIds).map((id) => updateOrderStatus(id, batchStatus)));
    setBatchLoading(false);
    setSelectedIds(new Set());
    setBatchModalOpen(false);
  };

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
            <button
              onClick={handleExportCSV}
              className="px-6 py-2 border border-outline text-[11px] font-bold tracking-widest uppercase text-on-surface hover:bg-surface-container-high transition-all"
            >
              Export CSV
            </button>
            <button
              onClick={() => {
                if (selectedIds.size === 0) {
                  // Select all visible orders first, then open modal
                  setSelectedIds(new Set(filteredOrders.map((o) => o.id)));
                }
                setBatchModalOpen(true);
              }}
              className="px-6 py-2 bg-primary-container text-on-primary-fixed text-[11px] font-bold tracking-widest uppercase hover:opacity-90 transition-all"
            >
              Process Batch
              {selectedIds.size > 0 && (
                <span className="ml-2 bg-primary text-on-primary rounded-full px-1.5 py-0.5 text-[9px]">
                  {selectedIds.size}
                </span>
              )}
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
                  onClick={() => { setActiveTab(tab); setSelectedIds(new Set()); }}
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
              {/* Date Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowDatePicker(!showDatePicker);
                    setShowAdvancedFilters(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 border text-[10px] font-bold tracking-widest uppercase transition-colors ${
                    showDatePicker || datePreset !== "ALL"
                      ? "border-primary text-primary"
                      : "border-outline-variant hover:border-outline"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                  {getDateRangeLabel()}
                </button>

                {showDatePicker && (
                  <div className="absolute right-0 mt-2 z-50 bg-surface-container-high border border-outline-variant shadow-2xl p-4 min-w-[260px] flex flex-col gap-3 animate-fade-in-up">
                    <div className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/30 pb-2 mb-1">
                      Select Date Range
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      {[
                        { value: "ALL", label: "ALL TIME" },
                        { value: "TODAY", label: "TODAY" },
                        { value: "YESTERDAY", label: "YESTERDAY" },
                        { value: "LAST_7", label: "LAST 7 DAYS" },
                        { value: "LAST_30", label: "LAST 30 DAYS" },
                        { value: "THIS_MONTH", label: "THIS MONTH" },
                        { value: "LAST_MONTH", label: "LAST MONTH" },
                        { value: "CUSTOM", label: "CUSTOM RANGE" },
                      ].map((preset) => (
                        <button
                          key={preset.value}
                          onClick={() => setDatePreset(preset.value)}
                          className={`px-2 py-1.5 text-center border text-[9px] font-semibold tracking-wider uppercase transition-colors ${
                            datePreset === preset.value
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-outline-variant text-on-surface-variant hover:border-outline hover:text-on-surface"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    {datePreset === "CUSTOM" && (
                      <div className="flex flex-col gap-2 border-t border-outline-variant/30 pt-3 mt-1">
                        <div className="flex flex-col gap-1">
                          <label className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider">Start Date</label>
                          <input
                            type="date"
                            value={customStartDate}
                            onChange={(e) => setCustomStartDate(e.target.value)}
                            className="bg-surface border border-outline-variant text-[11px] px-2 py-1 text-on-surface focus:outline-none focus:border-primary w-full"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider">End Date</label>
                          <input
                            type="date"
                            value={customEndDate}
                            onChange={(e) => setCustomEndDate(e.target.value)}
                            className="bg-surface border border-outline-variant text-[11px] px-2 py-1 text-on-surface focus:outline-none focus:border-primary w-full"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 border-t border-outline-variant/30 pt-3 mt-1">
                      <button
                        onClick={() => {
                          setDatePreset("ALL");
                          setCustomStartDate("");
                          setCustomEndDate("");
                          setShowDatePicker(false);
                        }}
                        className="flex-1 py-1.5 border border-outline-variant text-[9px] font-bold tracking-widest uppercase text-on-surface-variant hover:bg-surface-container-highest transition-all"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => setShowDatePicker(false)}
                        className="flex-1 py-1.5 bg-primary text-on-primary text-[9px] font-bold tracking-widest uppercase hover:opacity-90 transition-all"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Advanced Filters Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowAdvancedFilters(!showAdvancedFilters);
                    setShowDatePicker(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 border text-[10px] font-bold tracking-widest uppercase transition-colors ${
                    showAdvancedFilters || searchQuery || minPrice || maxPrice || minItems || maxItems
                      ? "border-primary text-primary"
                      : "border-outline-variant hover:border-outline"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">filter_list</span>
                  Advanced Filters
                  {(searchQuery || minPrice || maxPrice || minItems || maxItems) && (
                    <span className="ml-1 bg-primary text-on-primary rounded-full w-3.5 h-3.5 flex items-center justify-center text-[8px] font-bold">
                      !
                    </span>
                  )}
                </button>

                {showAdvancedFilters && (
                  <div className="absolute right-0 mt-2 z-50 bg-surface-container-high border border-outline-variant shadow-2xl p-5 min-w-[300px] flex flex-col gap-4 animate-fade-in-up">
                    <div className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/30 pb-2">
                      Advanced Filters
                    </div>

                    {/* Search Input */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider">Search Orders</label>
                      <input
                        type="text"
                        placeholder="Search ID, Customer, Items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-surface border border-outline-variant text-[11px] px-2.5 py-1.5 text-on-surface focus:outline-none focus:border-primary placeholder-on-surface-variant/40"
                      />
                    </div>

                    {/* Price Range */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider">Price Range ($)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="w-full bg-surface border border-outline-variant text-[11px] px-2.5 py-1.5 text-on-surface focus:outline-none focus:border-primary placeholder-on-surface-variant/40"
                        />
                        <span className="text-[10px] text-on-surface-variant/50">—</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="w-full bg-surface border border-outline-variant text-[11px] px-2.5 py-1.5 text-on-surface focus:outline-none focus:border-primary placeholder-on-surface-variant/40"
                        />
                      </div>
                    </div>

                    {/* Items Count Range */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider">Items Count</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={minItems}
                          onChange={(e) => setMinItems(e.target.value)}
                          className="w-full bg-surface border border-outline-variant text-[11px] px-2.5 py-1.5 text-on-surface focus:outline-none focus:border-primary placeholder-on-surface-variant/40"
                        />
                        <span className="text-[10px] text-on-surface-variant/50">—</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={maxItems}
                          onChange={(e) => setMaxItems(e.target.value)}
                          className="w-full bg-surface border border-outline-variant text-[11px] px-2.5 py-1.5 text-on-surface focus:outline-none focus:border-primary placeholder-on-surface-variant/40"
                        />
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 border-t border-outline-variant/30 pt-3 mt-1">
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setMinPrice("");
                          setMaxPrice("");
                          setMinItems("");
                          setMaxItems("");
                          setShowAdvancedFilters(false);
                        }}
                        className="flex-1 py-1.5 border border-outline-variant text-[9px] font-bold tracking-widest uppercase text-on-surface-variant hover:bg-surface-container-highest transition-all"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => setShowAdvancedFilters(false)}
                        className="flex-1 py-1.5 bg-primary text-on-primary text-[9px] font-bold tracking-widest uppercase hover:opacity-90 transition-all"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Batch selection bar */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-4 px-4 py-3 bg-primary/10 border border-primary/20 text-[12px] text-primary font-semibold tracking-wide">
            <span>{selectedIds.size} order{selectedIds.size > 1 ? "s" : ""} selected</span>
            <button
              onClick={() => setBatchModalOpen(true)}
              className="px-4 py-1 bg-primary text-on-primary text-[10px] font-bold tracking-widest uppercase hover:opacity-90 transition-all"
            >
              Apply Status
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="ml-auto text-on-surface-variant hover:text-error transition-colors text-[11px] tracking-widest uppercase"
            >
              Clear Selection
            </button>
          </div>
        )}

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
                  {/* Checkbox column */}
                  <th className="px-4 py-4 w-10">
                    <input
                      type="checkbox"
                      checked={filteredOrders.length > 0 && selectedIds.size === filteredOrders.length}
                      onChange={toggleSelectAll}
                      className="accent-primary cursor-pointer w-4 h-4"
                    />
                  </th>
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
                    <td colSpan={8} className="px-6 py-16 text-center text-on-surface-variant text-[13px]">
                      No orders found under this status.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className={`hover:bg-primary/5 transition-colors group ${
                        selectedIds.has(order.id) ? "bg-primary/5" : ""
                      }`}
                    >
                      <td className="px-4 py-5">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(order.id)}
                          onChange={() => toggleSelect(order.id)}
                          className="accent-primary cursor-pointer w-4 h-4"
                        />
                      </td>
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
                            {ALL_STATUSES.map((s) => (
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

      {/* ── Batch Modal ─────────────────────────────────────────── */}
      {batchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-surface-container-high border border-outline-variant w-full max-w-sm p-8 shadow-2xl"
          >
            <h3 className="text-[16px] font-light text-on-surface italic font-serif mb-1">
              Process Batch
            </h3>
            <p className="text-[12px] text-on-surface-variant mb-6">
              Apply a new status to{" "}
              <span className="text-primary font-semibold">{selectedIds.size}</span> selected order
              {selectedIds.size > 1 ? "s" : ""}.
            </p>

            <label className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant block mb-2">
              New Status
            </label>
            <div className="grid grid-cols-1 gap-2 mb-8">
              {ALL_STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setBatchStatus(s)}
                  className={`px-4 py-2.5 text-left text-[11px] font-bold tracking-widest uppercase border transition-all ${
                    batchStatus === s
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-outline-variant text-on-surface-variant hover:border-outline hover:text-on-surface"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setBatchModalOpen(false)}
                disabled={batchLoading}
                className="flex-1 py-2.5 border border-outline-variant text-[11px] font-bold tracking-widest uppercase text-on-surface-variant hover:bg-surface-container-highest transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessBatch}
                disabled={batchLoading}
                className="flex-1 py-2.5 bg-primary-container text-on-primary-fixed text-[11px] font-bold tracking-widest uppercase hover:opacity-90 transition-all disabled:opacity-50"
              >
                {batchLoading ? "Updating..." : "Apply"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

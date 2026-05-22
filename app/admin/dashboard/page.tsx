"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import TopNavBar from "@/components/layout/TopNavBar";
import { useAdmin } from "@/context/AdminContext";
import { motion } from "framer-motion";

const weeklyData = [
  { day: "Mon", value: 42000 },
  { day: "Tue", value: 38000 },
  { day: "Wed", value: 61000 },
  { day: "Thu", value: 55000 },
  { day: "Fri", value: 78000 },
  { day: "Sat", value: 92000 },
  { day: "Sun", value: 85000 },
];

const MAX_VAL = 100000;

function RevenueChart() {
  const [activeTab, setActiveTab] = useState<"Weekly" | "Monthly">("Weekly");
  const points = weeklyData.map((d, i) => {
    const x = (i / (weeklyData.length - 1)) * 600;
    const y = 200 - (d.value / MAX_VAL) * 200;
    return `${x},${y}`;
  });
  const pathD = `M${points.join(" L")}`;
  const fillD = `M${points.join(" L")} L600,200 L0,200 Z`;

  return (
    <div className="lg:col-span-2 bg-surface-container-low border border-outline-variant p-6 flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-base font-semibold text-on-surface tracking-wide">Revenue Growth</h3>
          <p className="text-[12px] text-on-surface-variant mt-0.5">Weekly performance insights</p>
        </div>
        <div className="flex gap-2">
          {(["Weekly", "Monthly"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-[11px] font-semibold tracking-widest uppercase border transition-all ${
                activeTab === tab
                  ? "border-primary text-primary bg-primary/5"
                  : "border-outline-variant text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 relative min-h-[220px] ml-8 mb-6">
        {/* Horizontal grid lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute left-0 right-0 border-t border-outline-variant/20"
            style={{ top: `${(i / 4) * 100}%` }}
          />
        ))}
        {/* Y-axis labels */}
        <div className="absolute -left-10 top-0 h-full flex flex-col justify-between text-[9px] text-outline uppercase tracking-tighter py-1">
          {["100k", "75k", "50k", "25k", "0k"].map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
        {/* SVG Chart */}
        <svg
          viewBox="0 0 600 200"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id="chartGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#f2c36b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f2c36b" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={fillD} fill="url(#chartGrad)" />
          <path d={pathD} fill="none" stroke="#f2c36b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {weeklyData.map((d, i) => {
            const x = (i / (weeklyData.length - 1)) * 600;
            const y = 200 - (d.value / MAX_VAL) * 200;
            return (
              <circle key={i} cx={x} cy={y} r="4" fill="#f2c36b" stroke="#16130d" strokeWidth="2" />
            );
          })}
        </svg>
        {/* X-axis labels */}
        <div className="absolute -bottom-6 left-0 w-full flex justify-between text-[9px] text-outline uppercase tracking-tighter">
          {weeklyData.map((d) => (
            <span key={d.day}>{d.day}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

const bestSellers = [
  {
    name: "Carrara Study Desk",
    category: "Architecture",
    price: "$4,200",
    sold: 12,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBN3rVZxzyUxWkBL3SjXAqqufvhNQtQ3o7u0nDTHQgnP0Gmu-_lQe3ElVFlz6gNy1V2hX0ymWhR6BErR7pfpGSK0ioRnvWfwmRHoCB-tGa6GJGiixv0kz_JoezFYEdr71nUo-FdJJF-NM4LTlifLYdmX9TonpfgXcF2slSGLEuODYxwPKY6yd2p2cWy61xDos1x2EBeqUHCtfssXNjwPyWAhReL88rmg3PIfGBmKLcTWCxwTNXOROkOeuG_Kyxe_rYqT3W5viOQHAoF",
  },
  {
    name: "Obsidian Floor Lamp",
    category: "Collections",
    price: "$1,850",
    sold: 8,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRaguI79B6twQvBh4mO_HMEk5bleekBL3Gx-OkBRVkKZBhMtVda1SD9mjHYupn-Xbef5jPnEbE5sh1CAZWMGlh3vVQOY5pVmQaZxQSxlQuhh-k26kDptUy_Xl5gVio1Vn340e8WRS08CCS4qqculhi1dXqCnlxct-e--47iQ_-jwUguMJv3ji3oB1rFFjjdAsy7L4dg7l6iC2Kk-m8YK9RV7srCk4g1iid9gpshF0lSFLrspuLhnJnWd7ZxSLzKxsTFdRFwWOxvWsd",
  },
  {
    name: "Emerald Lounge Seat",
    category: "Editorial",
    price: "$5,600",
    sold: 5,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCbfuQVFqNSfqIloztvoN72ZVRFYnh0Tl5U3T_AslvqPIA0hNqxfrSWJNCxZ9EFjb58-hE9wUYeG9OEScwe1Wa_GrXlkd5U-I0zQIrUhKtcdNVSszDkwJbuG9g3j4IlM9nsCpC7cf_znLDnXQ6-bqoWeQCO0xv4BXNXqrQkgOZN26AsXBISE2mIjI5hLChdESiFH0RNKRM6839iCKdxsbj9AiV0Pq774ACVBlWEIOxMmaPCm2Zuh5_1LKDIxkMHUK-10fscqT7UhlFD",
  },
];

const kpis = [
  {
    label: "Total Revenue",
    value: "$142,850",
    sub: "+12.5% vs last month",
    icon: "payments",
    trend: "up",
    highlight: false,
  },
  {
    label: "Orders Today",
    value: "24",
    sub: "4 new in last hour",
    icon: "shopping_cart",
    trend: "up",
    highlight: false,
  },
  {
    label: "Active Products",
    value: "1,104",
    sub: "98.2% curation rate",
    icon: "inventory_2",
    trend: "neutral",
    highlight: false,
  },
  {
    label: "Low Stock Alerts",
    value: "07",
    sub: "Immediate action required",
    icon: "warning",
    trend: "error",
    highlight: true,
  },
];

const recentOrders = [
  { id: "#AS-94021", client: "Elena Rodriguez", date: "Oct 24, 2024", total: "$12,450.00", status: "Processing", statusColor: "primary" },
  { id: "#AS-94020", client: "Marcus Thorne", date: "Oct 24, 2024", total: "$3,120.00", status: "Delivered", statusColor: "tertiary" },
  { id: "#AS-94019", client: "Sophia Von-Bern", date: "Oct 23, 2024", total: "$8,900.00", status: "Delivered", statusColor: "tertiary" },
  { id: "#AS-94018", client: "Julian Chen", date: "Oct 23, 2024", total: "$2,450.00", status: "Cancelled", statusColor: "error" },
];

const statusStyles: Record<string, string> = {
  primary: "bg-primary/10 text-primary border-primary/20",
  tertiary: "bg-tertiary/10 text-tertiary border-tertiary/20",
  error: "bg-error/10 text-error border-error/20",
};

export default function DashboardPage() {
  const { orders } = useAdmin();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopNavBar breadcrumbs={[{ label: "Console" }, { label: "Dashboard" }]} />

      <div className="p-10 space-y-8 overflow-y-auto flex-1">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-2"
        >
          <h2 className="text-[28px] font-light text-on-surface italic font-serif">Architectural Overview</h2>
          <p className="text-[14px] text-on-surface-variant mt-1 max-w-2xl">
            Visualizing performance metrics and studio operations through a restrained lens of precision and clarity.
          </p>
        </motion.header>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`bg-surface-container-low border p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg duration-200 cursor-default ${
                kpi.highlight
                  ? "border-error/30 hover:border-error/50"
                  : "border-outline-variant hover:border-primary/30"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span
                  className={`text-[10px] font-bold tracking-widest uppercase ${
                    kpi.highlight ? "text-error" : "text-on-surface-variant"
                  }`}
                >
                  {kpi.label}
                </span>
                <span
                  className={`material-symbols-outlined text-[20px] ${
                    kpi.highlight ? "text-error" : "text-primary"
                  }`}
                >
                  {kpi.icon}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[28px] font-light text-on-surface font-serif">{kpi.value}</span>
                <span
                  className={`text-[11px] font-semibold mt-1 flex items-center gap-1 ${
                    kpi.trend === "error"
                      ? "text-error"
                      : kpi.trend === "neutral"
                      ? "text-on-surface-variant"
                      : "text-primary"
                  }`}
                >
                  {kpi.trend === "up" && (
                    <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  )}
                  {kpi.sub}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chart + Best Sellers row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RevenueChart />

          {/* Best Sellers */}
          <div className="bg-surface-container-low border border-outline-variant p-6 flex flex-col">
            <h3 className="text-[14px] font-semibold text-on-surface tracking-wide mb-6">Best-selling Assets</h3>
            <div className="space-y-6 flex-1">
              {bestSellers.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                  className="flex items-center gap-4 group cursor-pointer"
                >
                  <div className="w-12 h-12 bg-surface-container-high border border-outline-variant overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] text-on-surface truncate">{item.name}</h4>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
                      {item.category}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-[13px] text-primary font-semibold">{item.price}</span>
                    <p className="text-[10px] text-on-surface-variant">{item.sold} sold</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <Link
              href="/admin/collections"
              className="mt-8 w-full py-2 border border-outline-variant text-[11px] font-semibold tracking-widest uppercase text-on-surface-variant hover:text-on-surface hover:border-outline transition-all text-center block"
            >
              View All Products
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-surface-container-low border border-outline-variant overflow-hidden">
          <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
            <h3 className="text-[16px] font-light text-on-surface italic font-serif">Recent Acquisitions</h3>
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors text-[20px]">
                filter_list
              </span>
              <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors text-[20px]">
                download
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container">
                  {["Order ID", "Client", "Date", "Total", "Status"].map((h) => (
                    <th
                      key={h}
                      className="px-8 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-container-high transition-colors">
                    <td className="px-8 py-4 text-[13px] text-primary font-semibold">{order.id}</td>
                    <td className="px-8 py-4 text-[13px] text-on-surface">{order.client}</td>
                    <td className="px-8 py-4 text-[13px] text-on-surface-variant">{order.date}</td>
                    <td className="px-8 py-4 text-[13px] text-on-surface font-medium">{order.total}</td>
                    <td className="px-8 py-4">
                      <span
                        className={`px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full border ${
                          statusStyles[order.statusColor]
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex justify-between items-center py-4 px-8 bg-surface border-t border-outline-variant mt-auto">
        <div className="text-[11px] text-on-surface-variant">
          © 2024 Aesthete Studio. All rights reserved.
        </div>
        <div className="flex gap-6 text-[11px] text-on-surface-variant">
          {["System Status", "Privacy Policy", "Documentation"].map((link) => (
            <a key={link} href="#" className="hover:text-on-surface transition-colors">
              {link}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}

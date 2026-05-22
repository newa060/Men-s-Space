"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, ShoppingBag, MapPin, CreditCard, ChevronRight, Edit2 } from "lucide-react";

export default function UserProfile() {
  const router = useRouter();
  const user = {
    name: "Julian Vane",
    email: "julian.vane@brutalist.com",
    phone: "+44 7700 900077",
    joined: "Member since October 2024",
  };

  const recentOrders = [
    {
      id: "ord-88392",
      date: "May 12, 2026",
      status: "Delivered",
      total: 1290,
      item: "Architectural Overcoat",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCcfKCQRNHLPYl7dMXPZtKcusxelsZrj-mrWmjZR1DmAe-g0aoYTRenVDu8DKtzqftVhoVWriovwbzBDXFCTsvM0f8HLvtB3O03lN5F1mpSSAfxLUtwnCzAoIiO3KLeXCr3zpH7NFNJG0NSvFlTAZgUXNes1dacFH-tfEGs_JDESeqpcztZN5XuirpsynZ6K_vqk0hYd0mpnHzqSYbD-L2wsis3Uu8-ruFC6QWt9CXuuGnBaHAeux4V1YwUtNXn5Zqo5KKMkpm_e8k",
    },
    {
      id: "ord-87112",
      date: "April 04, 2026",
      status: "Delivered",
      total: 390,
      item: "Structural Poplin Shirt",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGSmMOfcvIAwNxaNcO-y6uyVRZLptLlQl5PXdN7KEYnLCfgclkZ6O-Yp4zvkWx0lbdneArQFFqbAEkm3Pn4dE8pJUAgLNF-HXjP1WlMApyvv9dEKIf7CfMfLEYevTdnnHYxCk3paEx9b3el07bSJaTzAuvwHUV_Ohg3eEqPqxK0yFsTH3wBeudmIsHhRqsgeJLZTkHJDgVOfVcNk1myT3IH3TSb-jgAKmdURbiypoUwPoMgvK2shkHJkEK2Pi8-wDE6cDi-Jcnz6dz",
    },
  ];

  return (
    <div className="py-12 px-5 md:px-16 max-w-screen-xl mx-auto w-full">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <div className="border-b border-outline-variant/60 pb-6 mb-10">
        <p className="label-caps text-secondary mb-2">My Account</p>
        <h1 className="text-3xl md:text-4xl font-light uppercase tracking-tight text-primary">
          Account Overview
        </h1>
        <p className="text-xs text-secondary mt-1">{user.joined}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Side: Personal Info & Nav */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-low border border-outline-variant/40 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-label-caps text-primary tracking-widest flex items-center gap-2">
                <User size={16} /> 01 Personal Info
              </h3>
              <button className="text-secondary hover:text-primary transition-colors">
                <Edit2 size={14} />
              </button>
            </div>
            <div className="space-y-2 text-sm text-secondary">
              <p className="text-primary font-medium">{user.name}</p>
              <p>{user.email}</p>
              <p>{user.phone}</p>
            </div>
          </div>

          {/* Quick Links Menu */}
          <div className="bg-surface border border-outline-variant/30 divide-y divide-outline-variant/40">
            <Link
              href="/order-history"
              className="flex justify-between items-center px-6 py-4 hover:bg-surface-container transition-colors text-sm"
            >
              <span className="flex items-center gap-3"><ShoppingBag size={16} /> Order History</span>
              <ChevronRight size={14} className="text-secondary" />
            </Link>
            <Link
              href="/shipping-addresses"
              className="flex justify-between items-center px-6 py-4 hover:bg-surface-container transition-colors text-sm"
            >
              <span className="flex items-center gap-3"><MapPin size={16} /> Shipping Addresses</span>
              <ChevronRight size={14} className="text-secondary" />
            </Link>
            <button
              onClick={() => alert("Simulation: Payment methods editing.")}
              className="w-full flex justify-between items-center px-6 py-4 hover:bg-surface-container transition-colors text-sm text-left"
            >
              <span className="flex items-center gap-3"><CreditCard size={16} /> Payment Methods</span>
              <ChevronRight size={14} className="text-secondary" />
            </button>
            <button
              onClick={async () => {
                const supabase = createClient();
                await supabase.auth.signOut();
                router.push('/sign-in');
              }}
              className="w-full flex justify-between items-center px-6 py-4 hover:bg-surface-container transition-colors text-sm text-left text-primary"
            >
              <span className="flex items-center gap-3"><User size={16} /> Log Out</span>
              <ChevronRight size={14} className="text-secondary" />
            </button>
          </div>
        </div>

        {/* Right Side: Recent Orders & Quick Views */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-surface-container-low border border-outline-variant/40 p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-label-caps text-primary tracking-widest">
                02 Recent Orders
              </h3>
              <Link href="/order-history" className="text-xs text-secondary hover:text-primary transition-colors underline">
                View All (12)
              </Link>
            </div>

            <div className="space-y-6">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex gap-4 border-b border-outline-variant/20 pb-6 last:border-0 last:pb-0">
                  <div className="relative w-16 h-20 bg-surface-container border border-outline-variant/20 flex-shrink-0">
                    <Image
                      src={order.image}
                      alt={order.item}
                      fill
                      className="object-cover grayscale"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-grow flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-primary uppercase">{order.item}</p>
                      <p className="text-xs text-secondary mt-1">
                        Order ID: <span className="text-primary">{order.id}</span> &middot; Date: {order.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block text-[10px] label-caps border border-outline-variant px-2.5 py-1 text-secondary uppercase bg-background">
                        {order.status}
                      </span>
                      <p className="text-sm font-semibold text-primary mt-1.5">${order.total}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

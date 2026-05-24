"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/context/CartContext";
import {
  User,
  ShoppingBag,
  MapPin,
  CreditCard,
  ChevronRight,
  Edit2,
  Loader2,
  LogOut,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RecentOrder {
  id: string;
  name: string;
  date: string;
  status: string;
  price: number;
  image: string;
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  COMPLETED: "Delivered",
  CANCELLED: "Cancelled",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UserProfile() {
  const router = useRouter();
  const { user, isUserLoading, refreshSession } = useCart();

  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // Redirect to sign-in if not logged in
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/sign-in?redirect=/profile");
    }
  }, [user, isUserLoading, router]);

  // Fetch recent orders
  useEffect(() => {
    if (!user) return;
    fetch("/api/customer/orders")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data) {
          const all: RecentOrder[] = json.data.map((o: any) => ({
            id: o.id,
            name: o.name,
            date: o.date,
            status: o.status,
            price: o.price,
            image: o.image,
          }));
          setTotalOrders(all.length);
          setOrders(all.slice(0, 2)); // show 2 most recent
        }
      })
      .catch(console.error)
      .finally(() => setOrdersLoading(false));
  }, [user]);

  const handleLogOut = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    await refreshSession();
    router.push("/sign-in");
  };

  // ── Format join date from user id (Supabase UUIDs don't carry dates,
  //    so we use the session metadata if available, otherwise omit)
  const joinedLabel = user ? "Member" : "";

  // ── Loading skeleton ──────────────────────────────────────────────────────

  if (isUserLoading) {
    return (
      <div className="py-12 px-5 md:px-16 max-w-screen-xl mx-auto w-full min-h-[60vh] flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-secondary" />
      </div>
    );
  }

  if (!user) return null; // redirect in progress

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="py-12 px-5 md:px-16 max-w-screen-xl mx-auto w-full">
      {/* Header */}
      <div className="border-b border-outline-variant/60 pb-6 mb-10">
        <p className="text-xs text-secondary uppercase tracking-widest mb-2">My Account</p>
        <h1 className="text-3xl md:text-4xl font-light uppercase tracking-tight text-primary">
          Account Overview
        </h1>
        <p className="text-xs text-secondary mt-1">{joinedLabel}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* ── Left: Personal Info & Nav ── */}
        <div className="lg:col-span-4 space-y-6">
          {/* Personal info card */}
          <div className="bg-surface-container-low border border-outline-variant/40 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-primary tracking-widest uppercase flex items-center gap-2">
                <User size={16} /> 01 Personal Info
              </h3>
              <Link
                href="/profile/edit"
                className="text-secondary hover:text-primary transition-colors"
                aria-label="Edit profile"
              >
                <Edit2 size={14} />
              </Link>
            </div>
            <div className="space-y-1.5 text-sm text-secondary">
              <p className="text-primary font-medium">{user.fullName}</p>
              <p>{user.email}</p>
              {user.phone && <p>{user.phone}</p>}
            </div>
          </div>

          {/* Quick links */}
          <div className="bg-surface border border-outline-variant/30 divide-y divide-outline-variant/40">
            <Link
              href="/order-history"
              className="flex justify-between items-center px-6 py-4 hover:bg-surface-container transition-colors text-sm"
            >
              <span className="flex items-center gap-3">
                <ShoppingBag size={16} /> Order History
              </span>
              <ChevronRight size={14} className="text-secondary" />
            </Link>
            <Link
              href="/shipping-addresses"
              className="flex justify-between items-center px-6 py-4 hover:bg-surface-container transition-colors text-sm"
            >
              <span className="flex items-center gap-3">
                <MapPin size={16} /> Shipping Addresses
              </span>
              <ChevronRight size={14} className="text-secondary" />
            </Link>
            <button
              disabled
              className="w-full flex justify-between items-center px-6 py-4 hover:bg-surface-container transition-colors text-sm text-left opacity-50 cursor-not-allowed"
            >
              <span className="flex items-center gap-3">
                <CreditCard size={16} /> Payment Methods
              </span>
              <ChevronRight size={14} className="text-secondary" />
            </button>
            <button
              onClick={handleLogOut}
              disabled={loggingOut}
              className="w-full flex justify-between items-center px-6 py-4 hover:bg-surface-container transition-colors text-sm text-left text-primary disabled:opacity-50"
            >
              <span className="flex items-center gap-3">
                {loggingOut ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <LogOut size={16} />
                )}
                {loggingOut ? "Signing out…" : "Log Out"}
              </span>
              {!loggingOut && <ChevronRight size={14} className="text-secondary" />}
            </button>
          </div>
        </div>

        {/* ── Right: Recent Orders ── */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-surface-container-low border border-outline-variant/40 p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-primary tracking-widest uppercase">
                02 Recent Orders
              </h3>
              {totalOrders > 0 && (
                <Link
                  href="/order-history"
                  className="text-xs text-secondary hover:text-primary transition-colors underline underline-offset-2"
                >
                  View All ({totalOrders})
                </Link>
              )}
            </div>

            {ordersLoading ? (
              // Skeleton
              <div className="space-y-6">
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className="flex gap-4 pb-6 border-b border-outline-variant/20 last:border-0 last:pb-0 animate-pulse"
                  >
                    <div className="w-16 h-20 bg-surface-container flex-shrink-0" />
                    <div className="flex-grow flex justify-between items-center">
                      <div className="space-y-2">
                        <div className="h-3 w-40 bg-surface-container rounded" />
                        <div className="h-2.5 w-56 bg-surface-container rounded" />
                      </div>
                      <div className="space-y-2 text-right">
                        <div className="h-5 w-16 bg-surface-container rounded" />
                        <div className="h-3 w-12 bg-surface-container rounded ml-auto" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                <ShoppingBag size={32} strokeWidth={1} className="text-outline" />
                <p className="text-sm text-secondary">No orders yet.</p>
                <Link
                  href="/collection"
                  className="text-xs font-bold tracking-widest uppercase border-b border-primary text-primary pb-0.5 hover:opacity-70 transition-opacity"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex gap-4 border-b border-outline-variant/20 pb-6 last:border-0 last:pb-0"
                  >
                    <div className="relative w-16 h-20 bg-surface-container border border-outline-variant/20 flex-shrink-0 overflow-hidden">
                      <Image
                        src={order.image}
                        alt={order.name}
                        fill
                        className="object-cover grayscale"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-grow flex justify-between items-center gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-primary uppercase truncate">
                          {order.name}
                        </p>
                        <p className="text-xs text-secondary mt-1">
                          Order ID:{" "}
                          <span className="text-primary">{order.id}</span>{" "}
                          &middot; Date: {order.date}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="inline-block text-[10px] font-bold tracking-widest border border-outline-variant px-2.5 py-1 text-secondary uppercase bg-background">
                          {STATUS_LABEL[order.status] ?? order.status}
                        </span>
                        <p className="text-sm font-semibold text-primary mt-1.5">
                          ${order.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

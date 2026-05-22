"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  image: string;
  slug: string;
}

export interface Address {
  id: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  country: string;
  postcode: string;
  isDefault: boolean;
}

export interface UserSession {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  avatarUrl: string;
  role: string;
}

interface CartContextValue {
  items: CartItem[];
  addresses: Address[];
  user: UserSession | null;
  isUserLoading: boolean;
  isCartOpen: boolean;
  isSearchOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, qty: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  addAddress: (addr: Omit<Address, "id">) => Promise<void>;
  updateAddress: (id: string, addr: Omit<Address, "id">) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
  placeOrder: (customerName: string, customerEmail: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  itemCount: number;
  subtotal: number;
  refreshSession: () => Promise<void>;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([
    {
      id: "architectural-overcoat",
      name: "ARCHITECTURAL OVERCOAT",
      price: 1290,
      size: "M",
      color: "Charcoal",
      quantity: 1,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCCcfKCQRNHLPYl7dMXPZtKcusxelsZrj-mrWmjZR1DmAe-g0aoYTRenVDu8DKtzqftVhoVWriovwbzBDXFCTsvM0f8HLvtB3O03lN5F1mpSSAfxLUtwnCzAoIiO3KLeXCr3zpH7NFNJG0NSvFlTAZgUXNes1dacFH-tfEGs_JDESeqpcztZN5XuirpsynZ6K_vqk0hYd0mpnHzqSYbD-L2wsis3Uu8-ruFC6QWt9CXuuGnBaHAeux4V1YwUtNXn5Zqo5KKMkpm_e8k",
      slug: "architectural-overcoat",
    },
    {
      id: "structural-poplin-shirt",
      name: "STRUCTURAL POPLIN SHIRT",
      price: 390,
      size: "M",
      color: "Black",
      quantity: 1,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBGSmMOfcvIAwNxaNcO-y6uyVRZLptLlQl5PXdN7KEYnLCfgclkZ6O-Yp4zvkWx0lbdneArQFFqbAEkm3Pn4dE8pJUAgLNF-HXjP1WlMApyvv9dEKIf7CfMfLEYevTdnnHYxCk3paEx9b3el07bSJaTzAuvwHUV_Ohg3eEqPqxK0yFsTH3wBeudmIsHhRqsgeJLZTkHJDgVOfVcNk1myT3IH3TSb-jgAKmdURbiypoUwPoMgvK2shkHJkEK2Pi8-wDE6cDi-Jcnz6dz",
      slug: "structural-poplin-shirt",
    },
  ]);

  const mockAddresses: Address[] = [
    {
      id: "addr-1",
      name: "Julian Vane",
      line1: "14 Brutalist Way, Apt 3C",
      city: "London",
      country: "United Kingdom",
      postcode: "EC1A 1BB",
      isDefault: true,
    },
    {
      id: "addr-2",
      name: "Julian Vane",
      line1: "2-12 Kinshi Street",
      city: "Tokyo",
      country: "Japan",
      postcode: "130-0013",
      isDefault: false,
    },
  ];

  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [user, setUser] = useState<UserSession | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // ─── Auth Session & Sync Addresses ──────────────────────────────────────────

  const refreshSession = useCallback(async () => {
    try {
      setIsUserLoading(true);
      const res = await fetch("/api/auth/session");
      const json = await res.json();
      if (json.success && json.data?.user) {
        setUser(json.data.user);
        // Load addresses from API
        const addrRes = await fetch("/api/customer/addresses");
        const addrJson = await addrRes.json();
        if (addrJson.success && addrJson.data) {
          setAddresses(addrJson.data);
        }
      } else {
        setUser(null);
        setAddresses(mockAddresses);
      }
    } catch (e) {
      console.error("Error fetching session/addresses:", e);
    } finally {
      setIsUserLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  // ─── Cart Actions ───────────────────────────────────────────────────────────

  const addItem = useCallback((newItem: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.id === newItem.id && i.size === newItem.size
      );
      if (existing) {
        return prev.map((i) =>
          i.id === newItem.id && i.size === newItem.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string, size: string) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
  }, []);

  const updateQuantity = useCallback(
    (id: string, size: string, qty: number) => {
      if (qty <= 0) {
        removeItem(id, size);
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          i.id === id && i.size === size ? { ...i, quantity: qty } : i
        )
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => setItems([]), []);

  // ─── Drawer Actions ─────────────────────────────────────────────────────────

  const openCart = useCallback(() => {
    setIsCartOpen(true);
    setIsSearchOpen(false);
  }, []);

  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const openSearch = useCallback(() => {
    setIsSearchOpen(true);
    setIsCartOpen(false);
  }, []);

  const closeSearch = useCallback(() => setIsSearchOpen(false), []);

  // ─── Address Actions ────────────────────────────────────────────────────────

  const addAddress = useCallback(async (addr: Omit<Address, "id">) => {
    if (user) {
      try {
        const res = await fetch("/api/customer/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addr),
        });
        const json = await res.json();
        if (json.success && json.data) {
          const addrRes = await fetch("/api/customer/addresses");
          const addrJson = await addrRes.json();
          if (addrJson.success) setAddresses(addrJson.data);
        } else {
          alert(json.error || "Failed to add address");
        }
      } catch (e: any) {
        alert(e.message);
      }
    } else {
      const id = `addr-${Date.now()}`;
      setAddresses((prev) => {
        if (addr.isDefault) {
          return [
            ...prev.map((a) => ({ ...a, isDefault: false })),
            { ...addr, id },
          ];
        }
        return [...prev, { ...addr, id }];
      });
    }
  }, [user]);

  const updateAddress = useCallback(async (id: string, addr: Omit<Address, "id">) => {
    if (user && !id.startsWith("addr-")) {
      try {
        const res = await fetch(`/api/customer/addresses/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addr),
        });
        const json = await res.json();
        if (json.success) {
          const addrRes = await fetch("/api/customer/addresses");
          const addrJson = await addrRes.json();
          if (addrJson.success) setAddresses(addrJson.data);
        } else {
          alert(json.error || "Failed to update address");
        }
      } catch (e: any) {
        alert(e.message);
      }
    } else {
      setAddresses((prev) => {
        let next = prev.map((a) => (a.id === id ? { ...addr, id } : a));
        if (addr.isDefault) {
          next = next.map((a) => ({ ...a, isDefault: a.id === id }));
        }
        return next;
      });
    }
  }, [user]);

  const removeAddress = useCallback(async (id: string) => {
    if (user && !id.startsWith("addr-")) {
      try {
        const res = await fetch(`/api/customer/addresses/${id}`, {
          method: "DELETE",
        });
        const json = await res.json();
        if (json.success) {
          setAddresses((prev) => prev.filter((a) => a.id !== id));
        } else {
          alert(json.error || "Failed to delete address");
        }
      } catch (e: any) {
        alert(e.message);
      }
    } else {
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    }
  }, [user]);

  const setDefaultAddress = useCallback(async (id: string) => {
    if (user && !id.startsWith("addr-")) {
      try {
        const addrToUpdate = addresses.find((a) => a.id === id);
        if (!addrToUpdate) return;
        const res = await fetch(`/api/customer/addresses/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...addrToUpdate, isDefault: true }),
        });
        const json = await res.json();
        if (json.success) {
          const addrRes = await fetch("/api/customer/addresses");
          const addrJson = await addrRes.json();
          if (addrJson.success) setAddresses(addrJson.data);
        } else {
          alert(json.error || "Failed to set default address");
        }
      } catch (e: any) {
        alert(e.message);
      }
    } else {
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a.id === id }))
      );
    }
  }, [user, addresses]);

  // ─── Order Checkout Actions ─────────────────────────────────────────────────

  const placeOrder = useCallback(async (customerName: string, customerEmail: string) => {
    if (!user) {
      return { success: false, error: "Please sign in to place an order." };
    }

    try {
      const orderItems = items.map((i) => ({
        productId: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        size: i.size,
        color: i.color || "Neutral",
        image: i.image,
      }));

      const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];

      const payload = {
        customerName,
        customerEmail,
        items: orderItems,
        shippingAddressId: defaultAddress?.id,
        paymentMethod: "Visa Premium (•••• 4321)",
      };

      const res = await fetch("/api/customer/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        clearCart();
        return { success: true, data: json.data };
      } else {
        return { success: false, error: json.error || "Failed to place order." };
      }
    } catch (e: any) {
      return { success: false, error: e.message || "An unexpected error occurred." };
    }
  }, [user, items, addresses, clearCart]);

  // ─── Derived Values ─────────────────────────────────────────────────────────

  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addresses,
        user,
        isUserLoading,
        isCartOpen,
        isSearchOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        openSearch,
        closeSearch,
        addAddress,
        updateAddress,
        removeAddress,
        setDefaultAddress,
        placeOrder,
        itemCount,
        subtotal,
        refreshSession,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

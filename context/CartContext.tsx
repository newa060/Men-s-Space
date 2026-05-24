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

// ─── Helpers ─────────────────────────────────────────────────────────────────

const GUEST_KEY = "mens-space-cart-guest";

function loadGuestCart(): CartItem[] {
  try {
    const saved = localStorage.getItem(GUEST_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
}

function saveGuestCart(items: CartItem[]) {
  try { localStorage.setItem(GUEST_KEY, JSON.stringify(items)); } catch {}
}

function clearGuestCart() {
  try { localStorage.removeItem(GUEST_KEY); } catch {}
}

// ─── Context ─────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // ── Guest cart: load on mount, save on every change ──────────────────────

  useEffect(() => {
    // Only load guest cart before session is resolved
    if (!isLoggedIn) {
      setItems(loadGuestCart());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isLoggedIn) {
      saveGuestCart(items);
    }
  }, [items, isLoggedIn]);

  // ── DB cart helpers ───────────────────────────────────────────────────────

  const loadDbCart = useCallback(async (): Promise<CartItem[]> => {
    try {
      const res = await fetch("/api/customer/cart");
      const json = await res.json();
      return json.success ? json.data : [];
    } catch { return []; }
  }, []);

  // ── Session + cart bootstrap ──────────────────────────────────────────────

  const refreshSession = useCallback(async () => {
    try {
      setIsUserLoading(true);
      const res = await fetch("/api/auth/session");
      const json = await res.json();

      if (json.success && json.data?.user) {
        const sessionUser: UserSession = json.data.user;
        setUser(sessionUser);
        setIsLoggedIn(true);

        // Load DB cart
        const dbCart = await loadDbCart();

        // Merge guest cart into DB cart (add any guest items not already there)
        const guestItems = loadGuestCart();
        if (guestItems.length > 0) {
          for (const guestItem of guestItems) {
            const alreadyInDb = dbCart.find(
              (d) => d.id === guestItem.id && d.size === guestItem.size
            );
            if (!alreadyInDb) {
              await fetch("/api/customer/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(guestItem),
              });
            }
          }
          clearGuestCart();
          // Reload after merge
          const merged = await loadDbCart();
          setItems(merged);
        } else {
          setItems(dbCart);
        }

        // Load addresses
        const addrRes = await fetch("/api/customer/addresses");
        const addrJson = await addrRes.json();
        if (addrJson.success && addrJson.data) setAddresses(addrJson.data);

      } else {
        setUser(null);
        setIsLoggedIn(false);
        setItems(loadGuestCart());
        setAddresses([]);
      }
    } catch (e) {
      console.error("Session error:", e);
    } finally {
      setIsUserLoading(false);
    }
  }, [loadDbCart]);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  // ─── Cart Actions ─────────────────────────────────────────────────────────

  const addItem = useCallback((newItem: Omit<CartItem, "quantity">) => {
    // Optimistic update
    setItems((prev) => {
      const existing = prev.find((i) => i.id === newItem.id && i.size === newItem.size);
      if (existing) {
        return prev.map((i) =>
          i.id === newItem.id && i.size === newItem.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });

    // Persist to DB if logged in
    if (isLoggedIn) {
      fetch("/api/customer/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      }).catch(console.error);
    }
  }, [isLoggedIn]);

  const removeItem = useCallback((id: string, size: string) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.size === size)));

    if (isLoggedIn) {
      fetch(`/api/customer/cart?productId=${encodeURIComponent(id)}&size=${encodeURIComponent(size)}`, {
        method: "DELETE",
      }).catch(console.error);
    }
  }, [isLoggedIn]);

  const updateQuantity = useCallback((id: string, size: string, qty: number) => {
    if (qty <= 0) {
      removeItem(id, size);
      return;
    }
    setItems((prev) =>
      prev.map((i) => i.id === id && i.size === size ? { ...i, quantity: qty } : i)
    );

    if (isLoggedIn) {
      fetch("/api/customer/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, size, quantity: qty }),
      }).catch(console.error);
    }
  }, [isLoggedIn, removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    if (isLoggedIn) {
      fetch("/api/customer/cart?clearAll=true", { method: "DELETE" }).catch(console.error);
    } else {
      clearGuestCart();
    }
  }, [isLoggedIn]);

  // ─── Drawer Actions ───────────────────────────────────────────────────────

  const openCart = useCallback(() => { setIsCartOpen(true); setIsSearchOpen(false); }, []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const openSearch = useCallback(() => { setIsSearchOpen(true); setIsCartOpen(false); }, []);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);

  // ─── Address Actions ──────────────────────────────────────────────────────

  const addAddress = useCallback(async (addr: Omit<Address, "id">) => {
    if (user) {
      try {
        const res = await fetch("/api/customer/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addr),
        });
        const json = await res.json();
        if (json.success) {
          const addrRes = await fetch("/api/customer/addresses");
          const addrJson = await addrRes.json();
          if (addrJson.success) setAddresses(addrJson.data);
        } else { alert(json.error || "Failed to add address"); }
      } catch (e: any) { alert(e.message); }
    } else {
      setAddresses((prev) => {
        const id = `addr-${Date.now()}`;
        if (addr.isDefault) return [...prev.map((a) => ({ ...a, isDefault: false })), { ...addr, id }];
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
        } else { alert(json.error || "Failed to update address"); }
      } catch (e: any) { alert(e.message); }
    } else {
      setAddresses((prev) => {
        let next = prev.map((a) => (a.id === id ? { ...addr, id } : a));
        if (addr.isDefault) next = next.map((a) => ({ ...a, isDefault: a.id === id }));
        return next;
      });
    }
  }, [user]);

  const removeAddress = useCallback(async (id: string) => {
    if (user && !id.startsWith("addr-")) {
      try {
        const res = await fetch(`/api/customer/addresses/${id}`, { method: "DELETE" });
        const json = await res.json();
        if (json.success) setAddresses((prev) => prev.filter((a) => a.id !== id));
        else alert(json.error || "Failed to delete address");
      } catch (e: any) { alert(e.message); }
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
        } else { alert(json.error || "Failed to set default address"); }
      } catch (e: any) { alert(e.message); }
    } else {
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    }
  }, [user, addresses]);

  // ─── Order ────────────────────────────────────────────────────────────────

  const placeOrder = useCallback(async (customerName: string, customerEmail: string) => {
    if (!user) return { success: false, error: "Please sign in to place an order." };

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

      const res = await fetch("/api/customer/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          items: orderItems,
          shippingAddressId: defaultAddress?.id,
          paymentMethod: "Visa Premium (•••• 4321)",
        }),
      });

      const json = await res.json();
      if (json.success) {
        clearCart();
        return { success: true, data: json.data };
      }
      return { success: false, error: json.error || "Failed to place order." };
    } catch (e: any) {
      return { success: false, error: e.message || "An unexpected error occurred." };
    }
  }, [user, items, addresses, clearCart]);

  // ─── Derived ──────────────────────────────────────────────────────────────

  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addresses, user, isUserLoading,
      isCartOpen, isSearchOpen,
      addItem, removeItem, updateQuantity, clearCart,
      openCart, closeCart, openSearch, closeSearch,
      addAddress, updateAddress, removeAddress, setDefaultAddress,
      placeOrder, itemCount, subtotal, refreshSession,
    }}>
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

"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

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

interface CartContextValue {
  items: CartItem[];
  addresses: Address[];
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
  addAddress: (addr: Omit<Address, "id">) => void;
  updateAddress: (id: string, addr: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  itemCount: number;
  subtotal: number;
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

  const [addresses, setAddresses] = useState<Address[]>([
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
  ]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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

  const addAddress = useCallback((addr: Omit<Address, "id">) => {
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
  }, []);

  const removeAddress = useCallback((id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const updateAddress = useCallback((id: string, updated: Omit<Address, "id">) => {
    setAddresses((prev) => {
      let next = prev.map((a) => (a.id === id ? { ...updated, id } : a));
      if (updated.isDefault) {
        next = next.map((a) => ({ ...a, isDefault: a.id === id }));
      }
      return next;
    });
  }, []);

  const setDefaultAddress = useCallback((id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  }, []);

  // ─── Derived Values ─────────────────────────────────────────────────────────

  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addresses,
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
        itemCount,
        subtotal,
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

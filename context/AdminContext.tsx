"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  status: "Active" | "Draft" | "Archived";
  image: string;
  description: string;
  sizes: string[];
  images?: string[];
  colors?: { name: string; hex: string }[];
  materials?: string;
  waterproof?: string;
  breathability?: string;
  hardware?: string;
  seams?: string;
  isNewArrival?: boolean;
  series?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerImage: string;
  date: string;
  itemsCount: number;
  totalPrice: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED";
  items: string;
}

export interface CmsData {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroCtaText: string;
  featuredCategory: string;
}

export interface FeedbackItem {
  id: string;
  text: string;
  author: string;
  location: string;
  approved: boolean;
}

interface AdminContextProps {
  products: Product[];
  orders: Order[];
  cmsData: CmsData;
  feedbackItems: FeedbackItem[];
  addProduct: (product: Omit<Product, "id" | "sku">) => Promise<{ success: boolean; error?: string }>;
  updateProduct: (id: string, updatedProduct: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateCmsData: (data: Partial<CmsData>) => void;
  toggleFeedbackApproval: (id: string) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
}

const AdminContext = createContext<AdminContextProps | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cmsData, setCmsData] = useState<CmsData>({
    heroTitle: "Architectural Forms",
    heroSubtitle: "A dialogue between human structure and sartorial precision. Collection 04 is now available.",
    heroImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBga5lcdNTZo5qWObfMmw_RL3ZwUJtQp_vG9UficR9a_WYSqzsoM3FkgcXjOx82IytbLGbcK72QerzF5Ince2lrPNcUUzGEMXs9SSriYR26pfPLsI9dzJjz3DOrvGmj28_gJ23g7xOcCrMqTbfU8SlatF2I1fmA134UU9on7OKs_SdNhYINdOOO3g5JMlqk5Pxpik_5FRN77rU_4Hr_KhJnyX3F96SSsLQtEwSh5zGTrTqAY7N9w3TwaBn0ZsZ-nNmGmd2Adj_J5THD",
    heroCtaText: "Shop Collection",
    featuredCategory: "Architecture",
  });
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);

  // Load data from server on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, orderRes, cmsRes, feedbackRes] = await Promise.allSettled([
          fetch('/api/admin/products').then(r => r.json()),
          fetch('/api/admin/orders').then(r => r.json()),
          fetch('/api/admin/cms').then(r => r.json()),
          fetch('/api/admin/feedback').then(r => r.json()),
        ]);

        if (prodRes.status === 'fulfilled' && prodRes.value.success) setProducts(prodRes.value.data);
        else console.error('[ADMIN CTX] products failed:', prodRes);

        if (orderRes.status === 'fulfilled' && orderRes.value.success) setOrders(orderRes.value.data);
        else console.error('[ADMIN CTX] orders failed:', orderRes);

        if (cmsRes.status === 'fulfilled' && cmsRes.value.success) setCmsData(cmsRes.value.data);
        else console.error('[ADMIN CTX] cms failed:', cmsRes);

        if (feedbackRes.status === 'fulfilled' && feedbackRes.value.success) setFeedbackItems(feedbackRes.value.data);
        else console.error('[ADMIN CTX] feedback failed:', feedbackRes);

      } catch (err) {
        console.error('Failed to load admin data', err);
      }
    };
    fetchData();
  }, []);

  const addProduct = async (newProd: Omit<Product, "id" | "sku">) => {
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd),
      });
      const json = await response.json();
      if (json.success) {
        setProducts((prev) => [json.data, ...prev]);
        return { success: true };
      } else {
        console.error('Failed to add product', json.error);
        return { success: false, error: json.error };
      }
    } catch (err: any) {
      console.error('Add product error', err);
      return { success: false, error: err.message };
    }
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });
      const json = await response.json();
      if (json.success) {
        setProducts((prev) => prev.map((p) => (p.id === id ? json.data : p)));
      } else {
        console.error('Failed to update product', json.error);
      }
    } catch (err) {
      console.error('Update product error', err);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });
      const json = await response.json();
      if (json.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        console.error('Failed to delete product', json.error);
      }
    } catch (err) {
      console.error('Delete product error', err);
    }
  };

  const updateCmsData = async (updatedFields: Partial<CmsData>) => {
    try {
      const response = await fetch('/api/admin/cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });
      const json = await response.json();
      if (json.success) setCmsData(json.data);
      else console.error('Failed to update CMS', json.error);
    } catch (err) {
      console.error('Update CMS error', err);
    }
  };

  const toggleFeedbackApproval = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/feedback/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toggleApproval: true }),
      });
      const json = await response.json();
      if (json.success) {
        setFeedbackItems((prev) =>
          prev.map((item) => (item.id === id ? json.data : item))
        );
      } else {
        console.error('Failed to toggle feedback', json.error);
      }
    } catch (err) {
      console.error('Toggle feedback error', err);
    }
  };

  const updateOrderStatus = async (id: string, status: Order["status"]) => {
    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const json = await response.json();
      if (json.success) {
        setOrders((prev) => prev.map((o) => (o.id === id ? json.data : o)));
      } else {
        console.error('Failed to update order status', json.error);
      }
    } catch (err) {
      console.error('Update order status error', err);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        orders,
        cmsData,
        feedbackItems,
        addProduct,
        updateProduct,
        deleteProduct,
        updateCmsData,
        toggleFeedbackApproval,
        updateOrderStatus,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

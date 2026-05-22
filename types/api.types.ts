import { Product, Order, CmsData, FeedbackItem } from "@/context/AdminContext";
import { Address } from "@/context/CartContext";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SessionResponse {
  user: {
    id: string;
    email: string;
    full_name?: string;
    role: "customer" | "admin";
  } | null;
}

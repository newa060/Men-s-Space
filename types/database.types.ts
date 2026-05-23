export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: "customer" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: "customer" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: "customer" | "admin";
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
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
          images: string[] | null;
          colors: Json | null;
          materials: string | null;
          waterproof: string | null;
          breathability: string | null;
          hardware: string | null;
          seams: string | null;
          is_new_arrival: boolean;
          series: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          sku: string;
          price: number;
          stock?: number;
          category: string;
          status?: "Active" | "Draft" | "Archived";
          image: string;
          description: string;
          sizes?: string[];
          images?: string[] | null;
          colors?: Json | null;
          materials?: string | null;
          waterproof?: string | null;
          breathability?: string | null;
          hardware?: string | null;
          seams?: string | null;
          is_new_arrival?: boolean;
          series?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          sku?: string;
          price?: number;
          stock?: number;
          category?: string;
          status?: "Active" | "Draft" | "Archived";
          image?: string;
          description?: string;
          sizes?: string[];
          images?: string[] | null;
          colors?: Json | null;
          materials?: string | null;
          waterproof?: string | null;
          breathability?: string | null;
          hardware?: string | null;
          seams?: string | null;
          is_new_arrival?: boolean;
          series?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          customer_id: string | null;
          customer_name: string;
          customer_email: string;
          total_price: number;
          status: "PENDING" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED";
          items_count: number;
          items_summary: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          customer_id?: string | null;
          customer_name: string;
          customer_email: string;
          total_price: number;
          status?: "PENDING" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED";
          items_count?: number;
          items_summary?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string | null;
          customer_name?: string;
          customer_email?: string;
          total_price?: number;
          status?: "PENDING" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED";
          items_count?: number;
          items_summary?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          name: string;
          price: number;
          quantity: number;
          size: string;
          color: string | null;
          image: string | null;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          name: string;
          price: number;
          quantity: number;
          size: string;
          color?: string | null;
          image?: string | null;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          name?: string;
          price?: number;
          quantity?: number;
          size?: string;
          color?: string | null;
          image?: string | null;
        };
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          line1: string;
          line2: string | null;
          city: string;
          country: string;
          postcode: string;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          line1: string;
          line2?: string | null;
          city: string;
          country: string;
          postcode: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          line1?: string;
          line2?: string | null;
          city?: string;
          country?: string;
          postcode?: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      cms_settings: {
        Row: {
          id: string;
          hero_title: string;
          hero_subtitle: string;
          hero_image: string;
          hero_cta_text: string;
          featured_category: string;
          promo_image: string | null;
          promo_heading: string | null;
          promo_cta_text: string | null;
          promo_intro: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          hero_title: string;
          hero_subtitle: string;
          hero_image: string;
          hero_cta_text: string;
          featured_category: string;
          promo_image?: string | null;
          promo_heading?: string | null;
          promo_cta_text?: string | null;
          promo_intro?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          hero_title?: string;
          hero_subtitle?: string;
          hero_image?: string;
          hero_cta_text?: string;
          featured_category?: string;
          promo_image?: string | null;
          promo_heading?: string | null;
          promo_cta_text?: string | null;
          promo_intro?: string | null;
          updated_at?: string;
        };
      };
      feedback_items: {
        Row: {
          id: string;
          text: string;
          author: string;
          location: string;
          approved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          text: string;
          author: string;
          location: string;
          approved?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          text?: string;
          author?: string;
          location?: string;
          approved?: boolean;
          created_at?: string;
        };
      };
      gallery_items: {
        Row: {
          id: string;
          title: string;
          image_url: string;
          sort_order: number;
          cloudinary_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          image_url: string;
          sort_order?: number;
          cloudinary_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          image_url?: string;
          sort_order?: number;
          cloudinary_id?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

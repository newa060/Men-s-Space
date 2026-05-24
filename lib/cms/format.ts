export interface CmsData {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroCtaText: string;
  featuredCategory: string;
  promoImage: string;
  promoHeading: string;
  promoCtaText: string;
  promoIntro: string;
  storeName: string;
  storeTagline: string;
  storeEmail: string;
  storePhone: string;
  storeInstagram: string;
  storeTwitter: string;
  storeFacebook: string;
  featuredNewArrivals: string[]; // Array of product IDs
}

export const DEFAULT_CMS: CmsData = {
  heroTitle: "Architectural Forms",
  heroSubtitle:
    "A dialogue between human structure and sartorial precision. Collection 04 is now available.",
  heroImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBga5lcdNTZo5qWObfMmw_RL3ZwUJtQp_vG9UficR9a_WYSqzsoM3FkgcXjOx82IytbLGbcK72QerzF5Ince2lrPNcUUzGEMXs9SSriYR26pfPLsI9dzJjz3DOrvGmj28_gJ23g7xOcCrMqTbfU8SlatF2I1fmA134UU9on7OKs_SdNhYINdOOO3g5JMlqk5Pxpik_5FRN77rU_4Hr_KhJnyX3F96SSsLQtEwSh5zGTrTqAY7N9w3TwaBn0ZsZ-nNmGmd2Adj_J5THD",
  heroCtaText: "Shop Collection",
  featuredCategory: "Architecture",
  promoImage:
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2040&auto=format&fit=crop",
  promoHeading: "New Arrivals / Series 02",
  promoCtaText: "Explore the Series",
  promoIntro: "COLLECTION 2026",
  storeName: "Aesthete Studio",
  storeTagline: "Architectural Forms in Fashion",
  storeEmail: "",
  storePhone: "",
  storeInstagram: "",
  storeTwitter: "",
  storeFacebook: "",
  featuredNewArrivals: [],
};

type CmsRow = {
  hero_title?: string;
  hero_subtitle?: string;
  hero_image?: string;
  hero_cta_text?: string;
  featured_category?: string;
  promo_image?: string | null;
  promo_heading?: string | null;
  promo_cta_text?: string | null;
  promo_intro?: string | null;
  store_name?: string | null;
  store_tagline?: string | null;
  store_email?: string | null;
  store_phone?: string | null;
  store_instagram?: string | null;
  store_twitter?: string | null;
  store_facebook?: string | null;
  featured_new_arrivals?: string[] | null;
};

export function formatCms(row: CmsRow | null | undefined): CmsData {
  if (!row) return { ...DEFAULT_CMS };

  return {
    heroTitle: row.hero_title ?? DEFAULT_CMS.heroTitle,
    heroSubtitle: row.hero_subtitle ?? DEFAULT_CMS.heroSubtitle,
    heroImage: row.hero_image ?? DEFAULT_CMS.heroImage,
    heroCtaText: row.hero_cta_text ?? DEFAULT_CMS.heroCtaText,
    featuredCategory: row.featured_category ?? DEFAULT_CMS.featuredCategory,
    promoImage: row.promo_image ?? DEFAULT_CMS.promoImage,
    promoHeading: row.promo_heading ?? DEFAULT_CMS.promoHeading,
    promoCtaText: row.promo_cta_text ?? DEFAULT_CMS.promoCtaText,
    promoIntro: row.promo_intro ?? DEFAULT_CMS.promoIntro,
    storeName: row.store_name ?? DEFAULT_CMS.storeName,
    storeTagline: row.store_tagline ?? DEFAULT_CMS.storeTagline,
    storeEmail: row.store_email ?? DEFAULT_CMS.storeEmail,
    storePhone: row.store_phone ?? DEFAULT_CMS.storePhone,
    storeInstagram: row.store_instagram ?? DEFAULT_CMS.storeInstagram,
    storeTwitter: row.store_twitter ?? DEFAULT_CMS.storeTwitter,
    storeFacebook: row.store_facebook ?? DEFAULT_CMS.storeFacebook,
    featuredNewArrivals: row.featured_new_arrivals ?? DEFAULT_CMS.featuredNewArrivals,
  };
}

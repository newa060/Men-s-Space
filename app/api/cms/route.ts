import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createClient();
    const { data: cms, error } = await supabase
      .from("cms_settings")
      .select("*")
      .eq("id", "global")
      .single();

    if (error || !cms) {
      // Return default seed data if not found, to ensure storefront never breaks
      const defaultCms = {
        heroTitle: "Architectural Forms",
        heroSubtitle: "A dialogue between human structure and sartorial precision. Collection 04 is now available.",
        heroImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBga5lcdNTZo5qWObfMmw_RL3ZwUJtQp_vG9UficR9a_WYSqzsoM3FkgcXjOx82IytbLGbcK72QerzF5Ince2lrPNcUUzGEMXs9SSriYR26pfPLsI9dzJjz3DOrvGmj28_gJ23g7xOcCrMqTbfU8SlatF2I1fmA134UU9on7OKs_SdNhYINdOOO3g5JMlqk5Pxpik_5FRN77rU_4Hr_KhJnyX3F96SSsLQtEwSh5zGTrTqAY7N9w3TwaBn0ZsZ-nNmGmd2Adj_J5THD",
        heroCtaText: "Shop Collection",
        featuredCategory: "Architecture",
      };
      return NextResponse.json({ success: true, data: defaultCms });
    }

    const formattedCms = {
      heroTitle: cms.hero_title,
      heroSubtitle: cms.hero_subtitle,
      heroImage: cms.hero_image,
      heroCtaText: cms.hero_cta_text,
      featuredCategory: cms.featured_category,
    };

    return NextResponse.json({ success: true, data: formattedCms });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

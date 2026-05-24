import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_CMS, formatCms } from "@/lib/cms/format";

export async function GET() {
  try {
    const supabase = createClient(true);
    const { data: cms, error } = await supabase
      .from("cms_settings")
      .select("*")
      .eq("id", "global")
      .single();

    if (error || !cms) {
      return NextResponse.json({ success: true, data: DEFAULT_CMS }, {
        headers: { "Cache-Control": "no-store" },
      });
    }

    return NextResponse.json({ success: true, data: formatCms(cms) }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load CMS";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const supabase = createClient(true);

    const dbUpdates: Record<string, any> = {};
    if (body.heroTitle !== undefined) dbUpdates.hero_title = body.heroTitle;
    if (body.heroSubtitle !== undefined) dbUpdates.hero_subtitle = body.heroSubtitle;
    if (body.heroImage !== undefined) dbUpdates.hero_image = body.heroImage;
    if (body.heroCtaText !== undefined) dbUpdates.hero_cta_text = body.heroCtaText;
    if (body.featuredCategory !== undefined) dbUpdates.featured_category = body.featuredCategory;
    if (body.promoImage !== undefined) dbUpdates.promo_image = body.promoImage;
    if (body.promoHeading !== undefined) dbUpdates.promo_heading = body.promoHeading;
    if (body.promoCtaText !== undefined) dbUpdates.promo_cta_text = body.promoCtaText;
    if (body.promoIntro !== undefined) dbUpdates.promo_intro = body.promoIntro;
    if (body.storeName !== undefined) dbUpdates.store_name = body.storeName;
    if (body.storeTagline !== undefined) dbUpdates.store_tagline = body.storeTagline;
    if (body.storeEmail !== undefined) dbUpdates.store_email = body.storeEmail;
    if (body.storePhone !== undefined) dbUpdates.store_phone = body.storePhone;
    if (body.storeInstagram !== undefined) dbUpdates.store_instagram = body.storeInstagram;
    if (body.storeTwitter !== undefined) dbUpdates.store_twitter = body.storeTwitter;
    if (body.storeLocation !== undefined) dbUpdates.store_location = body.storeLocation;
    if (body.storeLocationUrl !== undefined) dbUpdates.store_location_url = body.storeLocationUrl;
    if (body.storeFacebook !== undefined) dbUpdates.store_facebook = body.storeFacebook;
    if (body.featuredNewArrivals !== undefined) dbUpdates.featured_new_arrivals = body.featuredNewArrivals;
    
    const { data: updatedCms, error } = await supabase
      .from("cms_settings")
      .upsert({ id: "global", ...dbUpdates }, { onConflict: "id" })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: formatCms(updatedCms) });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update CMS";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

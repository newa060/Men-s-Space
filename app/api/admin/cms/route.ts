import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const supabase = createClient();

    const dbUpdates: Record<string, any> = {};
    if (body.heroTitle !== undefined) dbUpdates.hero_title = body.heroTitle;
    if (body.heroSubtitle !== undefined) dbUpdates.hero_subtitle = body.heroSubtitle;
    if (body.heroImage !== undefined) dbUpdates.hero_image = body.heroImage;
    if (body.heroCtaText !== undefined) dbUpdates.hero_cta_text = body.heroCtaText;
    if (body.featuredCategory !== undefined) dbUpdates.featured_category = body.featuredCategory;

    const { data: updatedCms, error } = await supabase
      .from("cms_settings")
      .update(dbUpdates)
      .eq("id", "global")
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const formattedCms = {
      heroTitle: updatedCms.hero_title,
      heroSubtitle: updatedCms.hero_subtitle,
      heroImage: updatedCms.hero_image,
      heroCtaText: updatedCms.hero_cta_text,
      featuredCategory: updatedCms.featured_category,
    };

    return NextResponse.json({ success: true, data: formattedCms });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

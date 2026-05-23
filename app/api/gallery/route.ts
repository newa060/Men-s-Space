import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { formatGalleryItem } from "@/lib/gallery/format";

export async function GET() {
  try {
    const supabase = createClient(true);
    const { data, error } = await supabase
      .from("gallery_items")
      .select("id, title, image_url, sort_order")
      .order("sort_order", { ascending: true });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: (data || []).map(formatGalleryItem),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load gallery";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

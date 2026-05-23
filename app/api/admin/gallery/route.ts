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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const title = (body.title as string)?.trim() || "New Slide";
    const imageUrl = (body.image as string)?.trim();

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: "Image URL is required" },
        { status: 400 }
      );
    }

    const supabase = createClient(true);

    const { data: maxOrderRow } = await supabase
      .from("gallery_items")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    const sortOrder =
      body.sortOrder !== undefined
        ? Number(body.sortOrder)
        : (maxOrderRow?.sort_order ?? -1) + 1;

    const { data, error } = await supabase
      .from("gallery_items")
      .insert({
        title,
        image_url: imageUrl,
        sort_order: sortOrder,
        cloudinary_id: body.cloudinaryId || null,
      })
      .select("id, title, image_url, sort_order")
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: formatGalleryItem(data) });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create slide";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

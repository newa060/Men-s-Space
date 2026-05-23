import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { formatGalleryItem } from "@/lib/gallery/format";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const supabase = createClient(true);

    const dbUpdates: Record<string, unknown> = {};
    if (body.title !== undefined) dbUpdates.title = String(body.title).trim();
    if (body.image !== undefined) dbUpdates.image_url = String(body.image).trim();
    if (body.sortOrder !== undefined) dbUpdates.sort_order = Number(body.sortOrder);
    if (body.cloudinaryId !== undefined) dbUpdates.cloudinary_id = body.cloudinaryId;

    if (Object.keys(dbUpdates).length === 0) {
      return NextResponse.json(
        { success: false, error: "No fields to update" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("gallery_items")
      .update(dbUpdates)
      .eq("id", params.id)
      .select("id, title, image_url, sort_order")
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ success: false, error: "Slide not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: formatGalleryItem(data) });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update slide";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(true);
    const { error } = await supabase
      .from("gallery_items")
      .delete()
      .eq("id", params.id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete slide";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

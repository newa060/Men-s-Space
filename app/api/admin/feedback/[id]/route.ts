import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const supabase = createClient();

    // First fetch to toggle or just set from body
    const { data: existing } = await supabase
      .from("feedback_items")
      .select("approved")
      .eq("id", params.id)
      .single();

    if (!existing) {
      return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
    }

    const nextApproved = body.approved !== undefined ? body.approved : !existing.approved;

    const { data: updated, error } = await supabase
      .from("feedback_items")
      .update({ approved: nextApproved })
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("feedback_items")
      .delete()
      .eq("id", params.id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Review deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createClient();
    const { data: feedback, error } = await supabase
      .from("feedback_items")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: feedback });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();

    // Must be a logged-in customer
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { text, location, orderId } = body;

    if (!text || typeof text !== "string" || text.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: "Review must be at least 10 characters." },
        { status: 400 }
      );
    }

    if (!location || typeof location !== "string" || location.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Location is required." },
        { status: 400 }
      );
    }

    // Verify the order belongs to this user and is COMPLETED/DELIVERED
    if (orderId) {
      const { data: order } = await supabase
        .from("orders")
        .select("id, status, customer_id")
        .eq("id", orderId)
        .eq("customer_id", user.id)
        .single();

      if (!order) {
        return NextResponse.json(
          { success: false, error: "Order not found." },
          { status: 404 }
        );
      }
    }

    // Fetch the customer's display name from their profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    const author = profile?.full_name?.trim() || "Anonymous";

    const { data: inserted, error } = await supabase
      .from("feedback_items")
      .insert({
        text: text.trim(),
        author,
        location: location.trim(),
        approved: false, // pending admin approval
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: inserted }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

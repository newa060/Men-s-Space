import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ── GET — load all cart items for the logged-in user ─────────────────────────
export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    const items = (data || []).map((r) => ({
      id: r.product_id,
      name: r.name,
      price: Number(r.price),
      size: r.size,
      color: r.color,
      quantity: r.quantity,
      image: r.image,
      slug: r.slug,
      _rowId: r.id,
    }));

    return NextResponse.json({ success: true, data: items });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// ── POST — upsert a single item (add or increment) ───────────────────────────
export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { id, name, price, size, color, quantity, image, slug } = body;

    if (!id || !name || !size) {
      return NextResponse.json({ success: false, error: "Missing required fields." }, { status: 400 });
    }

    // Check if this exact product+size combo already exists
    const { data: existing } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("product_id", id)
      .eq("size", size)
      .maybeSingle();

    if (existing) {
      // Increment quantity
      const { data, error } = await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + 1, updated_at: new Date().toISOString() })
        .eq("id", existing.id)
        .select()
        .single();
      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, data });
    }

    // Insert new row
    const { data, error } = await supabase
      .from("cart_items")
      .insert({
        user_id: user.id,
        product_id: id,
        name,
        price,
        size,
        color: color || "",
        quantity: quantity || 1,
        image: image || "",
        slug: slug || "",
      })
      .select()
      .single();

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// ── PUT — update quantity for a specific item ─────────────────────────────────
export async function PUT(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { productId, size, quantity } = await request.json();

    if (quantity <= 0) {
      // Delete instead
      await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .eq("size", size);
      return NextResponse.json({ success: true, deleted: true });
    }

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity, updated_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .eq("size", size);

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// ── DELETE — remove one item or clear entire cart ─────────────────────────────
export async function DELETE(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const size = searchParams.get("size");
    const clearAll = searchParams.get("clearAll");

    if (clearAll === "true") {
      await supabase.from("cart_items").delete().eq("user_id", user.id);
      return NextResponse.json({ success: true });
    }

    if (!productId || !size) {
      return NextResponse.json({ success: false, error: "productId and size required." }, { status: 400 });
    }

    await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .eq("size", size);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

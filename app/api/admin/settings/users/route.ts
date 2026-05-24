import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createClient(true);

    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, phone, avatar_url, role, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Get order counts per user
    const { data: orders } = await supabase
      .from("orders")
      .select("customer_id, total_price, status");

    const orderMap: Record<string, { count: number; total: number }> = {};
    (orders || []).forEach((o) => {
      if (!o.customer_id) return;
      if (!orderMap[o.customer_id]) orderMap[o.customer_id] = { count: 0, total: 0 };
      orderMap[o.customer_id].count += 1;
      if (o.status !== "CANCELLED") {
        orderMap[o.customer_id].total += Number(o.total_price);
      }
    });

    const data = (profiles || []).map((p) => ({
      id: p.id,
      email: p.email,
      fullName: p.full_name || p.email.split("@")[0],
      phone: p.phone || "",
      avatarUrl: p.avatar_url || "",
      role: p.role,
      createdAt: p.created_at,
      orderCount: orderMap[p.id]?.count || 0,
      totalSpent: orderMap[p.id]?.total || 0,
    }));

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

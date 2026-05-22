import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createClient();
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Map database order fields to frontend Order interface
    const formattedOrders = await Promise.all(
      orders.map(async (o) => {
        // Find user details to represent avatar if available
        const { data: profile } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("id", o.customer_id)
          .maybeSingle();

        const defaultAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuCtiaf3qaq4VXrXI5zfTURBHi4nlnUKFBWfp0_u9NePEa5VKLkdcbUeqh3v7XST4wZd86-pc3b4p62z7sw3FuOQ5ClPy4xHW9Q_Rv0NNIHl5UrmL0VD7wngDkxDEfbGz_1JhBLDYIh_dzJ6XqkFxY8xb41YV6ptKQ3nvwVEuSMr0vw_pLc_bnvhXLxU6QMV_rv1-p6Fy5pxMbRm2-R0bW9eVpGogGF7rjaaHOLBKDDwNS9S1f7CcalOeDfNaUc9BCJWjZm3gui0uiUF";

        return {
          id: o.id,
          customerName: o.customer_name,
          customerImage: profile?.avatar_url || defaultAvatar,
          date: new Date(o.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }),
          itemsCount: o.items_count,
          totalPrice: Number(o.total_price),
          status: o.status,
          items: o.items_summary || "Editorial Drop Collection",
        };
      })
    );

    return NextResponse.json({ success: true, data: formattedOrders });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

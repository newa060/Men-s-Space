import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { OrderStatusSchema } from "@/lib/validations/order";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validation = OrderStatusSchema.safeParse(body.status);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Invalid order status value" },
        { status: 400 }
      );
    }

    const status = validation.data;
    const supabase = createClient();

    const { data: updatedOrder, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: updatedOrder });
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
      .from("orders")
      .delete()
      .eq("id", params.id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Order removed successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AddressSchema } from "@/lib/validations/user";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = AddressSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const addr = validation.data;

    // Verify address belongs to the user
    const { data: existing } = await supabase
      .from("addresses")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (!existing) {
      return NextResponse.json({ success: false, error: "Address not found" }, { status: 404 });
    }

    // If setting as default, clear others
    if (addr.isDefault) {
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id);
    }

    const { data: updated, error } = await supabase
      .from("addresses")
      .update({
        name: addr.name,
        line1: addr.line1,
        line2: addr.line2 || null,
        city: addr.city,
        country: addr.country,
        postcode: addr.postcode,
        is_default: addr.isDefault,
      })
      .eq("id", params.id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const formattedAddress = {
      id: updated.id,
      name: updated.name,
      line1: updated.line1,
      line2: updated.line2 || "",
      city: updated.city,
      country: updated.country,
      postcode: updated.postcode,
      isDefault: updated.is_default,
    };

    return NextResponse.json({ success: true, data: formattedAddress });
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
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase
      .from("addresses")
      .delete()
      .eq("id", params.id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Address deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

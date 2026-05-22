import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AddressSchema } from "@/lib/validations/user";

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { data: addresses, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Map DB snake_case columns to frontend camelCase columns
    const formattedAddresses = addresses.map((addr) => ({
      id: addr.id,
      name: addr.name,
      line1: addr.line1,
      line2: addr.line2 || "",
      city: addr.city,
      country: addr.country,
      postcode: addr.postcode,
      isDefault: addr.is_default,
    }));

    return NextResponse.json({ success: true, data: formattedAddresses });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
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

    // If setting as default, set all other addresses of this user to not default
    if (addr.isDefault) {
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id);
    }

    const { data: newAddress, error } = await supabase
      .from("addresses")
      .insert({
        user_id: user.id,
        name: addr.name,
        line1: addr.line1,
        line2: addr.line2 || null,
        city: addr.city,
        country: addr.country,
        postcode: addr.postcode,
        is_default: addr.isDefault,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const formattedAddress = {
      id: newAddress.id,
      name: newAddress.name,
      line1: newAddress.line1,
      line2: newAddress.line2 || "",
      city: newAddress.city,
      country: newAddress.country,
      postcode: newAddress.postcode,
      isDefault: newAddress.is_default,
    };

    return NextResponse.json({ success: true, data: formattedAddress });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

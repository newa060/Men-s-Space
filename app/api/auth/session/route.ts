import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ success: true, data: { user: null } });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name, phone, avatar_url")
      .eq("id", user.id)
      .single();

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: profile?.full_name || user.email?.split("@")[0],
          phone: profile?.phone || "",
          avatarUrl: profile?.avatar_url || "",
          role: profile?.role || "customer",
        },
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

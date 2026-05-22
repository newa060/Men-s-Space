import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { LoginSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = LoginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    // Use service role client to bypass RLS — session cookie isn't set yet at this point
    const adminSupabase = createClient(true);
    const { data: profile } = await adminSupabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", data.user.id)
      .single();

    const role = profile?.role || "customer";
    const fullName = profile?.full_name || email.split("@")[0];

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          fullName,
          role,
        },
        session: data.session,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

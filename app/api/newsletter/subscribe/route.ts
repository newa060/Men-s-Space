import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const supabase = createClient(true);

    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: email.toLowerCase().trim() });

    if (error) {
      // Unique violation — already subscribed
      if (error.code === "23505") {
        return NextResponse.json(
          { success: false, error: "This email is already subscribed." },
          { status: 409 }
        );
      }
      // Table doesn't exist yet
      if (error.code === "42P01") {
        return NextResponse.json(
          { success: false, error: "Newsletter service is not set up yet. Please run the database migration." },
          { status: 503 }
        );
      }
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Subscription failed.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

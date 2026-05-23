import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createClient(true);
    const { data, error } = await supabase
      .from("products")
      .select("category");

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Derive unique, sorted category names from actual products
    const unique = Array.from(new Set((data || []).map((p: any) => p.category).filter(Boolean))).sort();

    return NextResponse.json({ success: true, data: unique });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

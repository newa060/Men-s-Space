import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_CMS, formatCms } from "@/lib/cms/format";

export async function GET() {
  try {
    const supabase = createClient(true);
    const { data: cms, error } = await supabase
      .from("cms_settings")
      .select("*")
      .eq("id", "global")
      .single();

    if (error || !cms) {
      return NextResponse.json({ success: true, data: DEFAULT_CMS });
    }

    return NextResponse.json({ success: true, data: formatCms(cms) });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load CMS";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

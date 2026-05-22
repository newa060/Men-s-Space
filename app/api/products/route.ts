import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const isNewArrival = searchParams.get("isNewArrival");

    let query = supabase
      .from("products")
      .select("*")
      .eq("status", "Active")
      .order("created_at", { ascending: false });

    if (category && category !== "All") {
      query = query.eq("category", category);
    }

    if (isNewArrival === "true") {
      query = query.eq("is_new_arrival", true);
    }

    const { data: products, error } = await query;

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Convert keys from database snake_case to frontend camelCase
    const formattedProducts = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      price: p.price,
      stock: p.stock,
      category: p.category,
      status: p.status,
      image: p.image,
      description: p.description,
      sizes: p.sizes,
      images: p.images || [],
      colors: p.colors || [],
      materials: p.materials,
      waterproof: p.waterproof,
      breathability: p.breathability,
      hardware: p.hardware,
      seams: p.seams,
      isNewArrival: p.is_new_arrival,
      series: p.series,
    }));

    return NextResponse.json({ success: true, data: formattedProducts });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

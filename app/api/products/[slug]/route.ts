import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = createClient(true);
    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", params.slug)
      .single();

    if (error || !product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    const formattedProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      price: product.price,
      stock: product.stock,
      category: product.category,
      status: product.status,
      image: product.image,
      description: product.description,
      sizes: product.sizes,
      images: product.images || [],
      colors: product.colors || [],
      materials: product.materials,
      waterproof: product.waterproof,
      breathability: product.breathability,
      hardware: product.hardware,
      seams: product.seams,
      isNewArrival: product.is_new_arrival,
      series: product.series,
    };

    return NextResponse.json({ success: true, data: formattedProduct });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

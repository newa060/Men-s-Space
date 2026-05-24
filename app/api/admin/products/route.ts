import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ProductSchema } from "@/lib/validations/product";

export async function GET(request: Request) {
  try {
    const supabase = createClient(true);
    const { searchParams } = new URL(request.url);
    const isNewArrival = searchParams.get("isNewArrival");

    let query = supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (isNewArrival === "true") {
      query = query.eq("is_new_arrival", true);
    }

    const { data: products, error } = await query;

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

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
      materials: p.materials || "",
      waterproof: p.waterproof || "",
      breathability: p.breathability || "",
      hardware: p.hardware || "",
      seams: p.seams || "",
      isNewArrival: p.is_new_arrival,
      series: p.series || "",
    }));

    return NextResponse.json({ success: true, data: formattedProducts });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = ProductSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const product = validation.data;
    const supabase = createClient(true);

    // Auto-generate SKU if not provided
    const categoryPrefix = product.category.slice(0, 3).toUpperCase();
    const randomNum = Math.floor(100 + Math.random() * 900);
    const sku = product.sku || `SKU-${categoryPrefix}-${randomNum}`;

    const { data: newProd, error } = await supabase
      .from("products")
      .insert({
        name: product.name,
        slug: product.slug,
        sku,
        price: product.price,
        stock: product.stock,
        category: product.category,
        status: product.status,
        image: product.image,
        description: product.description,
        sizes: product.sizes,
        images: product.images || [],
        colors: product.colors || [],
        materials: product.materials || null,
        waterproof: product.waterproof || null,
        breathability: product.breathability || null,
        hardware: product.hardware || null,
        seams: product.seams || null,
        is_new_arrival: product.isNewArrival || false,
        series: product.series || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const formattedProduct = {
      id: newProd.id,
      name: newProd.name,
      slug: newProd.slug,
      sku: newProd.sku,
      price: newProd.price,
      stock: newProd.stock,
      category: newProd.category,
      status: newProd.status,
      image: newProd.image,
      description: newProd.description,
      sizes: newProd.sizes,
      images: newProd.images || [],
      colors: newProd.colors || [],
      materials: newProd.materials || "",
      waterproof: newProd.waterproof || "",
      breathability: newProd.breathability || "",
      hardware: newProd.hardware || "",
      seams: newProd.seams || "",
      isNewArrival: newProd.is_new_arrival,
      series: newProd.series || "",
    };

    return NextResponse.json({ success: true, data: formattedProduct });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

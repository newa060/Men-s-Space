import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ProductSchema } from "@/lib/validations/product";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    // Allow partial updates on PUT in API
    const validation = ProductSchema.partial().safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const updates = validation.data;
    const supabase = createClient(true);

    // Map field names from frontend camelCase to database snake_case
    const dbUpdates: Record<string, any> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.slug !== undefined) dbUpdates.slug = updates.slug;
    if (updates.sku !== undefined) dbUpdates.sku = updates.sku;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.stock !== undefined) dbUpdates.stock = updates.stock;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.image !== undefined) dbUpdates.image = updates.image;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.sizes !== undefined) dbUpdates.sizes = updates.sizes;
    if (updates.images !== undefined) dbUpdates.images = updates.images;
    if (updates.colors !== undefined) dbUpdates.colors = updates.colors;
    if (updates.materials !== undefined) dbUpdates.materials = updates.materials;
    if (updates.waterproof !== undefined) dbUpdates.waterproof = updates.waterproof;
    if (updates.breathability !== undefined) dbUpdates.breathability = updates.breathability;
    if (updates.hardware !== undefined) dbUpdates.hardware = updates.hardware;
    if (updates.seams !== undefined) dbUpdates.seams = updates.seams;
    if (updates.isNewArrival !== undefined) dbUpdates.is_new_arrival = updates.isNewArrival;
    if (updates.series !== undefined) dbUpdates.series = updates.series;

    const { data: updatedProd, error } = await supabase
      .from("products")
      .update(dbUpdates)
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const formattedProduct = {
      id: updatedProd.id,
      name: updatedProd.name,
      slug: updatedProd.slug,
      sku: updatedProd.sku,
      price: updatedProd.price,
      stock: updatedProd.stock,
      category: updatedProd.category,
      status: updatedProd.status,
      image: updatedProd.image,
      description: updatedProd.description,
      sizes: updatedProd.sizes,
      images: updatedProd.images || [],
      colors: updatedProd.colors || [],
      materials: updatedProd.materials || "",
      waterproof: updatedProd.waterproof || "",
      breathability: updatedProd.breathability || "",
      hardware: updatedProd.hardware || "",
      seams: updatedProd.seams || "",
      isNewArrival: updatedProd.is_new_arrival,
      series: updatedProd.series || "",
    };

    return NextResponse.json({ success: true, data: formattedProduct });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(true);
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", params.id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CreateOrderSchema } from "@/lib/validations/order";

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Fetch orders
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false });

    if (ordersError) {
      return NextResponse.json({ success: false, error: ordersError.message }, { status: 500 });
    }

    // Fetch order items for each order
    const formattedOrders = await Promise.all(
      orders.map(async (order) => {
        const { data: items } = await supabase
          .from("order_items")
          .select("*")
          .eq("order_id", order.id);

        // Fetch user default address to represent address inside order detail if available
        const { data: address } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_default", true)
          .maybeSingle();

        const defaultAddress = address
          ? {
              name: address.name,
              line1: address.line1,
              line2: address.line2 || undefined,
              city: address.city,
              country: address.country,
              postcode: address.postcode,
            }
          : {
              name: order.customer_name,
              line1: "Complimentary Delivery",
              city: "Digital Fulfilment",
              country: "Global",
              postcode: "AESTHETE",
            };

        // Form single OrderItem representation for frontend (since order-history maps single product thumbnails)
        const representativeItem = items && items.length > 0 ? items[0] : null;

        return {
          id: order.id,
          name: items ? items.map(i => i.name).join(", ") : "Aesthete Custom Collection",
          price: Number(order.total_price),
          date: new Date(order.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }),
          status: order.status,
          image: representativeItem?.image || "https://images.unsplash.com/photo-1539109136881-3be0616acf4b",
          trackingNumber: "TRK-" + order.id.replace("AES-", "") + Math.floor(100 + Math.random() * 900),
          size: representativeItem?.size || "OS",
          color: representativeItem?.color || "Neutral",
          quantity: representativeItem?.quantity || 1,
          address: defaultAddress,
          paymentMethod: "Visa Premium (•••• 4321)",
          itemsCount: order.items_count,
        };
      })
    );

    return NextResponse.json({ success: true, data: formattedOrders });
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
    const validation = CreateOrderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { customerName, customerEmail, items } = validation.data;

    // Fetch products in order to verify prices and check stock
    const productIds = items.map(item => item.productId);
    const { data: dbProducts, error: prodError } = await supabase
      .from("products")
      .select("*")
      .in("id", productIds);

    if (prodError || !dbProducts) {
      return NextResponse.json({ success: false, error: "Failed to verify products." }, { status: 400 });
    }

    // Check stock and compute server-verified price
    let calculatedTotal = 0;
    let calculatedCount = 0;
    const itemsSummaryParts: string[] = [];

    for (const item of items) {
      const dbProd = dbProducts.find(p => p.id === item.productId);
      if (!dbProd) {
        return NextResponse.json({ success: false, error: `Product ${item.name} not found.` }, { status: 400 });
      }

      if (dbProd.stock < item.quantity) {
        return NextResponse.json({ success: false, error: `Insufficient stock for ${item.name}.` }, { status: 400 });
      }

      calculatedTotal += dbProd.price * item.quantity;
      calculatedCount += item.quantity;
      itemsSummaryParts.push(`${dbProd.name} x${item.quantity}`);
    }

    // Generate custom Order ID
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const orderId = `AES-${randomDigits}`;

    // Place order within transactional context (by performing multiple queries)
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        id: orderId,
        customer_id: user.id,
        customer_name: customerName,
        customer_email: customerEmail,
        total_price: calculatedTotal,
        status: "PENDING",
        items_count: calculatedCount,
        items_summary: itemsSummaryParts.join(", "),
      })
      .select()
      .single();

    if (orderError) {
      return NextResponse.json({ success: false, error: orderError.message }, { status: 500 });
    }

    // Insert order items & update product stock
    for (const item of items) {
      const dbProd = dbProducts.find(p => p.id === item.productId)!;

      // Deduct stock
      await supabase
        .from("products")
        .update({ stock: dbProd.stock - item.quantity })
        .eq("id", item.productId);

      // Insert item
      await supabase
        .from("order_items")
        .insert({
          order_id: orderId,
          product_id: item.productId,
          name: item.name,
          price: dbProd.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color || null,
          image: item.image,
        });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: orderId,
        totalPrice: calculatedTotal,
        status: "PENDING",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

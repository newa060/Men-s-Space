import { NextResponse } from "next/server";
import { generateSignature } from "@/lib/cloudinary/upload";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const folder = body.folder || "aesthete";
    
    // Set standard parameters for signed upload
    const params = {
      folder,
    };

    const { signature, timestamp } = generateSignature(params);

    return NextResponse.json({
      success: true,
      data: {
        signature,
        timestamp,
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        folder,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

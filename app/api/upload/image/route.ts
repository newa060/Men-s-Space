import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary/upload";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to base64 Data URI
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64File = `data:${file.type};base64,${buffer.toString("base64")}`;

    const folder = (formData.get("folder") as string) || "aesthete";
    const uploadResult = await uploadImage(base64File, folder);

    if (!uploadResult.success) {
      return NextResponse.json({ success: false, error: uploadResult.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

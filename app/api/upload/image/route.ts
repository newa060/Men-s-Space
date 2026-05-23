import { NextResponse } from "next/server";
import { uploadImageBuffer } from "@/lib/cloudinary/upload";

const MAX_SIZE_MB = 10;

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: `Image must be smaller than ${MAX_SIZE_MB}MB.` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const folder = (formData.get("folder") as string) || "aesthete";

    const uploadResult = await uploadImageBuffer(buffer, folder);

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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

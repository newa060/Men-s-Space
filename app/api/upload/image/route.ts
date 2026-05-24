import { NextResponse } from "next/server";
import { uploadImageBuffer } from "@/lib/cloudinary/upload";

const MAX_IMAGE_SIZE_MB = 10;
const MAX_VIDEO_SIZE_MB = 100;

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    // Determine if it's a video or image
    const isVideo = file.type.startsWith('video/');
    const maxSize = isVideo ? MAX_VIDEO_SIZE_MB : MAX_IMAGE_SIZE_MB;

    if (file.size > maxSize * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: `${isVideo ? 'Video' : 'Image'} must be smaller than ${maxSize}MB.` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const folder = (formData.get("folder") as string) || "aesthete";
    const resourceType = isVideo ? "video" : "image";

    const uploadResult = await uploadImageBuffer(buffer, folder, resourceType);

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

import { NextResponse } from "next/server";
import { deleteImage } from "@/lib/cloudinary/delete";

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let publicId = searchParams.get("publicId");

    if (!publicId) {
      try {
        const body = await request.json();
        publicId = body.publicId;
      } catch {
        // No body provided
      }
    }

    if (!publicId) {
      return NextResponse.json({ success: false, error: "Missing publicId parameter" }, { status: 400 });
    }

    const deleteResult = await deleteImage(publicId);

    if (!deleteResult.success) {
      return NextResponse.json({ success: false, error: deleteResult.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Asset deleted successfully from Cloudinary" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

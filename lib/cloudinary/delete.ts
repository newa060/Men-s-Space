import cloudinary from "./config";

export async function deleteImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return { success: result.result === "ok", result };
  } catch (error: any) {
    console.error("Cloudinary delete error:", error);
    return { success: false, error: error.message || error };
  }
}

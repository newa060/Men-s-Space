import cloudinary from "./config";

export function generateSignature(params: Record<string, any>) {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const paramsToSign = {
    ...params,
    timestamp,
  };
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );
  return { signature, timestamp };
}

export async function uploadImage(fileUri: string, folder = "aesthete") {
  try {
    const result = await cloudinary.uploader.upload(fileUri, {
      folder,
      resource_type: "auto",
    });
    return {
      success: true,
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    return { success: false, error: error.message || error };
  }
}

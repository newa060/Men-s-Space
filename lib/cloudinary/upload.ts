import cloudinary from "./config";

export function generateSignature(params: Record<string, string>) {
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

export async function uploadImageBuffer(
  buffer: Buffer,
  folder = "aesthete"
): Promise<
  | { success: true; secure_url: string; public_id: string }
  | { success: false; error: string }
> {
  return new Promise((resolve) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          resolve({
            success: false,
            error: error.message || "Upload failed",
          });
          return;
        }
        if (!result?.secure_url) {
          resolve({ success: false, error: "Upload failed" });
          return;
        }
        resolve({
          success: true,
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );
    uploadStream.end(buffer);
  });
}

/** @deprecated Prefer uploadImageBuffer — base64 is slow and can time out on large files */
export async function uploadImage(fileUri: string, folder = "aesthete") {
  try {
    const result = await cloudinary.uploader.upload(fileUri, {
      folder,
      resource_type: "image",
      timeout: 120000,
    });
    return {
      success: true,
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error: unknown) {
    console.error("Cloudinary upload error:", error);
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "object" && error !== null && "error" in error
          ? String((error as { error?: { message?: string } }).error?.message)
          : "Upload failed";
    return { success: false, error: message };
  }
}

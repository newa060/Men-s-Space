const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_MB = 10;

export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Only JPG, PNG, WEBP, or GIF images are allowed.";
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return `Image must be smaller than ${MAX_SIZE_MB}MB.`;
  }
  return null;
}

async function getSignedUploadParams(folder: string) {
  const response = await fetch("/api/cloudinary/sign-upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder }),
  });
  const json = await response.json();
  if (!json.success) {
    throw new Error(json.error || "Failed to prepare upload");
  }
  return json.data as {
    signature: string;
    timestamp: number;
    cloudName: string;
    apiKey: string;
    folder: string;
  };
}

async function uploadDirectToCloudinary(file: File, folder: string): Promise<string> {
  const { signature, timestamp, cloudName, apiKey, folder: signedFolder } =
    await getSignedUploadParams(folder);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", signedFolder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  const result = await response.json();
  if (!response.ok || result.error) {
    throw new Error(result.error?.message || "Upload failed");
  }

  return result.secure_url as string;
}

async function uploadViaServer(file: File, folder: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch("/api/upload/image", {
    method: "POST",
    body: formData,
  });

  const json = await response.json();
  if (!json.success) {
    throw new Error(json.error || "Upload failed");
  }

  return json.data.url as string;
}

/** Upload image — browser sends directly to Cloudinary (fast, no server timeout). */
export async function uploadImageFile(
  file: File,
  folder = "products"
): Promise<string> {
  const validationError = validateImageFile(file);
  if (validationError) throw new Error(validationError);

  try {
    return await uploadDirectToCloudinary(file, folder);
  } catch (directError) {
    console.warn("Direct Cloudinary upload failed, using server:", directError);
    return uploadViaServer(file, folder);
  }
}

import { api } from "./client";

/**
 * Uploads a file directly to Cloudinary from the browser (bypassing our own
 * server entirely) using a short-lived signature minted by
 * POST /api/uploads/sign. Replaces the old multer-based flow, which can't
 * work on Vercel (no persistent disk, request-body/time limits that a
 * multi-hundred-MB video would blow past). Returns the resulting
 * `secure_url` so the caller can pass it to the matching create endpoint
 * (POST /api/videos, /api/images, /api/articles, /api/users/me/avatar, etc.)
 */
export async function uploadToCloudinary(
  file: File,
  folder: "videos" | "images" | "articles" | "avatars" | "covers",
  onProgress?: (pct: number) => void
): Promise<{ url: string; durationSec?: number }> {
  const { data } = await api.post("/uploads/sign", { folder });
  const { signature, timestamp, apiKey, cloudName } = data.data;

  const resourceType = folder === "videos" ? "video" : "image";
  const form = new FormData();
  form.append("file", file);
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp));
  form.append("signature", signature);
  form.append("folder", `platform/${folder}`);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  const result = await new Promise<any>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", uploadUrl);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve(JSON.parse(xhr.responseText));
      else reject(new Error(`Cloudinary upload failed (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error("Cloudinary upload failed - network error"));
    xhr.send(form);
  });

  return { url: result.secure_url as string, durationSec: result.duration as number | undefined };
}

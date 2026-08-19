import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import fs from "node:fs/promises";
import { env } from "../config/env.js";
import { ApiError } from "./ApiError.js";

if (env.cloudinary.isConfigured) {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
  });
}

/**
 * `cloudinary.uploader.upload_large` is fundamentally stream-based under
 * the hood (it pipes the file into a chunked-upload Writable), so unlike
 * plain `upload()`, calling it without a callback does NOT return a
 * Promise - it returns the stream itself, which resolves instantly when
 * `await`-ed (streams aren't thenables) with no actual upload result. That
 * silently produced `{ secure_url: undefined }`, which is why a previous
 * attempt saved videos with a missing `url`. The only correct way to know
 * when a large upload has actually finished is the explicit callback.
 */
function uploadLargeAsync(
  localPath: string,
  options: Record<string, unknown>
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(localPath, options, (error, result) => {
      if (error) return reject(error);
      if (!result) return reject(new Error("Cloudinary returned no result for upload_large"));
      resolve(result);
    });
  });
}

/**
 * Uploads a locally-saved (multer disk storage) file to Cloudinary and
 * removes the local temp copy. If Cloudinary isn't configured (no keys in
 * .env yet), the file is left under /uploads and served statically instead
 * so local development works without cloud credentials.
 *
 * Pass `{ large: true }` for video uploads: Cloudinary's standard `upload`
 * call is capped around 100MB on the free plan, so anything bigger (a
 * 200MB+ video, say) needs the chunked `upload_large` endpoint instead, or
 * it fails outright once real credentials are configured.
 */
export async function uploadLocalFile(
  localPath: string,
  folder: string,
  options: { large?: boolean } = {}
): Promise<{ url: string; provider: "cloudinary" | "local" }> {
  if (!env.cloudinary.isConfigured) {
    return { url: `/uploads/${localPath.split("/").pop()}`, provider: "local" };
  }

  try {
    const result = options.large
      ? await uploadLargeAsync(localPath, {
          folder: `platform/${folder}`,
          resource_type: "video",
          chunk_size: 6 * 1024 * 1024, // 6MB chunks
        })
      : await cloudinary.uploader.upload(localPath, {
          folder: `platform/${folder}`,
          resource_type: "auto",
        });

    return { url: result.secure_url, provider: "cloudinary" };
  } catch (err: any) {
    // Surface Cloudinary's actual rejection reason (e.g. "File size too
    // large", plan/account limits, invalid credentials) instead of letting
    // it fall through as a generic 500 - this is nearly always something
    // the uploader did wrong (file too big, wrong format) or an account
    // limit, not a real server bug, so it's a 400 the client can display.
    console.error("[cloudinary upload failed]", err?.message ?? err);
    throw ApiError.badRequest(
      `Upload to Cloudinary failed: ${err?.message ?? "unknown error"}`
    );
  } finally {
    await fs.unlink(localPath).catch(() => undefined);
  }
}

/**
 * Derives a thumbnail image URL for a video already uploaded to Cloudinary,
 * with no separate upload or transformation call. Cloudinary generates a
 * frame-capture image on the fly whenever a video delivery URL's file
 * extension is swapped for an image format (jpg/png) - this is standard
 * documented Cloudinary behavior, not a custom transform. Returns "" for
 * the local-disk fallback (no Cloudinary account configured) since there's
 * no frame-extraction pipeline for that dev-only path.
 */
export function deriveVideoThumbnail(url: string, provider: "cloudinary" | "local"): string {
  if (provider !== "cloudinary") return "";
  return url.replace(/\.[a-z0-9]+$/i, ".jpg");
}

export { cloudinary };
